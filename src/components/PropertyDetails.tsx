"use client";

import { Property } from "@/types/property";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, IndianRupee, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface PropertyDetailsProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetails({ property, isOpen, onClose }: PropertyDetailsProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!property) return null;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price}`;
  };

  const changeSlide = (direction: number) => {
    setCurrentSlideIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex >= property.images.length) return 0;
      if (newIndex < 0) return property.images.length - 1;
      return newIndex;
    });
  };

  const statusColor = property.status === "For Sale" ? "bg-green-500" : "bg-blue-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {property.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Image Slider */}
          <div className="relative h-96 bg-gray-200 overflow-hidden rounded-lg">
            {property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentSlideIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                      onClick={() => changeSlide(-1)}
                    >
                      &lt;
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                      onClick={() => changeSlide(1)}
                    >
                      &gt;
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
            <Badge className={`absolute top-2 right-2 ${statusColor} text-white`}>
              {property.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Property Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Property Details</span>
                  <div className="flex items-center">
                    <IndianRupee className="h-5 w-5 text-blue-700" />
                    <span className="text-2xl font-bold text-blue-700">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {property.bhk > 0 ? `${property.bhk} BHK` : "Plot"}
                    </Badge>
                    <Badge variant="secondary">
                      {property.area} sq ft
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {property.propertyType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{property.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            {property.mapLocation && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={property.mapLocation}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Property Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}