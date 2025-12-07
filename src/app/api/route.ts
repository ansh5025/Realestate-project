import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location");
    const budget = searchParams.get("budget");
    const propertyType = searchParams.get("propertyType");
    const bhk = searchParams.get("bhk");

    const filters: any = {};

    if (location) {
      filters.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      filters.price = { gte: min, lte: max };
    }

    if (propertyType && propertyType !== "all") {
      filters.propertyType = propertyType;
    }

    if (bhk && bhk !== "all") {
      filters.bhk = bhk;
    }

    const properties = await prisma.property.findMany({
      where: filters,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Received data:", data);

    // ---- Safe Images Handling ----
    let imagesArray: string[] = [];

    if (typeof data.images === "string") {
      imagesArray = data.images
        .split(",")
        .map((x: string) => x.trim())
        .filter(Boolean);
    } else if (Array.isArray(data.images)) {
      imagesArray = data.images;
    } else {
      imagesArray = [];
    }

    // ---- Safe Amenities Handling ----
    let amenitiesArray: string[] = [];

    if (typeof data.amenities === "string") {
      amenitiesArray = data.amenities
        .split(",")
        .map((x: string) => x.trim())
        .filter(Boolean);
    } else if (Array.isArray(data.amenities)) {
      amenitiesArray = data.amenities;
    } else {
      amenitiesArray = [];
    }

    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        location: data.location,
        price: Number(data.price),
        area: Number(data.area),
        status: data.status,
        propertyType: data.propertyType,
        bhk: Number(data.bhk),
        images: imagesArray,
        description: data.description,
        amenities: amenitiesArray,
        mapLocation: data.mapLocation,
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to add property" }, { status: 500 });
  }
}
