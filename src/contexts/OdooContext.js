"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const OdooContext = createContext();

export function OdooProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
//   console.log("data in context",products[0]?.name)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get("/api/odoo");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <OdooContext.Provider value={{ products, loading }}>
      {children}
    </OdooContext.Provider>
  );
}

export function useOdoo() {
  return useContext(OdooContext);
}
