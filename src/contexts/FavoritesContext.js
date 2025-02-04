"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Create context
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Update localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Function to toggle favorite
  const handleFavorite = (car) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.name.en.slug === car.name.en.slug);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.name.en.slug !== car.name.en.slug);
      } else {
        return [...prevFavorites, car];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, handleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context
export const useFavorites = () => {
  return useContext(FavoritesContext);
};
