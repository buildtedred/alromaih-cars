import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/MyComponents/NavebarComponents/components/Header";
import { Providers } from "./providers";
import { LogoProvider } from "@/contexts/LogoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'الرميح للسيارات - موقع بيع وشراء السيارات',
  description: 'موقع الرميح للسيارات - أكبر موقع لبيع وشراء السيارات في المملكة العربية السعودية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
    <LogoProvider>

        <Header/>
        {children}
    </LogoProvider>
        </Providers>

      </body>
    </html>
  );
}
