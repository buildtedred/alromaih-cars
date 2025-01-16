import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-brand-primary to-brand-light text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Buy Online Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">
              Buy online with confidence
            </h3>
            <div className="flex gap-4">
              <Image
                src="/images/StoreGold.svg" // local path
                alt="Certification 1"
                width={80}
                height={80}
                className="rounded-lg hover:scale-105 transition-transform"
              />
              <Image
                src="/images/Vat.png" // local path
                alt="VAT Certificate"
                width={80}
                height={80}
                className="rounded-lg hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <Link
                href="tel:+966123456789"
                className="flex items-center gap-3 hover:text-purple-200 transition-colors w-fit-content"
              >
                <div className="bg-brand-primary p-2 rounded-full">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium w-fit-content">Call Us</p>
                  <p>+966 123 456 789</p>
                </div>
              </Link>

              <Link
                href="https://wa.me/966123323"
                className="flex items-center gap-3 hover:text-purple-200 transition-colors w-fit-content"
              >
                <div className="bg-brand-primary p-2 rounded-full">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p>+966 123 323</p>
                </div>
              </Link>

              <Link
                href="mailto:alromaih@gmail.com"
                className="flex items-center gap-3 hover:text-purple-200 transition-colors w-fit-content"
              >
                <div className="bg-brand-primary p-2 rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email Address</p>
                  <p>alromaih@gmail.com</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Company Info Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Company</h3>
            <div className="space-y-4">
              <Link
                href="/about"
                className="block hover:text-purple-200 transition-colors w-fit-content"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block hover:text-purple-200 transition-colors w-fit-content"
              >
                Contact Us
              </Link>

              <div className="flex items-center >">
                <MapPin className="h-5  text-purple-300" />

                {/* ///////////////////////////////// */}
                <Select className="border-0 ring-0 ring-offset-0 shadow-none">
                  <SelectTrigger className="w-[90px] left-0 hover:text-purple-200 transition-colors bg-transparent border-none outline-none cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none">
                    <SelectValue placeholder="Riyadh" />
                  </SelectTrigger>
                  <SelectContent className="w-12 hover:text-purple-200 transition-colors border-none outline-none cursor-pointer shadow-none">
                    <SelectItem
                      value="Riyadh"
                      className="bg-white text-black hover:bg-brand-primary hover:text-white transition-colors"
                    >
                      Riyadh
                    </SelectItem>
                    <SelectItem
                      value="Ar Ar"
                      className="bg-white text-black hover:bg-brand-primary hover:text-white transition-colors"
                    >
                      Ar Ar
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* ///////////////////////////////// */}

                {/* <select className="hover:text-purple-200 transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <option
                    value="Riyadh"
                    className="!bg-brand-primary hover:!bg-brand-primary"
                  >
                    Riyadh
                  </option>

                  <option
                    value="Ar Ar"
                    className="bg-brand-primary hover:bg-brand-light custom-class"
                  >
                    Ar Ar
                  </option>
                </select> */}
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-300" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Download Apps Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Download Our App</h3>
            <div className="flex flex-row gap-4">
              <Link
                href="#"
                className="block transition-transform hover:scale-105"
              >
                <Image
                  src="/images/appstore1.png" // Local path
                  alt=""
                  width={130}
                  height={60}
                  className="rounded-lg"
                />
              </Link>
              <Link
                href="#"
                className="block transition-transform hover:scale-105"
              >
                <Image
                  src="/images/googleplay1.png" // Local path
                  alt=""
                  width={130}
                  height={60}
                  className="rounded-lg"
                />
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="font-medium mb-3">Payment Methods</p>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-10 flex justify-center items-center">
                  <Image
                    src="/images/visa.png"
                    alt="Visa"
                    width={50}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div className="w-16 h-10 flex justify-center items-center">
                  <Image
                    src="/images/Mada.png"
                    alt="Mada"
                    width={50}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div className="w-16 h-10 flex justify-center items-center">
                  <Image
                    src="/images/MasterCard.png"
                    alt="MasterCard"
                    width={50}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-brand-light ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media Links */}
            <div className="flex gap-4">
              {[
                {
                  name: "Facebook",
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  name: "Twitter",
                  icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                },
                {
                  name: "Instagram",
                  icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                },
                {
                  name: "LinkedIn",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
                {
                  name: "TikTok",
                  icon: "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
                },
              ].map((social) => (
                <Link
                  key={social.name}
                  href="#"
                  className="bg-brand-primary p-2 rounded-full hover:text-purple-200 transition-colors"
                  aria-label={social.name}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Terms and Copyright */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link
                href="/terms"
                className="hover:text-purple-200 transition-colors"
              >
                Terms and Condition
              </Link>
              <span className="text-purple-400">|</span>
              <p className="text-purple-200">
                © {new Date().getFullYear()} Alromaih Cars. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
