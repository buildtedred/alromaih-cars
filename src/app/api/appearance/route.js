// app/api/appearance/route.js
import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const latest = await prisma.appearanceSettings.findFirst({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: latest })
}

export async function POST(req) {
  const body = await req.json()
  const newSetting = await prisma.appearanceSettings.create({
    data: { settings: body },
  })
  return NextResponse.json({ data: newSetting })
}
