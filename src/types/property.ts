export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  status: "For Sale" | "For Rent";
  propertyType: "flat" | "villa" | "plot";
  bhk: number;
  city: string;
  images: string[];
  description: string;
  amenities: string[];
  mapLocation?: string;
  createdAt: string;
  updatedAt: string;
}