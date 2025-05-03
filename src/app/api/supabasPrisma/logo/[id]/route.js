import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// GET one logo by ID
export async function GET(_, { params }) {
  const logo = await prisma.logo.findUnique({ where: { id: params.id } });
  return NextResponse.json(logo);
}

// UPDATE logo
export async function PUT(req, { params }) {
  const data = await req.json();
  const updated = await prisma.logo.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updated);
}

// DELETE logo
export async function DELETE(_, { params }) {
  await prisma.logo.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
