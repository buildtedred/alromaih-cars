import React from 'react'
import CarGallery from '../../../MyComponents/car-gallery';


// Fetch car details
const fetchCarDetails = async (slug) => {
  try {
    const response = await fetch(`https://xn--mgbml9eg4a.com/api/car_models/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch car details: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching car details:", error.message);
    return null;
  }
};

const page = async ({ params }) => {

  const slug = (await params).slug
  console.log(" slug", slug)

  const carDetails = await fetchCarDetails(slug);

  return (
    <div>
      <CarGallery car_Details={carDetails.data}/>
    </div>
  )
}

export default page
