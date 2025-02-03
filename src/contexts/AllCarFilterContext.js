"use client";
import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    brands: {},
    year: "",
    fuelTypes: [],
    transmission: [],
    seats: [],
  });
  const [sortOption, setSortOption] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(9);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://xn--mgbml9eg4a.com/api/car_models");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.status === "success") {
          setCars(data.data);
        } else {
          throw new Error("Failed to fetch car data: " + data.message);
        }
      } catch (error) {
        setError("Error fetching car data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
      if (filters.year && car.year_of_manufacture.toString() !== filters.year.toString()) return false;
      if (filters.fuelTypes.length > 0 && !car.vehicle_fuel_types.some((fuel) => filters.fuelTypes.includes(fuel.fuel_type.en))) return false;
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.name.en.transmission)) return false;
      if (filters.seats.length > 0 && !filters.seats.includes(car.seating_capacity)) return false;
      if (Object.keys(filters.brands).length > 0) {
        const carBrand = Object.keys(filters.brands).find((brand) => brand.toLowerCase() === car.brand_name.en.toLowerCase());
        if (!carBrand || (filters.brands[carBrand].length > 0 && !filters.brands[carBrand].includes(car.name.en.name))) {
          return false;
        }
      }
      return true;
    });
  }, [cars, filters]);

  const sortedCars = useMemo(() => {
    return [...filteredCars].sort((a, b) => {
      switch (sortOption) {
        case "price_low_to_high":
          return a.price - b.price;
        case "price_high_to_low":
          return b.price - a.price;
        case "year_newest_first":
          return b.year_of_manufacture - a.year_of_manufacture;
        default:
          return 0;
      }
    });
  }, [filteredCars, sortOption]);

  const currentCars = sortedCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage);

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + (filter.length > 0 ? 1 : 0);
      }
      if (typeof filter === "object") {
        return count + (Object.keys(filter).length > 0 ? 1 : 0);
      }
      return count + (filter ? 1 : 0);
    }, 0);
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000000],
      brands: {},
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    });
    setCurrentPage(1);
  };

  return (
    <CarContext.Provider value={{ cars, filteredCars, currentCars, loading, error, filters, sortOption, currentPage, carsPerPage, appliedFiltersCount, setFilters, setSortOption, setCurrentPage, clearAllFilters }}>
      {children}
    </CarContext.Provider>
  );
};
