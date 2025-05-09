import { NextResponse } from 'next/server';


import prisma from '@/lib/prisma'; 

const allowedModels = {
  fueltype: 'fuelType',
  transmissiontype: 'transmissionType',
  conditiontype: 'conditionType',
  wheeldrivetype: 'wheelDriveType', 
  bodytype: 'bodyType',
  safetyrating: 'safetyRating',
  insurancestatus: 'insuranceStatus',
};

function getModel(type) {
  const modelKey = allowedModels[type.toLowerCase()];
  if (!modelKey || !prisma[modelKey]) {
    throw new Error('Invalid model type');
  }
  return prisma[modelKey];
}

// GET all records
export async function GET(req, { params }) {
  try {
    const {type} = await params;
    const model = await getModel(type);
    const data = await model.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// CREATE a new record
export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const model = getModel(params.type);
    const created = await model.create({ data: body });
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// UPDATE a record
export async function PUT(req, { params }) {
  try {
    const { id, ...rest } = await req.json();
    if (!id) throw new Error('ID is required');
    const model = getModel(params.type);
    const updated = await model.update({ where: { id }, data: rest });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE a record
export async function DELETE(req, { params }) {
  try {
    const { id } = await req.json();
    if (!id) throw new Error('ID is required');
    const model = getModel(params.type);
    const deleted = await model.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
