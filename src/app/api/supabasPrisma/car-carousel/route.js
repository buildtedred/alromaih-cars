import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// CREATE carousel item
export async function POST(req) {
  const data = await req.json();
  const item = await prisma.carCarousel.create({ data });
  return NextResponse.json(item);
}

// GET all carousel items
export async function GET() {
  const items = await prisma.carCarousel.findMany({
  });
  return NextResponse.json(items);
}
