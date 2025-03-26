"use client";

import { useState, useEffect } from "react";

const API_URL = "https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaih";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([""]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  async function handleSubmit(formData) {
    try {
      const data = Object.fromEntries(formData.entries());
      data.brand = { name: formData.get("brand_name"), image: formData.get("brand_image") };
      data.model = { name: formData.get("model_name"), image: formData.get("model_image") };
      data.additional_images = additionalImages.filter((img) => img.trim() !== "");

      const options = {
        method: carId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      const response = await fetch(carId ? `${API_URL}/${carId}` : API_URL, options);
      if (!response.ok) throw new Error("Failed to save car");

      alert(carId ? "Car updated successfully!" : "Car added successfully!");
      fetchCars();
      setCarId(null);
      setFormData({});
      setAdditionalImages([""]);
    } catch (error) {
      console.error("Error saving car:", error);
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete car");
        alert("Car deleted successfully!");
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Car Management</h2>
      <form action={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 shadow-md rounded-lg mb-6">
        <input type="text" name="brand_name" defaultValue={formData.brand_name} className="border p-2 rounded w-full" required />
        <input type="text" name="brand_image" defaultValue={formData.brand_image} className="border p-2 rounded w-full" required />
        <input type="text" name="model_name" defaultValue={formData.model_name} className="border p-2 rounded w-full" required />
        <input type="text" name="model_image" defaultValue={formData.model_image} className="border p-2 rounded w-full" required />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded col-span-2">
          {carId ? "Update Car" : "Add Car"}
        </button>
      </form>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Brand</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border">
              <td>{car.brand?.name}</td>
              <td>{car.model?.name}</td>
              <td>${car.price}</td>
              <td>
                <button onClick={() => handleDelete(car.id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarManagement;