"use client";
import React, { createContext, useState, useEffect } from "react";

// Create Context
const SlidesContext = createContext();

// Provider component
export const SlidesProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using fetch()
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://xn--mgbml9eg4a.com/api/custom_slides", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.data) {
          // Prevent unnecessary state updates if the data is the same
          if (JSON.stringify(slides) !== JSON.stringify(data.data)) {
            setSlides(data.data);
          }
        } else {
          setError("No slides found");
        }
      } catch (err) {
        setError(err.message || "Error fetching slides");
      } finally {
        setLoading(false);
      }
    };

    // Call fetch function only if slides are not already set
    if (!slides.length) {
      fetchSlides();
    }
  }, [slides.length]);

  return (
    <SlidesContext.Provider value={{ slides, loading, error }}>
      {children}
    </SlidesContext.Provider>
  );
};

// Custom hook to use context
export const useSlides = () => {
  return React.useContext(SlidesContext);
};
