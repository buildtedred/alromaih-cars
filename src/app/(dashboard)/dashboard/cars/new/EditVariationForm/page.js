import { Suspense } from "react";
import React from 'react'
import EditVariationForm from './EditVariationForm'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>} className="container mx-auto py-8">
    <EditVariationForm/>
  </Suspense>

  )
}

export default page