"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  Calendar,
  Tag,
  Palette,
  DollarSign,
  ImageIcon,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Share2,
  Heart,
  Info,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CarDetail({ id }) {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageTitle, setSelectedImageTitle] = useState("");

  useEffect(() => {
    if (id) {
      fetchCarDetails(id);
    }
  }, [id]);

  async function fetchCarDetails(carId) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/supabasPrisma/cars/${carId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch car details. Status: ${response.status}`
        );
      }

      const text = await response.text();
      let data;

      try {
        // Try to parse the response as JSON
        data = JSON.parse(text);
      } catch (parseError) {
        // If parsing fails, it's likely HTML or another format
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          throw new Error(
            "The API returned an HTML page instead of JSON. The endpoint might not exist or there's a server error."
          );
        } else {
          throw new Error(
            `Failed to parse response as JSON: ${parseError.message}`
          );
        }
      }

      setCar(data);
    } catch (error) {
      console.error("Error fetching car details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const openImagePreview = (images, title) => {
    setSelectedImages(images);
    setSelectedImageTitle(title);
    setImagePreviewOpen(true);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="flex gap-2 overflow-x-auto py-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-20 flex-shrink-0 rounded-md"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-destructive/15 p-6 rounded-lg text-destructive">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Error Loading Car Details</h2>
          </div>
          <p className="mb-4">{error}</p>
          <Button onClick={() => fetchCarDetails(id)}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Render no data state
  if (!car) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-muted p-6 rounded-lg text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/dashboard/cars">View All Cars</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/dashboard/cars" className="hover:underline">
              Cars
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground font-medium truncate">
              {car.model}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to favorites</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button asChild>
            <Link href={`/dashboard/cars/${car.id}/edit`}>Edit Car</Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Car images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0] || "/placeholder.svg"}
                alt={car.model}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.svg?height=400&width=600";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {car.images && car.images.length > 0 && (
              <Button
                className="absolute bottom-4 right-4"
                onClick={() => openImagePreview(car.images, car.model)}
              >
                <ImageIcon className="mr-2 h-4 w-4" /> View All Images
              </Button>
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2 pb-4">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openImagePreview(car.images, car.model)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${car.model} image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=80&width=80";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Car details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="variations">Variations</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Model
                  </h3>
                  <p className="text-lg">{car.model}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Year
                  </h3>
                  <p className="text-lg">{car.year}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Brand
                  </h3>
                  <div className="flex items-center gap-2">
                    {car.brand?.image && (
                      <div className="h-8 w-8 rounded overflow-hidden bg-muted">
                        <img
                          src={car.brand.image || "/placeholder.svg"}
                          alt={car.brand.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "/placeholder.svg?height=32&width=32";
                          }}
                        />
                      </div>
                    )}
                    <p className="text-lg">{car.brand?.name || "Unknown"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Variations
                  </h3>
                  <p className="text-lg">{car.otherVariations?.length || 0}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">About this car</h3>
                <p className="text-muted-foreground">
                  {car.model} by {car.brand?.name || "Unknown"}, manufactured in{" "}
                  {car.year}.
                  {car.otherVariations?.length > 0
                    ? ` Available in ${
                        car.otherVariations.length
                      } different variation${
                        car.otherVariations.length > 1 ? "s" : ""
                      }.`
                    : " No variations available for this model."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-6">
              {car.spacification && car.spacification.length > 0 ? (
                <div className="space-y-6">
                  {car.spacification.map((spec, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {spec.title || `Specification Group ${index + 1}`}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {spec.details?.map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="flex justify-between p-3 bg-muted/50 rounded-md"
                          >
                            <span className="text-muted-foreground">
                              {detail.label}
                            </span>
                            <span className="font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No Specifications Available
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    This car doesn't have any specifications listed.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="variations" className="space-y-6">
              {car.otherVariations && car.otherVariations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  {car.otherVariations.map((variation) => (
                    <Card key={variation.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-muted mt-4">
                        {variation.images && variation.images.length > 0 ? (
                          <img
                            src={variation.images[0] || "/placeholder.svg"}
                            alt={variation.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/placeholder.svg?height=200&width=300";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}

                        {variation.images && variation.images.length > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute bottom-2 right-2"
                            onClick={() =>
                              openImagePreview(variation.images, variation.name)
                            }
                          >
                            <ImageIcon className="mr-1 h-3 w-3" /> View Images
                          </Button>
                        )}
                      </div>

                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">
                            {variation.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <div
                                className="h-3 w-3 rounded-full border"
                                style={{
                                  backgroundColor:
                                    variation.colorHex || "#cccccc",
                                }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {variation.colorName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="px-3 py-1 text-base"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            {variation.price?.toLocaleString() || "N/A"}
                          </Badge>

                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/variations/${variation.id}`}
                            >
                              View Details
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/cars/new/EditVariationForm?id${variation.id}`}
                            >
                             Edit
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No Variations Available
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    This car doesn't have any variations listed.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{car.model}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {car.year}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" /> {car.brand?.name || "Unknown"}
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Car Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="font-medium">
                    {car.brand?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variations:</span>
                  <span className="font-medium">
                    {car.otherVariations?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span className="font-medium">{car.images?.length || 0}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/cars/${car.id}/edit`}>
                    Edit Car Details
                  </Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                    <Plus className="mr-2 h-4 w-4" /> Add Variation
                  </Link>
                </Button>


              
              </div>
            </CardContent>
          </Card>

          {car.otherVariations && car.otherVariations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Variations</h3>

              <div className="space-y-2">
                {car.otherVariations.map((variation) => (
                  <div
                    key={variation.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{
                          backgroundColor: variation.colorHex || "#cccccc",
                        }}
                      />
                      <span>{variation.name}</span>
                    </div>
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {variation.price?.toLocaleString() || "N/A"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {car.brand && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Brand Information</h3>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-md">
                {car.brand.image && (
                  <div className="h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={car.brand.image || "/placeholder.svg"}
                      alt={car.brand.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=48&width=48";
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{car.brand.name}</h4>
                  <Link
                    href={`/dashboard/brands/${car.brand.id}`}
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    View brand details <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Images for {selectedImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedImages.length > 0 ? (
              <div className="space-y-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-1">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${selectedImageTitle} image ${index + 1}`}
                            className="max-h-[60vh] w-auto max-w-full object-contain rounded-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <div className="grid grid-cols-6 gap-2">
                  {selectedImages.map((image, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="aspect-square rounded-md overflow-hidden border cursor-pointer">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Image {index + 1}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No images available</h3>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
