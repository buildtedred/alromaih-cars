import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { detect } from 'detect-browser';

// Cache for geo IP data (in-memory, consider Redis for production)
const geoCache = new Map();

export async function POST(req) {
  try {
    // Parse request body
    const { productId, additionalData } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required" },
        { status: 400 }
      );
    }

    // Get client information
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get("user-agent") || "Unknown";
    const referrer = reqHeaders.get("referer") || "Direct";
    const ipAddress = getClientIp(reqHeaders);
    
    // Get browser and OS info
    const browserInfo = detect(userAgent);
    
    // Get location information from ipapi.co
    const location = await getLocationFromIpApi(ipAddress);
    
    // Prepare complete tracking data
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
      location: {
        ip: ipAddress,
        country: location.country_name,
        countryCode: location.country,
        region: location.region,
        regionCode: location.region_code,
        city: location.city,
        postalCode: location.postal,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
        currency: location.currency,
        asn: location.asn,
        isp: location.org,
      },
      additionalData: additionalData || null,
    };

    // Save to database
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
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

// Helper functions
function getClientIp(headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp =  headers.get("x-real-ip");
  return (forwardedFor?.split(",")[0] || realIp || "0.0.0.0").trim();
}

function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad|android|touch/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

async function getLocationFromIpApi(ip) {
  // Skip for localhost or invalid IPs
  // if (ip === '127.0.0.1' || !isValidIp(ip)) {
  //   return getDefaultLocation();
  // }

  // // Check cache first
  // if (geoCache.has(ip)) {
  //   return geoCache.get(ip);
  // }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    // console.log("objectssssssssssssssssss", response);
    
    if (!response.ok) {
      throw new Error(`IP API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'IP API error');
    }

    // Cache the result for 1 hour
    geoCache.set(ip, data);
    setTimeout(() => geoCache.delete(ip), 3600000);

    return data;
  } catch (error) {
    console.warn(`GeoIP lookup failed for ${ip}:`, error.message);
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

function isValidIp(ip) {
  // Simple IP validation regex
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}