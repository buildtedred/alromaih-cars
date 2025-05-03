import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// GET one carousel item
export async function GET(_, { params }) {
  const item = await prisma.carCarousel.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(item);
}

// UPDATE carousel item
export async function PUT(req, { params }) {
  const data = await req.json();
  const updated = await prisma.carCarousel.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE carousel item
export async function DELETE(_, { params }) {
  await prisma.carCarousel.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
