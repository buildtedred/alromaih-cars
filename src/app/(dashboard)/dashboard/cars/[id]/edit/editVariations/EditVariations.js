"use client"

import { useState } from "react"
import { Plus, Trash2, Upload, X, Palette, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker, HexColorInput } from "react-colorful"

// Helper function to convert HEX to RGB
const hexToRgb = (hex) => {
  if (!hex) return { r: 0, g: 0, b: 0 }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

// Helper function to convert RGB to HSL
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Advanced Color Picker Component
const AdvancedColorPicker = ({ color, onChange }) => {
  const [copied, setCopied] = useState(false)

  const rgb = hexToRgb(color || "#000000")
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-64 space-y-4">
      <HexColorPicker color={color || "#000000"} onChange={onChange} className="w-full" />

      <Tabs defaultValue="hex">
        <TabsList className="w-full">
          <TabsTrigger value="hex" className="flex-1">
            HEX
          </TabsTrigger>
          <TabsTrigger value="rgb" className="flex-1">
            RGB
          </TabsTrigger>
          <TabsTrigger value="hsl" className="flex-1">
            HSL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hex" className="mt-2">
          <div className="relative">
            <HexColorInput
              color={color || "#000000"}
              onChange={onChange}
              prefixed
              className="w-full h-9 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => copyToClipboard(color || "#000000")}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy HEX value</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="rgb" className="mt-2">
          <div className="relative">
            <Input value={`${rgb.r}, ${rgb.g}, ${rgb.b}`} readOnly className="pr-9" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => copyToClipboard(`${rgb.r}, ${rgb.g}, ${rgb.b}`)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy RGB value</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="hsl" className="mt-2">
          <div className="relative">
            <Input value={`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`} readOnly className="pr-9" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => copyToClipboard(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy HSL value</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const EditVariations = ({
  variations,
  updateVariation,
  addVariation,
  removeVariation,
  uploadVariationImage,
  removeVariationImage,
}) => {
  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Product Variations</h3>
        <Button onClick={addVariation}  size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Variation</span>
        </Button>
      </div>

      <Separator />

      {variations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <Badge variant="outline" className="mb-2">
            No variations yet
          </Badge>
          <p>Add a product variation to get started</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {variations.map((variation, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Variation {index + 1}</CardTitle>
                  <Button onClick={() => removeVariation(index)} variant="destructive" size="sm" className="gap-1">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`variation-name-${index}`}>Variation Name</Label>
                    <Input
                      id={`variation-name-${index}`}
                      placeholder="e.g. Small / Red / Cotton"
                      value={variation.name}
                      onChange={(e) => updateVariation(index, "name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`variation-price-${index}`}>Price</Label>
                    <Input
                      id={`variation-price-${index}`}
                      type="number"
                      placeholder="0.00"
                      value={variation.price}
                      onChange={(e) => updateVariation(index, "price", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`variation-color-name-${index}`} className="flex items-center gap-1">
                      <Palette className="h-4 w-4" />
                      Color Name
                    </Label>
                    <Input
                      id={`variation-color-name-${index}`}
                      placeholder="e.g. Ruby Red"
                      value={variation.colorName}
                      onChange={(e) => updateVariation(index, "colorName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: variation.colorHex || "#000000" }}
                          />
                        </div>
                        <Input
                          value={variation.colorHex || ""}
                          onChange={(e) => updateVariation(index, "colorHex", e.target.value)}
                          placeholder="#000000"
                          className="pl-10"
                          required
                        />
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-10 p-0 border-2"
                            style={{
                              backgroundColor: variation.colorHex || "#ffffff",
                              borderColor: variation.colorHex ? "transparent" : undefined,
                            }}
                          >
                            <span className="sr-only">Pick a color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="end">
                          <AdvancedColorPicker
                            color={variation.colorHex}
                            onChange={(color) => updateVariation(index, "colorHex", color)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Variation Images</Label>
                    <div className="relative">
                      <Input
                        type="file"
                        id={`file-upload-${index}`}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        multiple
                        onChange={(e) => [...e.target.files].forEach((file) => uploadVariationImage(index, file))}
                      />
                      <Button variant="outline" size="sm" className="gap-1">
                        <Upload className="h-4 w-4" />
                        <span>Upload Images</span>
                      </Button>
                    </div>
                  </div>

                  {variation.images && variation.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {variation.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative group aspect-square rounded-md overflow-hidden border">
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Variation ${variation.name || index + 1} image ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                            onClick={() => removeVariationImage(index, imgIndex)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed rounded-md text-center text-muted-foreground">
                      <p>No images uploaded yet</p>
                      <p className="text-sm">Upload images to showcase this variation</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default EditVariations

