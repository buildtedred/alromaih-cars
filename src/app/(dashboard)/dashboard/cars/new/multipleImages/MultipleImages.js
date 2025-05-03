"use client"

import { useState } from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ImageGallery from "../../../images-gallery/image-gallery"

export default function MultipleImages({ images, setImages, disabled }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Handle selecting images from the gallery
  const handleSelectMultipleImages = (selectedImages) => {
    // Set the selected images directly
    setImages((prevImages) => [...prevImages, ...selectedImages])
    setIsGalleryOpen(false)
  }

  // Remove an image from the selection
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {/* Select from gallery button */}
          <Button
            type="button"
            variant="default"
            size="sm"
            className="text-xs h-7 rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsGalleryOpen(true)}
            disabled={disabled}
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Select from Gallery
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-brand-light rounded-[5px] p-6 text-center mt-4 hover:border-brand-dark transition-colors">
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="h-8 w-8 text-brand-primary/60 mb-2" />
            <p className="text-xs text-muted-foreground mb-2">No images selected</p>
            <p className="text-xs text-muted-foreground">Select images from gallery</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-[5px] overflow-hidden border border-brand-light shadow-sm">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-brand-primary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-[5px] border-brand-light">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-primary">Select Images from Gallery</DialogTitle>
            <DialogDescription>Choose multiple images from your gallery to use for this car.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelectMultiple={handleSelectMultipleImages} multiSelect={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
