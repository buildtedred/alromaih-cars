"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarDetail } from "../car-detail"

export default function CarDetailPage() {
  const params = useParams()
  const { slug } = params
  const [language, setLanguage] = useState("en") // Default language is English

  return (
    <div className="container mx-auto px-3 py-3 max-w-6xl">
      <Tabs defaultValue={language} onValueChange={setLanguage} className="mb-4">
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <CarDetail slug={slug} language={language} />
    </div>
  )
}
