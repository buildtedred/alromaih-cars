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
  // console.log(" ddddddddd",logos[0]?.image_url)
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get('https://xn--mgbml9eg4a.com/api/logos',{
          headers: {
            // If needed, add custom headers here, like authentication tokens:
            // 'Authorization': `Bearer YOUR_TOKEN`,
            'Content-Type': 'application/json',
          },
        }); // Adjust API URL if needed
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
