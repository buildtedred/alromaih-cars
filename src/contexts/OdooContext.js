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
  ////////////////////////////// test data api start//////////////////////////

  /////////////////// all data start//////////////////////
  const [testData, settestData] = useState([]);
  const [loadingtestData, setLoadingtestData] = useState(true);
  // console.log("testData data:", testData);

  const fetchtestData = useCallback(async () => {
    setLoadingtestData(true);
    try {
      const response = await axios.get("/api/testdata");
      settestData(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingtestData(false);
    }
  }, []);
  
  useEffect(() => {
    fetchtestData();
  }, [fetchtestData]);
  /////////////////// all data end//////////////////////

    /////////////////// slider data start//////////////////////
    const [sliderData, setsliderData] = useState([]);
    const [loadingsliderData, setLoadingsliderData] = useState(true);
    // console.log("sliderData data:", sliderData);
  
    const fetchsliderData = useCallback(async () => {
      setLoadingsliderData(true);
      try {
        const response = await axios.get("/api/slider");
        setsliderData(response.data.en_US);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoadingsliderData(false);
      }
    }, []);
    
    useEffect(() => {
      fetchsliderData();
    }, [fetchsliderData]);
    /////////////////// slider data end//////////////////////
  ////////////////////////////// test data api end//////////////////////////

  //////////////////////// Memoized Context Value //////////////////////////
  const contextValue = useMemo(() => ({
    products,
    loadingProducts,
    logo,
    loadingLogo,
    brand,
    loadingBrand,

    testData,
    loadingtestData,

    sliderData,
    loadingsliderData,
  }), [products,
    loadingProducts,
    logo,
    loadingLogo,
    brand,
    loadingBrand,

    testData,
    loadingtestData,

    sliderData,
    loadingsliderData, 
  ]);

  return (
    <OdooContext.Provider value={contextValue}>
      {children}
    </OdooContext.Provider>
  );
}

export function useOdoo() {
  return useContext(OdooContext);
}
