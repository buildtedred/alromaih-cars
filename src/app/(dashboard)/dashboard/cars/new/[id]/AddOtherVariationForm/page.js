"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddOtherVariationForm() {
  const { id: carId } = useParams();
  const [variation, setVariation] = useState({
    name: "",
    colorName: "",
    colorHex: "",
    price: "",
    images: [],
  });
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    if (carId) fetchVariations();
  }, [carId]);

  const fetchVariations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/supabasPrisma/cars/${carId}`);
      console.log("object",response.data)
      setVariations(response.data);
    } catch (error) {
      setError("Failed to fetch variations");
    } finally {
      setLoading(false);
    }
  };

  const handleVariationChange = (field, value) => {
    setVariation((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImages = async (files) => {
    if (!files.length) return;
    setLoading(true);
    const uploadedImages = await Promise.all(
      [...files].map(async (file) => {
        const fileName = `cars/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from("Alromaih").upload(fileName, file);
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

  const removeImage = async (imageIndex, fileName) => {
    setLoading(true);
    await supabase.storage.from("Alromaih").remove([fileName]);
    setVariation((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== imageIndex),
    }));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId || !variation.name || !variation.colorName || !variation.colorHex || variation.images.length === 0 || !variation.price) {
      alert("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/supabasPrisma/othervariations/${editingId}`, {
          carId,
          ...variation,
          images: variation.images.map((img) => img.url),
        });
        alert("Variation updated successfully!");
      } else {
        await axios.post("/api/supabasPrisma/othervariations", {
          carId,
          ...variation,
          images: variation.images.map((img) => img.url),
        });
        alert("Variation added successfully!");
      }
      setVariation({ name: "", colorName: "", colorHex: "", price: "", images: [] });
      setEditingId(null);
      fetchVariations();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteVariation = async (id) => {
    if (!confirm("Are you sure you want to delete this variation?")) return;
    setLoading(true);
    await axios.delete(`/api/supabasPrisma/othervariations/${id}`);
    setVariations(variations.filter((variation) => variation.id !== id));
    setLoading(false);
  };



  const router = useRouter(); // ✅ Initialize router
  
  const editVariation = (variation) => {
    router.push(`/dashboard/cars/new/EditVariationForm?id=${variation.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit Variation" : "Add Variation"}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-6 border p-4 rounded-lg shadow">
        <Input placeholder="Variation Name" value={variation.name} onChange={(e) => handleVariationChange("name", e.target.value)} required />
        <Input placeholder="Color Name" value={variation.colorName} onChange={(e) => handleVariationChange("colorName", e.target.value)} required />
        <Input placeholder="Color HEX" value={variation.colorHex} onChange={(e) => handleVariationChange("colorHex", e.target.value)} required />
        <Input type="number" placeholder="Price" value={variation.price} onChange={(e) => handleVariationChange("price", e.target.value)} required />
        <input type="file" multiple onChange={(e) => uploadImages(e.target.files)} />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {variation.images.map((img, imgIndex) => (
            <div key={imgIndex} className="relative">
              <img src={img.url} alt="Variation" className="w-full h-20 object-cover" />
              <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full" onClick={() => removeImage(imgIndex, img.name)}>✖</button>
            </div>
          ))}
        </div>
        <Button type="submit" onClick={handleSubmit} disabled={loading} className="mt-4">
          {editingId ? "Update Variation" : "Submit Variation"}
        </Button>
      </div>
      <h2 className="text-xl font-bold mt-8">Existing Variations</h2>
      <table className="w-full border mt-4">
        <tbody>
          {variations?.otherVariations?.map((item) => (
            <tr key={item.id} className="text-center">
              {console.log(item)}
              <td><img src={item.images[0]} alt={item.name} className="h-12 mx-auto" /></td>
              <td>{item.name}</td>
              <td>{item.colorName}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => editVariation(item)} className="text-blue-500"><Edit /></button>
                <button onClick={() => deleteVariation(item)} className="text-red-500 ml-2"><Trash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
