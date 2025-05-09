import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Cache for geo IP data to reduce API calls
const geoCache = new Map();

export async function POST(req) {
  

  // Parse request body
  let body;
  try {
    body = await req.json();
    if (!body) {
      throw new Error('Empty request body');
    }
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    return NextResponse.json(
      { success: false, message: 'Invalid JSON format' },
      { status: 400 }
    );
  }

  // Validate required fields
  const { productId } = body;
  
  try {
    // Extract client information
    const headers = req.headers;
    const ipAddress = getClientIp(headers);
    const userAgent = headers.get('user-agent') || 'Unknown';
    const referrer = headers.get('referer') || 'Direct';

    // Get geo location (with caching)
    const geo = await getGeoLocation(ipAddress);

    // Prepare complete view data
    const viewData = {
      productId:productId,
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

    // Save to database
    const view = await prisma.productView.create({
      data: {
        productId: productId,
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to get client IP
function getClientIp(headers) {
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  
  // Get first IP in X-Forwarded-For if exists
  const ip = (forwardedFor?.split(',')[0] || realIp || '0.0.0.0').trim();
  
  // Handle localhost cases
  return ip === '::1' ? '127.0.0.1' : ip;
}

// Enhanced geo location with caching
async function getGeoLocation(ip) {
  // Skip API call for localhost or invalid IPs

  if (ip === '127.0.0.1' || !isValidIp(ip)) {
    return { city: null, country: null, region: null, timezone: null };
  }

  // Check cache first
  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) throw new Error('IP API request failed');
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'IP API error');
    }

    const result = {
      data
    };

    // Cache the result for 1 hour
    geoCache.set(ip, result);
    setTimeout(() => geoCache.delete(ip), 3600000);

    return result;
  } catch (error) {
    console.warn(`GeoIP lookup failed for ${ip}:`, error.message);
    return { city: null, country: null, region: null, timezone: null };
  }
}

// Basic IP validation
function isValidIp(ip) {
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
}

// Device detection helpers
function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  if (/ipad|android|touch/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent) {
  const browsers = {
    'chrome': /chrome|chromium|crios/i,
    'firefox': /firefox|fxios/i,
    'safari': /safari/i,
    'edge': /edge/i,
    'opera': /opera|opr/i,
    'ie': /msie|trident/i
  };
  
  for (const [name, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) return name;
  }
  return 'Unknown';
}

function getOS(userAgent) {
  const os = {
    'windows': /windows nt/i,
    'macos': /macintosh|mac os x/i,
    'linux': /linux/i,
    'android': /android/i,
    'ios': /iphone|ipad|ipod/i
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