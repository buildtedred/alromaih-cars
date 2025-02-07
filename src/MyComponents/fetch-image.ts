"use server"

export async function fetchImageAsBase64(imageUrl: string) {
  try {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const base64String = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = response.headers.get("content-type") || "image/jpeg"
    return `data:${mimeType};base64,${base64String}`
  } catch (error) {
    console.error("Error fetching image:", error)
    return null
  }
}

