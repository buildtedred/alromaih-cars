"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, Upload, XCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();

  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandId, setBrandId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        const response = await axios.get(`/api/supabasPrisma/cars/${id}`);
        const data = response.data;
        setModel(data.model);
        setYear(data.year);
        setBrandId(data.brandId);
        setImage(data.image);
        setPreview(data.image);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    async function fetchBrands() {
      try {
        const response = await axios.get("/api/supabasPrisma/carbrands");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }
    fetchCar();
    fetchBrands();
  }, [id]);

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

    try {
      const response = await axios.put(`/api/supabasPrisma/cars/${id}`, {
        model,
        year,
        brandId,
        image
      });

      if (response.status !== 200) {
        throw new Error("Failed to update car");
      }

      setUploadStatus("Car updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/cars");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating car:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/cars">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cars
        </Link>
      </Button>
      <h1 className="text-2xl font-bold">Edit Car</h1>
      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      {uploadStatus && <Alert><AlertTitle>Status</AlertTitle><AlertDescription>{uploadStatus}</AlertDescription></Alert>}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader><CardTitle>Car Details</CardTitle></CardHeader>
          <CardContent>
            <Label>Model</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} required />
            <Label>Year</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
            <Label>Select Brand</Label>
            <Select onValueChange={setBrandId} value={brandId}><SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger><SelectContent>{brands.map((brand) => (<SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>))}</SelectContent></Select>
            <Label>Image</Label>
            <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
          </CardContent>
          <CardFooter><Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Car</Button></CardFooter>
        </form>
      </Card>
    </div>
  );
}