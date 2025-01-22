'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Share2, Heart, ChevronRight, ChevronLeft, CreditCard, FileText, FuelIcon as Engine, Gauge, Fuel, Car, Disc, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CarGallery() {
  const [currentImage, setCurrentImage] = useState(0)
  const [activeTab, setActiveTab] = useState('الخارج')
  const [activePaymentTab, setActivePaymentTab] = useState('الدفع نقداً')
  const [showCalculator, setShowCalculator] = useState(false)
  const [loanAmount, setLoanAmount] = useState(61000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(5)
  
  const images = [
    { 
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2070&q=80', 
      alt: 'Audi R8 Exterior' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2069&q=80', 
      alt: 'Audi R8 Front View'
    },
    { 
      url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2072&q=80',
      alt: 'Audi R8 Side View'
    }
  ]

  const tabContent = {
    'الخارج': {
      icon: Car,
      items: [
        'LED مصابيح أمامية',
        'عجلات المنيوم 19 انش',
        'جناح خلفي رياضي',
        'مرايا كهربائية قابلة للطي'
      ]
    },
    'الداخل': {
      icon: Gauge,
      items: [
        'مقاعد جلد فاخرة',
        'نظام تكييف اوتوماتيكي',
        'شاشة لمس 10 انش',
        'نظام صوت فاخر'
      ]
    },
    'المحرك': {
      icon: Engine,
      items: [
        'محرك 6 سلندر',
        'قوة 300 حصان',
        'ناقل حركة اوتوماتيكي',
        'دفع رباعي'
      ]
    },
    'الإطارات': {
      icon: Disc,
      items: [
        'مقاس 19 انش',
        'نوع رياضي',
        'نظام مراقبة ضغط الهواء',
        'اطارات عريضة'
      ]
    },
    'المميزات': {
      icon: Fuel,
      items: [
        'نظام مانع الانزلاق',
        'وسائد هوائية متعددة',
        'كاميرا خلفية',
        'حساسات ركن'
      ]
    }
  }

  const calculateMonthlyPayment = () => {
    const principal = loanAmount
    const numberOfPayments = loanTerm
    const interestRatePerPeriod = (interestRate / 100) / 12

    const monthlyPayment = 
      (principal * interestRatePerPeriod * Math.pow(1 + interestRatePerPeriod, numberOfPayments)) /
      (Math.pow(1 + interestRatePerPeriod, numberOfPayments) - 1)

    return monthlyPayment.toFixed(2)
  }

  const renderTabContent = (tab) => {
    const TabIcon = tabContent[tab].icon
    return (
      <div className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <TabIcon className="h-5 w-5 text-[#71308A]" />
          <h3 className="font-semibold text-lg">تفاصيل {tab}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {tabContent[tab].items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-[#71308A]"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPaymentContent = () => {
    if (activePaymentTab === 'الدفع نقداً') {
      return (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#71308A]">٦١٬٠٠٠ ريال</div>
              <div className="text-sm text-gray-500">شامل الضريبة</div>
            </div>
            <div className="text-gray-500">السعر النقدي</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#71308A]">١٬٢٩٩ ريال</div>
              <div className="text-sm text-gray-500">القسط الشهري يبدأ من</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">الدفعة الأولى</div>
            <div className="text-lg">20%</div>
          </div>
          <button 
            className="w-full bg-[#71308A] text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            onClick={() => setShowCalculator(true)}
          >
            احسب قسطك
          </button>
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto p-4 font-sans" dir="rtl">
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4 order-2 lg:order-1">
          <Card className="overflow-hidden">
            {renderPaymentContent()}
            <div className="grid grid-cols-2 border-t">
              <button 
                className={`flex items-center justify-center gap-2 p-4 hover:bg-gray-50 border-l ${activePaymentTab === 'التمويل' ? 'bg-[#71308A] bg-opacity-10 text-[#71308A]' : ''}`}
                onClick={() => setActivePaymentTab('التمويل')}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">التمويل</span>
              </button>
              <button 
                className={`flex items-center justify-center gap-2 p-4 hover:bg-gray-50 ${activePaymentTab === 'الدفع نقداً' ? 'bg-[#71308A] bg-opacity-10 text-[#71308A]' : ''}`}
                onClick={() => setActivePaymentTab('الدفع نقداً')}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">الدفع نقداً</span>
              </button>
            </div>
          </Card>

          <button className="w-full bg-[#71308A] text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
            <FileText className="h-5 w-5" />
            طلب شراء
          </button>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-lg font-semibold mb-4">معرض الصور</div>
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-video overflow-hidden rounded-lg border-2 ${
                    currentImage === index ? 'border-[#71308A]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="order-1 lg:order-2">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">سوزوكي سيارة GLX 2023</h1>
              <div className="flex items-center gap-2">
                <span className="bg-[#71308A] bg-opacity-10 text-[#71308A] text-xs px-2 py-1 rounded">
                  فحص شامل 200 نقطة
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[currentImage].url || "/placeholder.svg"}
              alt={images[currentImage].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/90 hover:bg-white"
                onClick={() => setCurrentImage(prev => (prev > 0 ? prev - 1 : images.length - 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/90 hover:bg-white"
                onClick={() => setCurrentImage(prev => (prev < images.length - 1 ? prev + 1 : 0))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImage + 1}/{images.length}
            </div>
          </div>

          <div className="border-b">
            <nav className="flex gap-4">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === tab 
                      ? 'text-[#71308A] border-[#71308A]' 
                      : 'text-gray-500 border-transparent hover:text-[#71308A] hover:border-[#71308A] hover:border-opacity-30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Installment Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">حاسبة التقسيط</h2>
              <button onClick={() => setShowCalculator(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">مبلغ القرض</label>
                <Input
                  type="number"
                  id="loanAmount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">مدة القرض (بالأشهر)</label>
                <Input
                  type="number"
                  id="loanTerm"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">معدل الفائدة السنوي (%)</label>
                <Input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">القسط الشهري التقريبي:</p>
                <p className="text-2xl font-bold text-[#71308A]">{calculateMonthlyPayment()} ريال</p>
              </div>
              <button 
                className="w-full bg-[#71308A] text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                onClick={() => setShowCalculator(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}