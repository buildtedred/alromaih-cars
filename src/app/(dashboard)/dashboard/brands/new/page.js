"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

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

    if (!image) {
      setError("Brand image is required");
      return;
    }

    try {
      setLoading(true);

      // Upload image to Supabase storage
      const { data, error: uploadError } = await supabase.storage.from("Alromaih").upload(`brands/${Date.now()}_${image.name}`, image);
      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${data.path}`;

      const payload = {
        name,
        image: imageUrl,
      };

      const response = await axios.post("/api/supabasPrisma/carbrands", payload);

      if (response.status !== 201) {
        throw new Error(response.data.error || "Failed to create brand");
      }

      setUploadStatus("Brand created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/brands");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error creating brand:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/brands">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Car Brand</h1>
        <p className="text-muted-foreground">Create a new car brand to add to your catalog</p>
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
            <CardDescription>Enter the details for the new car brand</CardDescription>
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
                      <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
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
              Create Brand
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}