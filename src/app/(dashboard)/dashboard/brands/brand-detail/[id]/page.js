"use client"

import BrandDetail from "../brand-detail"


export default function Page({ params }) {
  return <BrandDetail id={params.id} />
}
