import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Cache for geo IP data to reduce API calls
const geoCache = new Map();

export async function POST(req) {
  const reqHeaders = headers(); // Get headers using next/headers

  let body;
  try {
    body = await req.json();
    if (!body) {
      throw new Error('Empty request body');
    }
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    return NextResponse.json({ success: false, message: 'Invalid JSON format' }, { status: 400 });
  }

  const { productId } = body;

  try {
    const ipAddress = getClientIp(reqHeaders);
    const userAgent = reqHeaders.get('user-agent') || 'Unknown';
    const referrer = reqHeaders.get('referer') || 'Direct';

    const geo = await getGeoLocation(ipAddress);

    const viewData = {
      productId,
      ipAddress,
      userAgent,
      referrer,
      geo: {
        data: geo,
      },
      device: {
        type: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        os: getOS(userAgent),
      },
    };

    const view = await prisma.productView.create({
      data: {
        productId,
        data: viewData,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: view.id,
        productId: view.productId,
        viewedAt: view.viewedAt,
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

function getClientIp(headers) {
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const ip = (forwardedFor?.split(',')[0] || realIp || '0.0.0.0').trim();
  return ip === '::1' ? '127.0.0.1' : ip;
}

async function getGeoLocation(ip) {
  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) throw new Error("GeoIP fetch failed");

    const data = await res.json();

    const result = {
      city: data.city,
      country: data.country_name,
      region: data.region,
      timezone: data.timezone,
    };

    geoCache.set(ip, result);
    setTimeout(() => geoCache.delete(ip), 3600000);

    return result;
  } catch (error) {
    console.warn(`Geo lookup failed for ${ip}:`, error.message);
    return { city: null, country: null, region: null, timezone: null };
  }
}

function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet|ipad|android|touch/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent) {
  const browsers = {
    chrome: /chrome|chromium|crios/i,
    firefox: /firefox|fxios/i,
    safari: /safari/i,
    edge: /edge/i,
    opera: /opera|opr/i,
    ie: /msie|trident/i,
  };
  for (const [name, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) return name;
  }
  return 'Unknown';
}

function getOS(userAgent) {
  const os = {
    windows: /windows nt/i,
    macos: /macintosh|mac os x/i,
    linux: /linux/i,
    android: /android/i,
    ios: /iphone|ipad|ipod/i,
  };
  for (const [name, regex] of Object.entries(os)) {
    if (regex.test(userAgent)) return name;
  }
  return 'Unknown';
}



export async function GET() {
  try {
    const views = await prisma.productView.findMany({
      orderBy: { viewedAt: "desc" }, // Optional: latest first
    });

    return NextResponse.json({ success: true, data: views });
  } catch (error) {
    console.error("Error fetching product views:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch product views" }, { status: 500 });
  }
}