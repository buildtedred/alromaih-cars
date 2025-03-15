"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload, XCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AddCarForm() {
  const router = useRouter();

  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandId, setBrandId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await axios.get("/api/supabasPrisma/carbrands");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }
    fetchBrands();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const { data, error } = await supabase.storage.from("Alromaih").upload(`cars/${Date.now()}_${file.name}`, file);
      if (error) {
        console.error("Upload error:", error);
        setLoading(false);
        return;
      }
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${data.path}`;
      setImage(imageUrl);
      setPreview(imageUrl);
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (image) {
      const fileName = image.split('/').pop();
      await supabase.storage.from("Alromaih").remove([`cars/${fileName}`]);
      setImage(null);
      setPreview(null);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setUploadStatus(null);
    setLoading(true);

    if (!model || !year || !brandId || !image) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/supabasPrisma/cars", {
        model,
        year,
        brandId,
        image
      });

      if (response.status !== 201) {
        throw new Error("Failed to add car");
      }

      setUploadStatus("Car added successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/cars");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error adding car:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/cars">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cars
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Car</h1>
      </div>

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      {uploadStatus && <Alert><AlertTitle>Status</AlertTitle><AlertDescription>{uploadStatus}</AlertDescription></Alert>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardHeader>
            <CardTitle>Add Car Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Model</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} required />
            <Label>Year</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
            <Label>Select Brand</Label>
            <Select onValueChange={setBrandId} value={brandId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input id="image" type="file" accept="image/*" className="hidden"onChange={handleImageChange} />
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Car</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}