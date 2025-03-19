"use client"

import { useState } from "react"
import { Upload, X, Loader2, Check, ImagePlus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MultipleImages({
  loadingIndex,
  handleMultipleImageChange,
  uploadImage,
  images,
  setImages,
  deleteImage,
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length) {
      const fileInput = document.getElementById("image-upload")
      if (fileInput) {
        fileInput.files = e.dataTransfer.files
        const event = { target: { files: e.dataTransfer.files } }
        handleMultipleImageChange(event)
      }
    }
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              id="image-upload"
              type="file"
              multiple
              onChange={handleMultipleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <ImagePlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Upload images</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your images here or click to browse</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <Card className="overflow-hidden h-full">
                      <div className="relative aspect-square">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {loadingIndex === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}

                        {/* Delete button for uploaded images */}
                        {img.name && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => deleteImage(img.name, index)}
                            disabled={loadingIndex === index}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>

                      {/* Upload/Remove buttons for new images */}
                      {!img.name && (
                        <div className="p-3 flex justify-center items-center gap-2">
                          <Button
                            size="sm"
                             variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => uploadImage(img, index)}
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <>
                                
                                
                              </>
                            ) : (
                              <>
                               <Upload className="h-4 w-4" />
                               <span className="sr-only">Upload</span>
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-8 w-8 rounded-full"
                            onClick={() => removeImage(index)}
                            disabled={loadingIndex === index}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      )}
                    </Card>

                    {/* Status badge for uploaded images */}
                    {img.name && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Uploaded
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {images.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {images.filter((img) => img.name).length} of {images.length} images uploaded
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

