'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context
const LogoContext = createContext(null);

// Custom hook to use the logo context
export const useLogoContext = () => {
  return useContext(LogoContext);
};

export const LogoProvider = ({ children }) => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logos using axios
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get('http://localhost:8069/api/logos'); // Adjust API URL if needed
        setLogos(response.data.data); // Set the logos data
      } catch (err) {
        setError(err.message || 'Error fetching logos');
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  return (
    <LogoContext.Provider value={{ logos, loading, error }}>
      {children}
    </LogoContext.Provider>
  );
};
