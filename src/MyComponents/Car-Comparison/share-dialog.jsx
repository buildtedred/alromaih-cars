"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy, Facebook, Twitter, Linkedin, Mail, PhoneIcon as WhatsApp, LinkIcon } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

const ShareDialog = ({ isOpen, onClose, carData, currentLocale }) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const isRTL = currentLocale === "ar"

  // Extract car data
  const { car1, car2, car3 } = carData || {}
  const hasThirdCar = !!car3

  // Helper function to get text based on locale
  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
  }

  // Generate share URL and text
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = isRTL ? "مقارنة السيارات" : "Car Comparison"
  const shareText = isRTL
    ? `مقارنة بين ${car1 ? getText(car1.name) : ""} و ${car2 ? getText(car2.name) : ""} ${car3 ? `و ${getText(car3.name)}` : ""}`
    : `Comparison between ${car1 ? getText(car1.name) : ""} and ${car2 ? getText(car2.name) : ""} ${car3 ? `and ${getText(car3.name)}` : ""}`

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true)
        toast({
          title: isRTL ? "تم النسخ!" : "Copied!",
          description: isRTL ? "تم نسخ الرابط إلى الحافظة" : "Link copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          title: isRTL ? "فشل النسخ" : "Copy failed",
          description: isRTL ? "حدث خطأ أثناء نسخ الرابط" : "An error occurred while copying the link",
          variant: "destructive",
        })
      })
  }

  // Handle social media sharing
  const handleShare = (platform) => {
    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
        break
      default:
        return
    }

    // Open in new window
    window.open(shareLink, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-brand-primary">
            {isRTL ? "مشاركة مقارنة السيارات" : "Share Car Comparison"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isRTL ? "شارك هذه المقارنة مع أصدقائك وعائلتك" : "Share this comparison with friends and family"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-brand-light bg-opacity-20 rounded-lg mb-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            {car1 && (
              <div className="relative w-16 h-16 bg-white rounded-full p-1 shadow-sm">
                <Image
                  src={car1.image || "/placeholder.svg?height=60&width=60"}
                  alt={getText(car1.name)}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            {car2 && (
              <div className="relative w-16 h-16 bg-white rounded-full p-1 shadow-sm">
                <Image
                  src={car2.image || "/placeholder.svg?height=60&width=60"}
                  alt={getText(car2.name)}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            {hasThirdCar && (
              <div className="relative w-16 h-16 bg-white rounded-full p-1 shadow-sm">
                <Image
                  src={car3.image || "/placeholder.svg?height=60&width=60"}
                  alt={getText(car3.name)}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-center font-medium text-brand-primary">{shareText}</p>
        </div>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">{isRTL ? "وسائل التواصل" : "Social Media"}</TabsTrigger>
            <TabsTrigger value="link">{isRTL ? "رابط" : "Link"}</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-6 w-6 text-[#1877F2] mb-1" />
                <span className="text-xs">Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2] mb-1" />
                <span className="text-xs">Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                onClick={() => handleShare("whatsapp")}
              >
                <WhatsApp className="h-6 w-6 text-[#25D366] mb-1" />
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-6 w-6 text-[#0A66C2] mb-1" />
                <span className="text-xs">LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                onClick={() => handleShare("email")}
              >
                <Mail className="h-6 w-6 text-gray-600 mb-1" />
                <span className="text-xs">Email</span>
              </Button>

              {navigator.share && (
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 hover:bg-brand-light hover:bg-opacity-20"
                  onClick={() => {
                    navigator
                      .share({
                        title: shareTitle,
                        text: shareText,
                        url: shareUrl,
                      })
                      .catch((err) => console.error("Error sharing:", err))
                  }}
                >
                  <LinkIcon className="h-6 w-6 text-brand-primary mb-1" />
                  <span className="text-xs">{isRTL ? "مشاركة" : "Share"}</span>
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input readOnly value={shareUrl} className="h-10" />
              </div>
              <Button
                type="button"
                size="icon"
                className="h-10 w-10 bg-brand-primary hover:bg-brand-primary/90"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isRTL ? "انسخ الرابط لمشاركته مع الآخرين" : "Copy the link to share it with others"}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
