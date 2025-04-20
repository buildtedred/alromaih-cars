"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context
const DetailContext = createContext(null);

// Custom hook to use the detail context
export const useDetailContext = () => {
  return useContext(DetailContext);
};

export const DetailProvider = ({ children }) => {
  const [car_Details, setcar_Details] = useState(null);
  
const [searchbrands, setbrands] = useState("")
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedDetails = localStorage.getItem("car_Details");
    if (storedDetails) {
      setcar_Details(JSON.parse(storedDetails));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever car_Details changes
  useEffect(() => {
    if (car_Details) {
      localStorage.setItem("car_Details", JSON.stringify(car_Details));
    }
  }, [car_Details]);


  return (
    <DetailContext.Provider value={{ car_Details, loading, setcar_Details,setbrands,searchbrands }}>
      {children}
    </DetailContext.Provider>
  );
};
