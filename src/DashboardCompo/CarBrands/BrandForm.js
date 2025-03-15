"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const BrandForm = ({ type, brand, setOpenModal, refreshBrands }) => {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(brand?.image || "");

  async function handleSubmit(e) {
    e.preventDefault(); // ✅ Form ka default submit behavior rokna zaroori hai
    setLoading(true);

    try {
      const formData = new FormData(e.target); // ✅ Form data get karna
      const url = type === "add" ? "/api/supabasPrisma/carbrands" : `/api/supabasPrisma/carbrands/${brand?.id}`;
      const method = type === "add" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save brand");

      await refreshBrands(); // ✅ Refresh brand list

      // ✅ Form Reset
      formRef.current?.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewImage("");

      setOpenModal(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // ✅ Loading state update hoga
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input placeholder="Brand Name" name="name" defaultValue={type === "edit" ? brand?.name : ""} required />

      {/* Image Preview */}
      {previewImage && (
        <div className="flex justify-center">
          <Image src={previewImage} alt="Brand Image" width={100} height={100} className="rounded-md" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        name="image"
        required={type === "add"}
        className="border p-2 rounded-md"
        onChange={(e) => setPreviewImage(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : "")}
      />

      <Button type="submit" className={`w-full ${type === "add" ? "bg-blue-600" : "bg-green-600"} hover:opacity-90`} disabled={loading}>
        {loading ? "Processing..." : type === "add" ? "Add Brand" : "Save Changes"}
      </Button>
    </form>
  );
};

export default BrandForm;
