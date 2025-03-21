"use client"

import { useParams } from "next/navigation"
import CarDetail from "../car-detail"


export default function CarDetailPage() {
  const params = useParams()
  const id = params.id

  return <CarDetail id={id} />
}

