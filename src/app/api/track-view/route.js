import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { detect } from "detect-browser";

const geoCache = new Map(); // In-memory cache for geolocation

export async function POST(req) {
  try {
    const { productId, additionalData } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required" },
        { status: 400 }
      );
    }

    const reqHeaders = headers();
    const userAgent = reqHeaders.get("user-agent") || "Unknown";
    const referrer = reqHeaders.get("referer") || "Direct";
    const ipAddress = getClientIp(reqHeaders);
    const browserInfo = detect(userAgent);
    const location = await getLocationFromIpInfo(ipAddress);

    const viewData = {
      productId,
      ipAddress,
      userAgent,
      referrer,
      timestamp: new Date().toISOString(),
      device: {
        type: getDeviceType(userAgent),
        browser: browserInfo?.name || "Unknown",
        os: browserInfo?.os || "Unknown",
        version: browserInfo?.version || "Unknown",
      },
      location,
      additionalData: additionalData || null,
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
        location: viewData.location,
      },
    });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const views = await prisma.productView.findMany({
      orderBy: { viewedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: views });
  } catch (error) {
    console.error("Error fetching product views:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product views" },
      { status: 500 }
    );
  }
}

// ------------------ Helper Functions ------------------

function getClientIp(headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  return (forwardedFor?.split(",")[0] || realIp || "0.0.0.0").trim();
}

function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad|android|touch/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

async function getLocationFromIpInfo(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "0.0.0.0") {
    return getDefaultLocation();
  }

  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }

  const token = "b27da79f6ebfed";
  const url = `https://ipinfo.io/${ip}?token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`IPINFO failed with status ${res.status}`);
    }

    const data = await res.json();
    const [latitude, longitude] = data.loc?.split(",") || [];

    const location = {
      ip: data.ip,
      country_name: data.country,
      country: data.country,
      region: data.region,
      region_code: null,
      city: data.city,
      postal: data.postal,
      latitude,
      longitude,
      timezone: data.timezone,
      currency: null,
      asn: null,
      org: data.org,
    };

    geoCache.set(ip, location);
    setTimeout(() => geoCache.delete(ip), 60 * 60 * 1000); // 1 hour

    return location;
  } catch (error) {
    console.warn(`IPINFO lookup failed for ${ip}:`, error.message);
    return getDefaultLocation();
  }
}

function getDefaultLocation() {
  return {
    ip: null,
    country_name: null,
    country: null,
    region: null,
    region_code: null,
    city: null,
    postal: null,
    latitude: null,
    longitude: null,
    timezone: null,
    currency: null,
    asn: null,
    org: null,
  };
}
