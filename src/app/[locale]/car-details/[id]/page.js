import React from 'react'
import axios from 'axios';
import CarGallery from '@/MyComponents/car-gallery';
import { NextIntlClientProvider } from 'next-intl'


// Fetch car details
// const fetchCarDetails = async (slug) => {
//   try {
//     const response = await fetch(`https://xn--mgbml9eg4a.com/api/car_models/${slug}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch car details: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching car details:", error.message);
//     return null;
//   }
// };

////////////////////////////////////////////////////////////////

// let data = JSON.stringify({
//   query: `query GetProductBySlug {
//   ProductProduct(slug: "jetour-t2-luxury-2025") {
//     id
//     slug
//     name
//     standard_price
//     is_car_product
//     list_price
//     total_value
//     qty_available
//   }
// }`,
//   variables: {}
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://xn--mgbml9eg4a.com/odooapi',
//   headers: { 
//     'x-api-key': 'xuOvE2VqKlMRKXgUYXAMgOzp4go6sSYf', 
//     'Content-Type': 'application/json', 
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log("hhhhhhhhh",JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });

////////////////////////////////////////////////////////////////

////////////////////////////////////////  vehcal information test data start //////////////////
// Fetch car details
const fetchCarDetails = async (id) => {
  try {
    const response = await fetch(`https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaih/${id}`);
    console.log(" slug hhhhhhhhhh", response)
    if (!response.ok) {
      throw new Error(`Failed to fetch car details: ${response.data}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching car details:", error.message);
    return null;
  }
};
////////////////////////////////////////  vehcal information test data end //////////////////

const page = async ({ params }) => {
  const id = (await params).id
  console.log("idddd",params)
  
  const carDetails = await fetchCarDetails(id);

  const  locale  = (await params).locale;

  return (
    <div>
      <NextIntlClientProvider locale={locale}>
      <CarGallery car_Details={carDetails}/>
      </NextIntlClientProvider>
    </div>
  )
}

export default page