"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, PlusCircle, XCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
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
import Multipleimages from "./updateMultipleImage/Multipleimages";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import {} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import EditeSpecifications from "./editSpecifications/EditeSpecifications";
import EditVariations from "./editVariations/EditVariations";


// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();

  // State variables
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]); // Multiple images
  const [specifications, setSpecifications] = useState([]); // ✅ Specifications
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);

  // console.log("specifications", variations);

  // Fetch car details and brands on component mount
  useEffect(() => {
    async function fetchCar() {
      try {
        const response = await axios.get(`/api/supabasPrisma/cars/${id}`);
        const data = response.data;
        setModel(data.model);
        setYear(data.year);
        setBrandId(data.brandId);

        // Ensure images are structured correctly for preview
        const formattedImages =
          data.images?.map((imgUrl) => ({
            url: imgUrl,
            name: imgUrl.split("/").pop(), // Extract filename for deletion
          })) || [];

        setImages(formattedImages);
        setSpecifications(data.spacification || []); // ✅ Load existing specifications
        setVariations(response.data.variations || []);
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

  // Handle multiple image change
  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: null,
    }));
    setImages((prev) => [...prev, ...files]);
  };

  // Upload multiple images
  const uploadImage = async (image, index) => {
    setLoadingIndex(index);
    const fileName = `cars/${Date.now()}-${image.file.name}`;
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
  /////////////////////////////////// save the specifications/////////////////////
  // ✅ Change Specification Title
  const handleSpecTitleChange = (index, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index].title = value;
    setSpecifications(updatedSpecs);
  };

  // ✅ Change Specification Detail
  const handleSpecDetailChange = (specIndex, detailIndex, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[specIndex].details[detailIndex][field] = value;
    setSpecifications(updatedSpecs);
  };

  // ✅ Add New Specification
  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", details: [] }]);
  };

  // ✅ Add New Detail to a Specification
  const addSpecDetail = (specIndex) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[specIndex].details.push({ label: "", value: "" });
    setSpecifications(updatedSpecs);
  };

  // ✅ Remove Specific Detail
  const removeSpecDetail = (specIndex, detailIndex) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[specIndex].details = updatedSpecs[specIndex].details.filter(
      (_, i) => i !== detailIndex
    );
    setSpecifications(updatedSpecs);
  };

  // ✅ Remove Entire Specification
  const removeSpecification = (specIndex) => {
    setSpecifications(specifications.filter((_, i) => i !== specIndex));
  };
  /////////////////////////////////// save the specifications/////////////////////
  ///////////////////////////////////////// save the VARIATION STRAT/////////////////////
  // ✅ Handle Adding a New Variation
  const addVariation = () => {
    setVariations([
      ...variations,
      { name: "", colorName: "", colorHex: "", images: [], price: "" },
    ]);
  };

  // ✅ Handle Updating a Variation Field
  const updateVariation = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  // ✅ Handle Image Upload for Variation
  const uploadVariationImage = async (variationIndex, file) => {
    if (!file) return;

    const fileName = `cars/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("Alromaih")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Failed to upload image");
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${fileName}`;
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].images = [
      ...updatedVariations[variationIndex].images,
      imageUrl,
    ];
    setVariations(updatedVariations);
  };

  // ✅ Handle Removing a Variation Image
  const removeVariationImage = async (variationIndex, imageIndex) => {
    const updatedVariations = [...variations];
    const fileName = updatedVariations[variationIndex].images[imageIndex]
      .split("/")
      .pop();

    await supabase.storage.from("Alromaih").remove([fileName]);
    updatedVariations[variationIndex].images.splice(imageIndex, 1);
    setVariations(updatedVariations);
  };

  // ✅ Handle Removing a Variation
  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  ///////////////////////////////////////// save the VARIATION end/////////////////////
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

    try {
      // ✅ Validate Specifications Before Sending
      const formattedSpecifications = specifications
        .filter((spec) => spec?.title) // ❌ Skip invalid entries
        .map((spec) => ({
          title: spec.title?.trim() || "", // ✅ Ensure title is string
          details: spec.details
            .filter((detail) => detail?.label && detail?.value) // ❌ Skip empty details
            .map((detail) => ({
              label: detail.label?.trim() || "",
              value: detail.value?.trim() || "",
            })),
        }));

      // ✅ Check if formattedSpecifications is valid
      if (!formattedSpecifications.length) {
        alert("Please add at least one valid specification");
        setLoading(false);
        return;
      }

      // console.log("🚀 Submitting data:", {
      //   model,
      //   year,
      //   brandId,
      //   images,
      //   formattedSpecifications,
      // });

      const response = await axios.put(`/api/supabasPrisma/cars/${id}`, {
        model,
        year,
        brandId,
        images: images.map((img) => img.url), // Ensure only URLs are sent
        specifications: formattedSpecifications,
        variations,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update car");
      }

      setUploadStatus("✅ Car updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/cars");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("❌ Error updating car:", error);
      setError(error.response?.data?.error || "Failed to update car");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back to Cars Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/cars">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cars
        </Link>
      </Button>
      <h1 className="text-2xl font-bold">Edit Car</h1>

      {/* Error and Status Alerts */}
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
          <CardHeader>
            <CardTitle>Edit Car Details</CardTitle>
          </CardHeader>

          {/* Multiple Image Preview & Upload */}
          <Multipleimages
            loadingIndex={loadingIndex}
            setImages={setImages}
            deleteImage={deleteImage}
            uploadImage={uploadImage}
            images={images}
            handleMultipleImageChange={handleMultipleImageChange}
          />
          <CardContent>
            {/* Model Input */}
            <Label>Model</Label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />

            {/* Year Input */}
            <Label>Year</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />

            {/* Brand Select */}
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
            </Select>

            {/* //////////////////////////////////  spacification start ////////////////// */}
            <EditeSpecifications
              removeSpecification={removeSpecification}
              removeSpecDetail={removeSpecDetail}
              addSpecDetail={addSpecDetail}
              addSpecification={addSpecification}
              handleSpecDetailChange={handleSpecDetailChange}
              handleSpecTitleChange={handleSpecTitleChange}
              specifications={specifications}
            />

            {/* //////////////////////////////////  spacification end ////////////////// */}

            {/* //////////////////////////////////  variation start ////////////////// */}
            <EditVariations
              variations={variations}
              updateVariation={updateVariation}
              addVariation={addVariation}
              removeVariation={removeVariation}
              uploadVariationImage={uploadVariationImage}
              removeVariationImage={removeVariationImage}
            />
            {/* //////////////////////////////////  variation end ////////////////// */}
          </CardContent>

          <CardFooter>
            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Update Car
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
