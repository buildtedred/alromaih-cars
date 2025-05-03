import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CREATE a logo
export async function POST(req) {
    try {
        const data = await req.json();

        const { title, imageUrl } = data;
        console.log("dddddddddddddd", data)
        if (!title || !imageUrl) {
            return NextResponse.json(
                { error: "Both 'name' and 'imageUrl' are required." },
                { status: 400 }
            );
        }

        const logo = await prisma.logo.create({
            data: {
                title,
                imageUrl
            },
        });

        return NextResponse.json(logo, { status: 201 });
    } catch (error) {
        console.error("Error creating logo:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 } // ✅ fixed syntax
        );
    }
}

// GET all logos
export async function GET() {
    try {
        const logos = await prisma.logo.findMany();
        return NextResponse.json(logos);
    } catch (error) {
        console.error("Error fetching logos:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
