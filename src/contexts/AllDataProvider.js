"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for brands
const BrandsContext = createContext();

// Provider component
export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://xn--mgbml9eg4a.com/api/brands');
      setBrands(response.data);

    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <BrandsContext.Provider value={{ brands, loading, error, fetchBrands }}>
      {children}
    </BrandsContext.Provider>
  );
};

// Custom hook to use the BrandsContext
export const useBrands = () => {
  const context = useContext(BrandsContext);
  if (!context) {
    throw new Error('useBrands must be used within a BrandsProvider');
  }
  return context;
};
