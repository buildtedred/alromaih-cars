"use server"

export async function fetchImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("The URL does not point to a valid image")
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64String = Buffer.from(arrayBuffer).toString("base64")
    return `data:${contentType};base64,${base64String}`
  } catch (error) {
    console.error("Error fetching image:", error)
    if (error instanceof Error) {
      return `Error: ${error.message}`
    }
    return "An unknown error occurred while fetching the image"
  }
}
