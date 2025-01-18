"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const SlidesContext = createContext();

// Provider component
export const SlidesProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using Axios
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://xn--mgbml9eg4a.com/api/custom_slides");
        if (response.data && response.data.data) {
          // Prevent unnecessary state updates if the data is the same
          if (JSON.stringify(slides) !== JSON.stringify(response.data.data)) {
            setSlides(response.data.data);
          }
        } else {
          setError("No slides found");
        }
        // console.log("Slides data:", response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function if slides are not already set
    if (!slides.length) {
      fetchSlides();
    }
  }, [slides.length]);  // Empty dependency array ensures this runs only once

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
