"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

const OdooContext = createContext();

export function OdooProvider({ children }) {
  ////////////////////// Product Template Data ////////////////////
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get("/api/odoo");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  ///////////////////////////////// Logo API /////////////////////
  const [logo, setLogo] = useState([]);
  const [loadingLogo, setLoadingLogo] = useState(true);

  const fetchLogo = useCallback(async () => {
    setLoadingLogo(true);
    try {
      const response = await axios.get("/api/logo");
      setLogo(response.data);
    } catch (error) {
      console.error("Error fetching logo:", error);
    } finally {
      setLoadingLogo(false);
    }
  }, []);

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  //////////////////////// Brand API //////////////////////////
  const [brand, setBrand] = useState([]);
  const [loadingBrand, setLoadingBrand] = useState(true);
  // console.log("Brand data:", brand);

  const fetchBrand = useCallback(async () => {
    setLoadingBrand(true);
    try {
      const response = await axios.get("/api/carsBrand");
      setBrand(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingBrand(false);
    }
  }, []);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  //////////////////////// Memoized Context Value //////////////////////////
  const contextValue = useMemo(() => ({
    products,
    loadingProducts,
    logo,
    loadingLogo,
    brand,
    loadingBrand,
  }), [products, loadingProducts, logo, loadingLogo, brand, loadingBrand]);

  return (
    <OdooContext.Provider value={contextValue}>
      {children}
    </OdooContext.Provider>
  );
}

export function useOdoo() {
  return useContext(OdooContext);
}
