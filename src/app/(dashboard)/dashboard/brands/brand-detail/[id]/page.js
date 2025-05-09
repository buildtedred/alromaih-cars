"use client"

import { useEffect, useState } from "react";
import BrandDetail from "../brand-detail"


export default function Page({ params }) {
    const [views, setViews] = useState([]);
    useEffect(() => {
      const trackView = async () => {
        try {
          const response = await fetch('/api/track-view', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: params?.id }) // Replace with actual product ID
          })
          const result = await response.json();
  
          if (!response.ok || !result.success) {
            console.error('Tracking failed:', result.message);
          } else {
            console.log('Product view tracked:', result.data);
          }
        } catch (error) {
          console.error('Network error tracking product view:', error);
        }
      };
  
      if (params?.id) {
        trackView();
      }
    }, [params?.id]);



  return <BrandDetail id={params.id} />
}
