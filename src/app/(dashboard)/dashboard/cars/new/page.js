"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleImages from "./multipleImages/MultipleImages";

import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddSpecifications from "./AddSpecifications/AddSpecifications";
import AddVariations from "./AddVariations/AddVariations";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddCarForm() {
  const router = useRouter();

  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]); // Multiple images
  const [specifications, setSpecifications] = useState([]); // ✅ Dynamic specifications
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);

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

  // Handle multiple image change
  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file), // Show preview instantly
      name: null,
    }));
    setImages((prev) => [...prev, ...files]);
  };

  // Upload multiple images
  const uploadImage = async (image, index) => {
    setLoadingIndex(index);
    const fileName = `${Date.now()}-${image.file.name}`;
    const { error } = await supabase.storage
      .from("Alromaih")
      .upload(fileName, image.file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Failed to upload image");
    } else {
      const { data: publicUrl } = supabase.storage
        .from("Alromaih")
        .getPublicUrl(fileName);
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = {
          ...image,
          url: publicUrl.publicUrl,
          name: fileName,
        };
        return newImages;
      });
    }
    setLoadingIndex(null);
  };

  // Delete image
  const deleteImage = async (fileName, index) => {
    setLoadingIndex(index);
    const { error } = await supabase.storage
      .from("Alromaih")
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete image");
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      alert("Image deleted successfully");
    }
    setLoadingIndex(null);
  };

  const removePreview = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /////////////////////////////////////////////////////// spacifications /////////////////////////
  // ✅ Add New Specification Category
  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", details: [] }]);
  };

  // ✅ Remove a Specification Category
  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // ✅ Change Specification Title
  const handleSpecTitleChange = (index, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index].title = value;
    setSpecifications(updatedSpecs);
  };

  // ✅ Add New Detail to a Category
  const addSpecDetail = (index) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index].details.push({ label: "", value: "" });
    setSpecifications(updatedSpecs);
  };

  // ✅ Change Specification Detail
  const handleSpecDetailChange = (specIndex, detailIndex, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[specIndex].details[detailIndex][field] = value;
    setSpecifications(updatedSpecs);
  };

  // ✅ Remove a Specific Detail
  const removeSpecDetail = (specIndex, detailIndex) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[specIndex].details = updatedSpecs[specIndex].details.filter(
      (_, i) => i !== detailIndex
    );
    setSpecifications(updatedSpecs);
  };

  /////////////////////////////////////////////////////// spacifications end/////////////////////////
  ////////////////////////////////////////////////// variation section start //////////////////
  // // ✅ Add a new variation
  // const addVariation = () => {
  //   setVariations([
  //     ...variations,
  //     { name: "", colorName: "", colorHex: "", images: [], price: "" },
  //   ]);
  // };

  // // ✅ Handle Variation Change
  // const handleVariationChange = (index, field, value) => {
  //   const updatedVariations = [...variations];
  //   updatedVariations[index][field] = value;
  //   setVariations(updatedVariations);
  // };

  // // ✅ Upload Image to Supabase
  // const uploadvariationImage = async (variationIndex, file) => {
  //   if (!file) return;

  //   setLoading(true);
  //   const fileName = `cars/${Date.now()}_${file.name}`;
  //   const { error } = await supabase.storage
  //     .from("Alromaih")
  //     .upload(fileName, file);

  //   if (error) {
  //     console.error("Upload error:", error);
  //     alert("Failed to upload image");
  //     setLoading(false);
  //     return;
  //   }

  //   const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${fileName}`;
  //   const updatedVariations = [...variations];
  //   updatedVariations[variationIndex].images.push({
  //     url: imageUrl,
  //     name: fileName,
  //   });
  //   setVariations(updatedVariations);
  //   setLoading(false);
  // };

  // // ✅ Remove Image from Supabase & State
  // const removeImage = async (variationIndex, imageIndex, fileName) => {
  //   setLoading(true);
  //   const { error } = await supabase.storage
  //     .from("Alromaih")
  //     .remove([fileName]);

  //   if (error) {
  //     console.error("Delete error:", error);
  //     alert("Failed to delete image");
  //   } else {
  //     const updatedVariations = [...variations];
  //     updatedVariations[variationIndex].images = updatedVariations[
  //       variationIndex
  //     ].images.filter((_, i) => i !== imageIndex);
  //     setVariations(updatedVariations);
  //   }
  //   setLoading(false);
  // };

  // // ✅ Remove a Variation
  // const removeVariation = (index) => {
  //   setVariations(variations.filter((_, i) => i !== index));
  // };

  ////////////////////////////////////////////////// variation section end //////////////////
  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    // ✅ Check if any image URL is still a blob (not uploaded yet)
    if (images.some((img) => img.url.includes("blob"))) {
      alert("Please upload all images before submitting");
      return;
    }
    setError(null);
    setUploadStatus(null);
    setLoading(true);

    if (!model || !year || !brandId || images.length === 0) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/supabasPrisma/cars", {
        model,
        year,
        brandId,
        images: images.map((img) => img.url), // Corrected mapping syntax
        specifications, // ✅ Send Dynamic Specifications
      
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

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {uploadStatus && (
        <Alert>
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Multiple Image Preview & Upload */}
          <MultipleImages
            handleSpecTitleChange={handleSpecTitleChange}
            uploadImage={uploadImage}
            removePreview={removePreview}
            loadingIndex={loadingIndex}
            images={images}
            handleMultipleImageChange={handleMultipleImageChange}
            deleteImage={deleteImage}
          />
          {/* Multiple Image Preview & Upload */}

          <CardHeader>
            <CardTitle>Add Car Details</CardTitle>
          </CardHeader>

          <CardContent>
            <Label>Model</Label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
            <Label>Year</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <Label>Select Brand</Label>
            <Select onValueChange={setBrandId} value={brandId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
              {/* ////////////////////////////// spacification start /////////////// */}
              {/* Specifications Section */}

              <AddSpecifications
                specifications={specifications}
                addSpecDetail={addSpecDetail}
                handleSpecDetailChange={handleSpecDetailChange}
                removeSpecDetail={removeSpecDetail}
                handleSpecTitleChange={handleSpecTitleChange}
                addSpecification={addSpecification}
                removeSpecification={removeSpecification}
              />
              {/* ////////////////////////////// spacification end /////////////// */}
            </Select>
            {/* ///////////////////////////////////// variation section start ////////////////// */}

            {/* <AddVariations
              variations={variations}
              handleVariationChange={handleVariationChange}
              addVariation={addVariation}
              removeVariation={removeVariation}
              uploadvariationImage={uploadvariationImage}
              removeImage={removeImage}
            /> */}
            {/* ///////////////////////////////////// variation section end ////////////////// */}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add
              Car
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
