"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

const OdooContext = createContext();

export function OdooProvider({ children }) {
  ////////////////////// Product Template Data ////////////////////
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch("/api/odoo");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  ///////////////////////////////// Logo API /////////////////////
  const [logo, setLogo] = useState([]);
  const [loadingLogo, setLoadingLogo] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      setLoadingLogo(true);
      try {
        const response = await fetch("/api/logo");
        const data = await response.json();
        setLogo(data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      } finally {
        setLoadingLogo(false);
      }
    };
    fetchLogo();
  }, []);

  //////////////////////// Brand API //////////////////////////
  const [brand, setBrand] = useState([]);
  const [loadingBrand, setLoadingBrand] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      setLoadingBrand(true);
      try {
        const response = await fetch("/api/carsBrand");
        const data = await response.json();
        setBrand(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoadingBrand(false);
      }
    };
    fetchBrand();
  }, []);

  ////////////////////////////// test data api start//////////////////////////
  const [testData, setTestData] = useState([]);
  const [loadingTestData, setLoadingTestData] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      setLoadingTestData(true);
      try {
        const response = await fetch("/api/testdata");
        const data = await response.json();
        setTestData(data);
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoadingTestData(false);
      }
    };
    fetchTestData();
  }, []);

  /////////////////// slider data start //////////////////////
  const [sliderData, setSliderData] = useState([]);
  const [loadingSliderData, setLoadingSliderData] = useState(true);

  useEffect(() => {
    const fetchSliderData = async () => {
      setLoadingSliderData(true);
      try {
        const response = await fetch("/api/slider");
        const data = await response.json();
        setSliderData(data.en_US);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      } finally {
        setLoadingSliderData(false);
      }
    };
    fetchSliderData();
  }, []);

  //////////////////////// Memoized Context Value //////////////////////////
  const contextValue = useMemo(() => ({
    products,
    loadingProducts,
    logo,
    loadingLogo,
    brand,
    loadingBrand,
    testData,
    loadingTestData,
    sliderData,
    loadingSliderData,
  }), [
    products, loadingProducts,
    logo, loadingLogo,
    brand, loadingBrand,
    testData, loadingTestData,
    sliderData, loadingSliderData,
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