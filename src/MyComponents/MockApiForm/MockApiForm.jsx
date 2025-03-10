"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaih";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([""]);
  const [formData, setFormData] = useState({}); // Stores data for editing

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get(API_URL);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  async function handleSubmit(formData) {
    try {
      const data = Object.fromEntries(formData.entries());
      console.log("data from form", data);
      data.brand = { name: formData.get("brand_name"), image: formData.get("brand_image") };
      data.model = { name: formData.get("model_name"), image: formData.get("model_image") };
      data.additional_images = additionalImages.filter((img) => img.trim() !== "");

      if (carId) {
        await axios.put(`${API_URL}/${carId}`, data);
        alert("Car updated successfully!");
      } else {
        await axios.post(API_URL, data);
        alert("Car added successfully!");
      }

      fetchCars();
      setCarId(null);
      setFormData({});
      setAdditionalImages([""]);
    } catch (error) {
      console.error("Error saving car:", error);
    }
  }

  const handleEdit = (car) => {
    setCarId(car.id);
    setFormData({
      brand_name: car.brand?.name || "",
      brand_image: car.brand?.image || "",
      model_name: car.model?.name || "",
      model_image: car.model?.image || "",
      category: car.category || "",
      year: car.year || "",
      color: car.color || "",
      mileage: car.mileage || "",
      transmission: car.transmission || "",
      fuelType: car.fuelType || "",
      power: car.power || "",
      seat: car.seat || "",
      manufacture: car.manufacture || "",
      price: car.price || "",
      availability_status: car.availability_status || "",
      image: car.image || "",
    });

    setAdditionalImages(car.additional_images || [""]);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Car deleted successfully!");
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  const addImageField = () => {
    setAdditionalImages([...additionalImages, ""]);
  };

  const removeImageField = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Car Management</h2>

      <form action={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 shadow-md rounded-lg mb-6">
        <h3 className="col-span-2 font-bold">Brand</h3>
        <input type="text" name="brand_name" defaultValue={formData.brand_name} className="border p-2 rounded w-full" required />
        <input type="text" name="brand_image" defaultValue={formData.brand_image} className="border p-2 rounded w-full" required />

        <h3 className="col-span-2 font-bold">Model</h3>
        <input type="text" name="model_name" defaultValue={formData.model_name} className="border p-2 rounded w-full" required />
        <input type="text" name="model_image" defaultValue={formData.model_image} className="border p-2 rounded w-full" required />

        <input type="text" name="category" defaultValue={formData.category} placeholder="Category" className="border p-2 rounded w-full" required />
        <input type="number" name="year" defaultValue={formData.year} placeholder="Year" className="border p-2 rounded w-full" required />
        <input type="text" name="color" defaultValue={formData.color} placeholder="Color" className="border p-2 rounded w-full" required />
        <input type="number" name="mileage" defaultValue={formData.mileage} placeholder="Mileage" className="border p-2 rounded w-full" required />
        <input type="text" name="transmission" defaultValue={formData.transmission} placeholder="Transmission" className="border p-2 rounded w-full" required />

        <select name="fuelType" defaultValue={formData.fuelType} className="border p-2 rounded w-full" required>
          <option value="">Select Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <input type="text" name="power" defaultValue={formData.power} placeholder="Power (e.g., '203 hp')" className="border p-2 rounded w-full" required />
        <input type="text" name="seat" defaultValue={formData.seat} placeholder="Seat" className="border p-2 rounded w-full" required />

        <h3 className="col-span-2 font-bold">Pricing & Availability</h3>
        <input type="number" name="price" defaultValue={formData.price} placeholder="Price" className="border p-2 rounded w-full" required />
        <input type="text" name="availability_status" defaultValue={formData.availability_status} placeholder="Availability Status" className="border p-2 rounded w-full" required />

        <label>Main Image URL</label>
        <input type="text" name="image" defaultValue={formData.image} placeholder="Main Image URL" className="border p-2 rounded w-full col-span-2" required />

        <h3 className="col-span-2 font-bold">Additional Images</h3>
        {additionalImages.map((img, index) => (
          <div key={index} className="flex items-center col-span-2">
            <input type="text" value={img} onChange={(e) => {
              const newImages = [...additionalImages];
              newImages[index] = e.target.value;
              setAdditionalImages(newImages);
            }} className="border p-2 rounded w-full" required />
            <button type="button" onClick={() => removeImageField(index)} className="bg-red-500 text-white px-2 rounded ml-2">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addImageField} className="bg-green-500 text-white px-2 rounded col-span-2">
          Add Image
        </button>

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
                <button onClick={() => handleEdit(car)} className="bg-yellow-500 text-white px-2 rounded mr-2">Edit</button>
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
