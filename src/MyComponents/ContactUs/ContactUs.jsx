import { Mail, MapPin, Phone, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "#71308A" }}>
          Contact Information
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1" style={{ color: "#71308A" }} />
                    <div>
                      <h2 className="font-semibold text-base mb-1">Location</h2>
                      <p className="text-sm text-gray-600">
                        Khurais Road, Al Manar 522
                        <br />
                        Riyadh - Saudi Arabia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-1" style={{ color: "#71308A" }} />
                    <div>
                      <h2 className="font-semibold text-base mb-1">Contact us</h2>
                      <p className="text-sm text-gray-600">Mobile Number: 920004179</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-1" style={{ color: "#71308A" }} />
                    <div>
                      <h2 className="font-semibold text-base mb-1">Email Address</h2>
                      <a href="mailto:info@alromaihcars.com" className="text-sm text-gray-600 hover:text-[#71308A]">
                      info@alromaihcars.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mt-1" style={{ color: "#71308A" }} fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <h2 className="font-semibold text-base mb-1">WhatsApp</h2>
                      <a href="https://wa.me/920031202" className="text-sm text-gray-600 hover:text-[#71308A]">
                      9200 31 202
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Maroof Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mt-1" style={{ color: "#71308A" }} fill="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div>
                      <h2 className="font-semibold text-base mb-1">Maroof & Trusted Site</h2>
                      <p className="text-sm text-gray-600">Trusted by the Ministry of Commerce</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 mt-1" style={{ color: "#71308A" }} />
                    <div>
                      <h2 className="font-semibold text-base mb-1">Company</h2>
                      <p className="text-sm text-gray-600">Abdul Latif Jameel Technology Co. Ltd.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map */}
          <div className="w-full h-[400px] lg:h-full rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.674754711!2d46.6384!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzI5LjAiTiA0NsKwMzgnMTguMiJF!5e0!3m2!1sen!2s!4v1635787269548!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

