const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const sampleProperties = [
  {
    title: "Spacious 3BHK Apartment in Koregaon Park",
    location: "Koregaon Park, Pune",
    price: 25000000,
    area: 1800,
    status: "For Sale",
    propertyType: "flat",
    bhk: 3,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
    ]),
    description: "Luxurious 3BHK apartment in the heart of Koregaon Park with modern amenities.",
    amenities: JSON.stringify(["Swimming Pool", "Gym", "Parking", "Security", "Lift", "Power Backup", "Garden", "Club House"]),
    mapLocation: "https://maps.google.com/maps?q=Koregaon+Park,Pune&output=embed"
  },

  {
    title: "Modern 2BHK Flat in Kalyani Nagar",
    location: "Kalyani Nagar, Pune",
    price: 12000000,
    area: 1200,
    status: "For Rent",
    propertyType: "flat",
    bhk: 2,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    ]),
    description: "Well-designed flat with modern facilities.",
    amenities: JSON.stringify(["Gym", "Parking", "Security", "Lift", "Power Backup"]),
    mapLocation: "https://maps.google.com/maps?q=Kalyani+Nagar,Pune&output=embed"
  },

  {
    title: "Luxury Villa in Baner",
    location: "Baner, Pune",
    price: 45000000,
    area: 3500,
    status: "For Sale",
    propertyType: "villa",
    bhk: 4,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126"
    ]),
    description: "Stunning villa with private garden and swimming pool.",
    amenities: JSON.stringify(["Swimming Pool", "Garden", "Parking", "Security", "Power Backup"]),
    mapLocation: "https://maps.google.com/maps?q=Baner,Pune&output=embed"
  },

  {
    title: "Residential Plot in Aundh",
    location: "Aundh, Pune",
    price: 8000000,
    area: 2500,
    status: "For Sale",
    propertyType: "plot",
    bhk: 0,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ]),
    description: "Prime residential plot ready for construction.",
    amenities: JSON.stringify(["Gated Community", "Security", "Water Supply"]),
    mapLocation: "https://maps.google.com/maps?q=Aundh,Pune&output=embed"
  },

  {
    title: "1BHK Studio Apartment in Viman Nagar",
    location: "Viman Nagar, Pune",
    price: 8000000,
    area: 650,
    status: "For Rent",
    propertyType: "flat",
    bhk: 1,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ]),
    description: "Compact studio apartment with modern amenities.",
    amenities: JSON.stringify(["Parking", "Security", "Gym", "Lift"]),
    mapLocation: "https://maps.google.com/maps?q=Viman+Nagar,Pune&output=embed"
  },

  {
    title: "3BHK Flat in Magarpatta",
    location: "Magarpatta, Pune",
    price: 18000000,
    area: 1650,
    status: "For Sale",
    propertyType: "flat",
    bhk: 3,
    city: "pune",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ]),
    description: "Premium 3BHK flat with high-end amenities.",
    amenities: JSON.stringify(["Swimming Pool", "Gym", "Parking", "Security", "Lift"]),
    mapLocation: "https://maps.google.com/maps?q=Magarpatta,Pune&output=embed"
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    for (const property of sampleProperties) {
      await db.property.create({ data: property });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await db.$disconnect();
  }
}

seedDatabase();
