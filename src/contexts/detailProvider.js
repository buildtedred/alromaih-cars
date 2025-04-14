"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context
const DetailContext = createContext(null);

// Custom hook to use the detail context
export const useDetailContext = () => {
  return useContext(DetailContext);
};

export const DetailProvider = ({ children }) => {
  const [car_Details, setcar_Details] = useState('');
  const [loading, setLoading] = useState(true);
//   console.log("jjjjjjjjjjjjjjjjjjjj", details);


  return (
    <DetailContext.Provider value={{ car_Details, loading, setcar_Details }}>
      {children}
    </DetailContext.Provider>
  );
};
