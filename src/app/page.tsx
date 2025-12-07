"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDetails } from "@/components/PropertyDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Home, Filter, X, MapPin, Phone, Mail, Building, Star, Shield } from "lucide-react";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Search and filter states
  const [searchLocation, setSearchLocation] = useState("");
  const [searchBudget, setSearchBudget] = useState("all");
  const [searchPropertyType, setSearchPropertyType] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");
  const [filterBhk, setFilterBhk] = useState("all");
  const [filterPropertyType, setFilterPropertyType] = useState("all");

  // New property form states
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    area: "",
    status: "For Sale" as "For Sale" | "For Rent",
    propertyType: "flat" as "flat" | "villa" | "plot",
    bhk: "3",
    images: "",
    description: "",
    amenities: "",
    mapLocation: ""
  });

  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (searchLocation && searchLocation !== "all") params.append("location", searchLocation);
      if (searchBudget && searchBudget !== "all") params.append("budget", searchBudget);
      if (searchPropertyType && searchPropertyType !== "all") params.append("propertyType", searchPropertyType);
      if (filterBudget && filterBudget !== "all") params.append("budget", filterBudget);
      if (filterBhk && filterBhk !== "all") params.append("bhk", filterBhk);
      if (filterPropertyType && filterPropertyType !== "all") params.append("propertyType", filterPropertyType);

      const response = await fetch(`/api/properties?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredProperties(data);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const resetFilters = () => {
    setSearchLocation("");
    setSearchBudget("all");
    setSearchPropertyType("all");
    setFilterBudget("all");
    setFilterBhk("all");
    setFilterPropertyType("all");
    setFilteredProperties(properties);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowAdminPanel(true);
      setShowPasswordModal(false);
      setAdminPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminPanel(false);
    setShowAddPropertyForm(false);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...newProperty,
        images: newProperty.images.split(",").map(url => url.trim()).filter(url => url),
        amenities: newProperty.amenities.split(",").map(amenity => amenity.trim()).filter(amenity => amenity)
      };

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        await fetchProperties();
        setShowAddPropertyForm(false);
        setNewProperty({
          title: "",
          location: "",
          price: "",
          area: "",
          status: "For Sale",
          propertyType: "flat",
          bhk: "3",
          images: "",
          description: "",
          amenities: "",
          mapLocation: ""
        });
        alert("Property added successfully!");
      } else {
        alert("Failed to add property!");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property!");
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pune Property Hub</h1>
                <p className="text-xs text-gray-500">Premium Real Estate</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Buy</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Rent</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Sell</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Agents</a>
            </nav>
            <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              List Property
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Luxury Property" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-20">
            <Badge className="mb-4 bg-blue-500 text-white">Premium Properties</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Home in Pune</h1>
            <p className="text-xl mb-8 text-blue-100">Discover exclusive properties across Pune's most sought-after neighborhoods</p>
            
            <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-1 max-w-5xl mx-auto">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Location, Project, or Landmark"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Select value={searchBudget} onValueChange={setSearchBudget}>
                      <SelectTrigger className="w-full h-12 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Budget Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Budget</SelectItem>
                        <SelectItem value="0-5000000">Under ₹50 Lakhs</SelectItem>
                        <SelectItem value="5000000-10000000">₹50 Lakhs - ₹1 Crore</SelectItem>
                        <SelectItem value="10000000-20000000">₹1 Crore - ₹2 Crores</SelectItem>
                        <SelectItem value="20000000-50000000">₹2 Crores - ₹5 Crores</SelectItem>
                        <SelectItem value="50000000-999999999">Above ₹5 Crores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={searchPropertyType} onValueChange={setSearchPropertyType}>
                      <SelectTrigger className="w-full h-12 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="flat">Apartments</SelectItem>
                        <SelectItem value="villa">Villas</SelectItem>
                        <SelectItem value="plot">Plots</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all h-12">
                    <Search className="mr-2 h-4 w-4" />Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Property Preview Images */}
        <div className="relative z-10 bg-gradient-to-t from-black/50 to-transparent pt-8 pb-4">
          <div className="container mx-auto px-4">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {filteredProperties.slice(0, 8).map((property, index) => (
                <div key={property.id} className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform cursor-pointer relative" onClick={() => handlePropertyClick(property)}>
                  <img 
                    src={property.images[0] || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-xs text-white font-medium truncate">{property.location.split(',')[0]}</p>
                    <p className="text-xs text-blue-200">{formatPrice(property.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Properties</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Localities</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">1500+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      {showAdminPanel && (
        <section className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Shield className="text-blue-600 mr-2 h-5 w-5" />
                    <h3 className="text-xl font-semibold text-gray-800">Admin Panel</h3>
                  </div>
                  <Button variant="outline" onClick={handleAdminLogout} className="border-red-200 text-red-600 hover:bg-red-50">
                    <X className="mr-2 h-4 w-4" />Logout
                  </Button>
                </div>
                
                {!showAddPropertyForm ? (
                  <Button onClick={() => setShowAddPropertyForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Building className="mr-2 h-4 w-4" />
                    Add New Property
                  </Button>
                ) : (
                  <Card className="mt-4 border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="text-gray-800">Add New Property</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddProperty} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                            <Input
                              type="text"
                              value={newProperty.title}
                              onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                              placeholder="e.g., Spacious 3BHK in Koregaon Park"
                              required
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <Input
                              type="text"
                              value={newProperty.location}
                              onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                              placeholder="e.g., Koregaon Park, Pune"
                              required
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <Input
                              type="number"
                              value={newProperty.price}
                              onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                              placeholder="e.g., 25000000"
                              required
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                            <Input
                              type="number"
                              value={newProperty.area}
                              onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                              placeholder="e.g., 1800"
                              required
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Select value={newProperty.status} onValueChange={(value: "For Sale" | "For Rent") => setNewProperty({...newProperty, status: value})}>
                              <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="For Sale">For Sale</SelectItem>
                                <SelectItem value="For Rent">For Rent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                            <Select value={newProperty.propertyType} onValueChange={(value: "flat" | "villa" | "plot") => setNewProperty({...newProperty, propertyType: value})}>
                              <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="flat">Flat</SelectItem>
                                <SelectItem value="villa">Villa</SelectItem>
                                <SelectItem value="plot">Plot</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                            <Select value={newProperty.bhk} onValueChange={(value) => setNewProperty({...newProperty, bhk: value})}>
                              <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 BHK</SelectItem>
                                <SelectItem value="2">2 BHK</SelectItem>
                                <SelectItem value="3">3 BHK</SelectItem>
                                <SelectItem value="4">4+ BHK</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                            <Input
                              type="text"
                              value={newProperty.images}
                              onChange={(e) => setNewProperty({...newProperty, images: e.target.value})}
                              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={newProperty.description}
                            onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                            placeholder="Describe the property..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                          <Input
                            type="text"
                            value={newProperty.amenities}
                            onChange={(e) => setNewProperty({...newProperty, amenities: e.target.value})}
                            placeholder="Swimming Pool, Gym, Parking, Security"
                            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                          <Input
                            type="text"
                            value={newProperty.mapLocation}
                            onChange={(e) => setNewProperty({...newProperty, mapLocation: e.target.value})}
                            placeholder="https://maps.google.com/maps?q=..."
                            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Add Property
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setShowAddPropertyForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Featured Listings</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Properties in Pune</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Handpicked properties from Pune's most desirable neighborhoods</p>
          </div>
          
          {/* Filters Section */}
          <Card className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-gray-800">
                <Filter className="mr-2 h-5 w-5 text-blue-600" />
                Refine Your Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <Select value={filterBudget} onValueChange={setFilterBudget}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Any Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Budget</SelectItem>
                      <SelectItem value="0-5000000">Under ₹50 Lakhs</SelectItem>
                      <SelectItem value="5000000-10000000">₹50 Lakhs - ₹1 Crore</SelectItem>
                      <SelectItem value="10000000-20000000">₹1 Crore - ₹2 Crores</SelectItem>
                      <SelectItem value="20000000-50000000">₹2 Crores - ₹5 Crores</SelectItem>
                      <SelectItem value="50000000-999999999">Above ₹5 Crores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK Type</label>
                  <Select value={filterBhk} onValueChange={setFilterBhk}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Any BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any BHK</SelectItem>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flat">Apartments</SelectItem>
                      <SelectItem value="villa">Villas</SelectItem>
                      <SelectItem value="plot">Plots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters} className="border-gray-300">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Property Listings */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading premium properties...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search criteria to find more properties.</p>
                  <Button variant="outline" onClick={resetFilters} className="mt-4">
                    Reset All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Admin Login Button */}
      {!isAdminLoggedIn && (
        <button
          onClick={() => setShowPasswordModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        >
          <Shield className="h-6 w-6" />
        </button>
      )}

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-gray-800 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Admin Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdminLogin} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Authenticate
                  </Button>
                  <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <Building className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Pune Property Hub</h3>
                  <p className="text-blue-200 text-sm">Premium Real Estate</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Your trusted partner in finding the perfect property in Pune's most prestigious neighborhoods.</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-300 font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-300 font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-300 font-bold">t</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Buy Property</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rent Property</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sell Property</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Popular Areas</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Koregaon Park</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kalyani Nagar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Baner</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Aundh</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Viman Nagar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="mr-3 h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-400">+91 98765 43210</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-400">info@punepropertyhub.com</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Office</div>
                    <div className="text-gray-400">Pune, Maharashtra</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">&copy; 2023 Pune Property Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}