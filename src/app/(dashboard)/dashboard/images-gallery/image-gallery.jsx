"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import { Trash2, RefreshCw, Check, Search, Loader2, ImagePlus, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { usePathname } from "next/navigation"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// The bucket name is hardcoded to "Alromaih" as specified by the user
const BUCKET_NAME = "Alromaih"

export default function ImageGallery({ onSelect, onSelectMultiple, multiSelect = false }) {
  // State management
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(multiSelect)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [duplicateNotification, setDuplicateNotification] = useState(null)

  // Get current pathname to check if we're in the images-gallery page
  const pathname = usePathname()
  const isGalleryPage = pathname === "/dashboard/images-gallery"

  // Refs
  const fileInputRef = useRef(null)

  // Fetch images on component mount
  useEffect(() => {
    fetchImages()
  }, [])

  // Filter images when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredImages(images)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = images.filter((image) => image.name.toLowerCase().includes(query))
    setFilteredImages(filtered)
  }, [searchQuery, images])

  // Function to fetch images from Supabase Storage
  const fetchImages = async () => {
    try {
      setLoading(true)

      // List all files in the bucket
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list()

      if (error) {
        throw error
      }

      // Check if data exists before filtering
      if (!data || data.length === 0) {
        setImages([])
        setFilteredImages([])
        return
      }

      // Filter out folders and get only image files
      const imageFiles = data.filter(
        (file) =>
          file &&
          !file.name.endsWith("/") &&
          (file.metadata?.mimetype?.startsWith("image/") || file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i)),
      )

      // Get public URLs for each image
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name)

          return {
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at,
          }
        }),
      )

      // Sort images by creation date (newest first)
      const sortedImages = imageUrls.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

      setImages(sortedImages)
      setFilteredImages(sortedImages)
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([])
      setFilteredImages([])
    } finally {
      setLoading(false)
    }
  }

  // Function to upload multiple images
  const uploadImages = async (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = files.length
      let completedFiles = 0
      let skippedFiles = 0
      const newImages = []

      // Get existing filenames and their sizes for duplicate checking
      const existingFiles = new Map()
      images.forEach((img) => {
        // Store both name and size to check for exact duplicates
        existingFiles.set(img.name, img.size)
      })

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Clean the filename
        let fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_")

        // Check if file with same name AND size exists (likely the same file)
        const existingFileSize = existingFiles.get(fileName)
        if (existingFileSize === file.size) {
          console.log(`Skipping duplicate file: ${fileName}`)
          setDuplicateNotification(`"${fileName}" already exists in the gallery`)
          setTimeout(() => setDuplicateNotification(null), 3000)
          skippedFiles++
          completedFiles++
          setUploadProgress(Math.round((completedFiles / totalFiles) * 100))
          continue
        }

        // If name exists but size is different, make the filename unique
        if (existingFiles.has(fileName)) {
          const fileExt = fileName.split(".").pop()
          const baseName = fileName.substring(0, fileName.lastIndexOf("."))
          const timestamp = Date.now()
          fileName = `${baseName}_${timestamp}.${fileExt}`
        }

        // Add to our tracking map
        existingFiles.set(fileName, file.size)

        // Upload the file
        const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file)

        if (error) {
          console.error(`Error uploading ${file.name}:`, error)
          continue
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

        // Add to new images array
        newImages.push({
          name: fileName,
          url: publicUrl,
          size: file.size || 0,
          createdAt: new Date().toISOString(),
        })

        // Update progress
        completedFiles++
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100))
      }

      // Add new images to the beginning of the array
      if (newImages.length > 0) {
        setImages((prevImages) => [...newImages, ...prevImages])
        setFilteredImages((prevImages) => {
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            const filtered = newImages.filter((img) => img.name.toLowerCase().includes(query))
            return [...filtered, ...prevImages]
          }
          return [...newImages, ...prevImages]
        })
      }

      // Show message if files were skipped
      if (skippedFiles > 0) {
        console.log(`Skipped ${skippedFiles} duplicate files`)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)

        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = null
        }
      }, 500)
    }
  }

  // Function to delete an image
  const deleteImage = async (imageName, e) => {
    // Prevent the click from selecting the image
    e.stopPropagation()

    try {
      // Remove the file from storage
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([imageName])

      if (error) {
        throw error
      }

      // If the deleted image was selected, clear the selection
      if (selectedImage && selectedImage.name === imageName) {
        setSelectedImage(null)
      }

      // If the deleted image was in the multi-select array, remove it
      if (selectedImages.some((img) => img.name === imageName)) {
        setSelectedImages(selectedImages.filter((img) => img.name !== imageName))
      }

      // Update the state to remove the deleted image
      const updatedImages = images.filter((image) => image.name !== imageName)
      setImages(updatedImages)
      setFilteredImages(
        updatedImages.filter(
          (image) => !searchQuery.trim() || image.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Handle image selection
  const handleImageClick = (image) => {
    if (isMultiSelectMode) {
      // In multi-select mode, toggle the selection
      if (selectedImages.some((img) => img.name === image.name)) {
        setSelectedImages(selectedImages.filter((img) => img.name !== image.name))
      } else {
        setSelectedImages([...selectedImages, image])
      }
    } else {
      // In single-select mode, just set the selected image
      setSelectedImage(image)
    }
  }

  // Check if an image is selected in multi-select mode
  const isImageSelected = (imageName) => {
    return selectedImages.some((img) => img.name === imageName)
  }

  // Toggle multi-select mode
  const toggleMultiSelectMode = (checked) => {
    setIsMultiSelectMode(checked)
    // Clear selections when switching modes
    if (checked) {
      setSelectedImage(null)
      if (selectedImage) {
        setSelectedImages([selectedImage])
      } else {
        setSelectedImages([])
      }
    } else {
      if (selectedImages.length > 0) {
        setSelectedImage(selectedImages[0])
      }
      setSelectedImages([])
    }
  }

  // Confirm selection and close modal
  const confirmSelection = () => {
    if (isMultiSelectMode) {
      if (selectedImages.length > 0 && onSelectMultiple) {
        onSelectMultiple(selectedImages)
      }
    } else {
      if (selectedImage && onSelect) {
        onSelect(selectedImage.url)
      }
    }
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col gap-4">
        {/* Header section with title and buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Image Gallery</h1>

            {/* Multi-select toggle - hide on gallery page */}
            {!isGalleryPage && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="multi-select-mode"
                  checked={isMultiSelectMode}
                  onCheckedChange={toggleMultiSelectMode}
                  className="data-[state=checked]:bg-brand-primary"
                />
                <Label htmlFor="multi-select-mode" className="text-sm">
                  Multi-select
                </Label>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchImages}
              disabled={loading}
              className="rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {/* Upload button */}
            <div className="relative">
              <Input
                ref={fileInputRef}
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={uploadImages}
                className="absolute inset-0 opacity-0 cursor-pointer rounded-[5px]"
                disabled={uploading}
                multiple
              />
              <Button
                size="sm"
                disabled={uploading}
                className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4 mr-1" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Duplicate file notification */}
        {duplicateNotification && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-[5px] text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {duplicateNotification}
          </div>
        )}

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-[5px] border-gray-300"
          />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="w-full">
            <Progress value={uploadProgress} className="h-1.5 rounded-[5px]" />
            <p className="text-xs mt-1 text-center text-muted-foreground">{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Selection info and confirmation button - hide on gallery page */}
        {!isGalleryPage && (
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            {isMultiSelectMode && (
              <Badge variant="outline" className="h-6 rounded-[5px]">
                {selectedImages.length} {selectedImages.length === 1 ? "image" : "images"} selected
              </Badge>
            )}
            <div className={isMultiSelectMode ? "" : "w-full flex justify-end"}>
              <Button
                onClick={confirmSelection}
                disabled={(isMultiSelectMode && selectedImages.length === 0) || (!isMultiSelectMode && !selectedImage)}
                size="sm"
                className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
              >
                {isMultiSelectMode
                  ? selectedImages.length > 0
                    ? `Use ${selectedImages.length} Selected Images`
                    : "Select Images"
                  : selectedImage
                    ? "Use Selected Image"
                    : "Select an Image"}
              </Button>
            </div>
          </div>
        )}

        {/* Gallery content */}
        <div className="flex justify-center">
          <div className="w-full">
            {loading ? (
              // Loading state with skeletons
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                  <div key={item} className="w-full">
                    <Card className="overflow-hidden border-muted rounded-[5px]">
                      <Skeleton className="h-[80px] w-full rounded-[5px]" />
                      <CardContent className="p-1">
                        <Skeleton className="h-2 w-3/4 mb-1 rounded-[5px]" />
                        <Skeleton className="h-2 w-1/4 rounded-[5px]" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : filteredImages.length === 0 ? (
              // Empty state
              <div className="text-center py-8 bg-muted/30 rounded-[5px]">
                {searchQuery ? (
                  <>
                    <h3 className="text-base font-medium mb-1">No images match your search</h3>
                    <p className="text-sm text-muted-foreground">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-medium mb-1">No images found</h3>
                    <p className="text-sm text-muted-foreground">Upload images to see them here</p>
                  </>
                )}
              </div>
            ) : (
              // Image grid
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {filteredImages.map((image) => (
                  <Card
                    key={image.name}
                    className={`overflow-hidden cursor-pointer transition-all border-muted hover:border-brand-primary/50 rounded-[5px] ${
                      (isMultiSelectMode && isImageSelected(image.name)) ||
                      (!isMultiSelectMode && selectedImage?.name === image.name)
                        ? "ring-1 ring-brand-primary"
                        : ""
                    }`}
                    onClick={() => handleImageClick(image)}
                  >
                    {/* Image */}
                    <div className="aspect-square relative flex justify-center items-center overflow-hidden">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        width={150}
                        height={150}
                        className="object-cover"
                        priority={false}
                      />
                      {((isMultiSelectMode && isImageSelected(image.name)) ||
                        (!isMultiSelectMode && selectedImage?.name === image.name)) && (
                        <div className="absolute top-1 right-1 bg-brand-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Image details and delete button */}
                    <CardContent className="p-1 pb-0">
                      <div className="truncate text-[10px]">{image.name}</div>
                      <div className="text-[8px] text-muted-foreground">{formatFileSize(image.size)}</div>
                    </CardContent>

                    {/* Delete button */}
                    <CardFooter className="p-1 pt-0 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-[5px] text-muted-foreground hover:text-destructive"
                        onClick={(e) => deleteImage(image.name, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
