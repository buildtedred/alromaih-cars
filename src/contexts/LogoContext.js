"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Fetch logos using fetch()
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch("https://xn--mgbml9eg4a.com/api/logos", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLogos(data.data); // Set the logos data
      } catch (err) {
        setError(err.message || "Error fetching logos");
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
