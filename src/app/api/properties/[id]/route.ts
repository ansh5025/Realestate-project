import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const property = await db.property.findUnique({
      where: { id: params.id }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...property,
      images: JSON.parse(property.images || "[]"),
      amenities: JSON.parse(property.amenities || "[]")
    });
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
