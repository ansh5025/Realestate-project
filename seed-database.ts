import { db } from "./src/lib/db";   // correct import

const sampleProperties = [
  {
    title: "Spacious 3BHK Apartment in Koregaon Park",
    location: "Koregaon Park, Pune",
    price: 25000000,
    area: 1800,
    status: "For Sale",
    propertyType: "flat",
    bhk: 3,        // INT not string
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
    ],
    description: "Luxurious 3BHK apartment with modern amenities.",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
    mapLocation: "https://maps.google.com/maps?q=Koregaon+Park,Pune&output=embed"
  },

  {
    title: "3BHK Flat in Magarpatta",
    location: "Magarpatta, Pune",
    price: 18000000,
    area: 1650,
    status: "For Sale",
    propertyType: "flat",
    bhk: 3,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ],
    description: "Spacious flat with premium amenities.",
    amenities: ["Parking", "Security", "Lift", "Power Backup"],
    mapLocation: "https://maps.google.com/maps?q=Magarpatta,Pune&output=embed"
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    await db.property.createMany({
      data: sampleProperties
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding DB:", error);
  } finally {
    await db.$disconnect();
  }
}

seedDatabase();
