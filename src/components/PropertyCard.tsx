"use client";

import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price}`;
  };

  const statusColor = property.status === "For Sale" ? "bg-green-500" : "bg-blue-500";

  return (
    <Card 
      className="property-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={property.images[0] || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <Badge className={`status-badge absolute top-2 right-2 ${statusColor} text-white`}>
          {property.status}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="mr-2 h-4 w-4" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-blue-700" />
            <span className="text-2xl font-bold text-blue-700">
              {formatPrice(property.price)}
            </span>
          </div>
          <span className="text-gray-600">{property.area} sq ft</span>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-sm">
            {property.bhk > 0 ? `${property.bhk} BHK` : "Plot"}
          </Badge>
          <Button variant="ghost" className="text-blue-700 hover:text-blue-900 p-0 h-auto">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}