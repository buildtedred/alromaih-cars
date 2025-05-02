import React from 'react'
import CarGallery from '@/MyComponents/Car-Details-page/car-gallery.jsx';
import { NextIntlClientProvider } from 'next-intl'
// import BrandDynomicData from '@/MyComponents/BrandDynomicData/BrandDynomicData';


// Fetch car details
const fetchCarBrands = async (slug) => {
  try {
    const response = await fetch(`https://xn--mgbml9eg4a.com/api/brands/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch car brands: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching car brands:", error.message);
    return null;
  }
};

const page = async ({ params }) => {

  

  const slug = (await params).slug
  
  const carDetails = await fetchCarBrands(slug);
  const  locale  = (await params).locale;
  
  // console.log(" slug from brands", carDetails)
  return (
    <div>
      <NextIntlClientProvider locale={locale}>
   {/* <BrandDynomicData carDetails={carDetails}/> */}
  
      </NextIntlClientProvider>
    </div>
  )
}

export default page
