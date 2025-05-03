"use client"

import CarouselDetail from "../carousel-detail"



export default function Page({ params }) {
  return <CarouselDetail id={params.id} />
}
