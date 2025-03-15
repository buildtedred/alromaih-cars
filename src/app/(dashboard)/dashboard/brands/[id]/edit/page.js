"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params?.id;

  const [brand, setBrand] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    if (!brandId) return;

    async function fetchBrand() {
      try {
        setFetchLoading(true);
        const response = await fetch(`/api/supabasPrisma/carbrands/${brandId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch brand");
        }

        const data = await response.json();
        setBrand(data);
        setName(data.name);
        setPreview(data.image);
      } catch (error) {
        console.error("Error fetching brand:", error);
        setError("Failed to load brand data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    }

    fetchBrand();
  }, [brandId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setUploadStatus(null);

    if (!name.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = preview;
      if (image) {
        // Upload image to Supabase storage
        const { data, error: uploadError } = await supabase.storage.from("Alromaih").upload(`brands/${Date.now()}_${image.name}`, image);
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${data.path}`;
      }

      const payload = {
        name,
        image: imageUrl,
      };

      const response = await axios.put(`/api/supabasPrisma/carbrands/${brandId}`, payload);

      if (response.status !== 200) {
        throw new Error(response.data.error || "Failed to update brand");
      }

      setUploadStatus("Brand updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/brands");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("❌ Error updating brand:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/brands">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
            </Link>
          </Button>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/brands">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Car Brand</h1>
        <p className="text-muted-foreground">Update the details for {brand?.name}</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && !error && (
        <Alert className="mb-6">
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Brand Details</CardTitle>
            <CardDescription>Edit the details for this car brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Brand Logo</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
                <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Label htmlFor="image" className="cursor-pointer flex flex-col items-center">
                  {preview ? (
                    <div className="relative w-full h-40 mb-4">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", preview);
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                    </div>
                  ) : (
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  )}
                  <span className="text-sm font-medium">
                    {preview ? "Change image" : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 2MB)</span>
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/brands">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Brand
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}