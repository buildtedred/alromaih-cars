"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditVariationForm() {
  const searchParams = useSearchParams();
  const variationId = searchParams.get("id"); // ✅ Get `id` from URL
  const router = useRouter();

  const [variation, setVariation] = useState({
    name: "",
    colorName: "",
    colorHex: "",
    price: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (variationId) fetchVariation();
  }, [variationId]);

  // ✅ Fetch existing variation
  const fetchVariation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/supabasPrisma/othervariations/${variationId}`
      );
      const fetchedVariation = response.data;

      // Ensure images are formatted correctly
      const formattedImages = fetchedVariation.images.map((img) =>
        typeof img === "string" ? { url: img, name: img.split("/").pop() } : img
      );

      setVariation({ ...fetchedVariation, images: formattedImages });
    } catch (error) {
      setError("Failed to load variation");
    } finally {
      setLoading(false);
    }
  };


  

  // ✅ Handle input changes
const handleVariationChange = (field, value) => {
  setVariation((prev) => ({ ...prev, [field]: value }));
};

  // ✅ Upload new images to Supabase
  const uploadImages = async (files) => {
    if (!files.length) return;
    setLoading(true);
    const uploadedImages = await Promise.all(
      [...files].map(async (file) => {
        const fileName = `cars/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from("Alromaih")
          .upload(fileName, file);
        if (error) return null;
        return {
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${fileName}`,
          name: fileName,
        };
      })
    );
    setVariation((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages.filter((img) => img !== null)],
    }));
    setLoading(false);
  };

  // ✅ Remove image from Supabase storage
  const removeImage = async (imageIndex, fileName) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setLoading(true);
    await supabase.storage.from("Alromaih").remove([fileName]); // ✅ Remove from Supabase
    setVariation((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== imageIndex), // ✅ Remove from state
    }));
    setLoading(false);
  };

  // ✅ Submit updated variation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/supabasPrisma/othervariations/${variationId}`, {
        ...variation,
        images: variation.images.map((img) => img.url), // ✅ Ensure correct image format
      });
      alert("Variation updated successfully!");
      router.push("/dashboard/cars/new"); // ✅ Redirect after update
    } catch (error) {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Variation</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border p-4 rounded-lg shadow"
      >
        <Input
          placeholder="Variation Name"
          value={variation.name}
          onChange={(e) => handleVariationChange("name", e.target.value)}
          required
        />
        <Input
          placeholder="Color Name"
          value={variation.colorName}
          onChange={(e) => handleVariationChange("colorName", e.target.value)}
          required
        />
        <Input
          placeholder="Color HEX"
          value={variation.colorHex}
          onChange={(e) => handleVariationChange("colorHex", e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={variation.price}
          onChange={(e) => handleVariationChange("price", e.target.value)}
          required
        />

        {/* ✅ Upload new images */}
        <input
          type="file"
          multiple
          onChange={(e) => uploadImages(e.target.files)}
        />

        {/* ✅ Display existing images */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {variation.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {variation.images.map((img, imgIndex) => (
                <div key={imgIndex} className="relative">
                  <img
                    src={img.url ? img.url : img} // Handle both object & string formats
                    alt="Variation"
                    className="w-full h-20 object-cover"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    onClick={() =>
                      removeImage(imgIndex, img.name ? img.name : img)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Updating..." : "Update Variation"}
        </Button>
      </form>
    </div>
  );
}
