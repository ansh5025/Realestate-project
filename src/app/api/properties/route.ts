import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ======================= GET ==========================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const location = searchParams.get("location") || "";
    const budget = searchParams.get("budget") || "";
    const propertyType = searchParams.get("propertyType") || "";
    const bhk = searchParams.get("bhk") || "";

    let whereClause: any = {};

    if (location) {
      whereClause.OR = [
        { location: { contains: location, mode: "insensitive" } },
        { title: { contains: location, mode: "insensitive" } }
      ];
    }

    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      whereClause.price = { gte: min, lte: max };
    }

    if (propertyType) whereClause.propertyType = propertyType;
    if (bhk) whereClause.bhk = parseInt(bhk);

    const properties = await db.property.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }
    });

    // convert json string → array
    const formatted = properties.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      amenities: JSON.parse(p.amenities || "[]"),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

// ======================= POST ==========================
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Incoming images:", data.images);

    // SAFE HANDLING OF IMAGES
    let imagesArray: string[] = [];
    if (typeof data.images === "string") {
      imagesArray = data.images.split(",").map((x: string) => x.trim());
    } else if (Array.isArray(data.images)) {
      imagesArray = data.images;
    }

    // SAFE HANDLING OF AMENITIES
    let amenitiesArray: string[] = [];
    if (typeof data.amenities === "string") {
      amenitiesArray = data.amenities.split(",").map((x: string) => x.trim());
    } else if (Array.isArray(data.amenities)) {
      amenitiesArray = data.amenities;
    }

    const newProperty = await db.property.create({
      data: {
        title: data.title,
        location: data.location,
        price: Number(data.price),
        area: Number(data.area),
        status: data.status,
        propertyType: data.propertyType,
        bhk: Number(data.bhk),
        images: JSON.stringify(imagesArray),
        amenities: JSON.stringify(amenitiesArray),
        mapLocation: data.mapLocation,
        description: data.description ?? "",
      }
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}