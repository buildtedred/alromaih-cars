import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"; 
import Header from "@/MyComponents/NavebarComponents/components/Header";
// import { Providers } from "./providers";
import { LogoProvider } from "@/contexts/LogoContext";
import Footer from '@/MyComponents/Footer/Footer';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getLangDir} from 'rtl-detect';



export const metadata = {
  title: 'الرميح للسيارات - موقع بيع وشراء السيارات',
  description: 'موقع الرميح للسيارات - أكبر موقع لبيع وشراء السيارات في المملكة العربية السعودية',
};

export default async function RootLayout ({ children,params }) {
 
  const  locale  = (await params).locale;
 // Ensure that the incoming `locale` is valid
 if (!routing.locales.includes(locale)) {
  notFound();
}

// Providing all messages to the client
// side is the easiest way to get started
const messages = await getMessages();
// const direction = locale === 'ar' ? 'rtl' : 'ltr';
const direction = getLangDir(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body>
      <NextIntlClientProvider  messages={messages}>

        {/* <Providers> */}
          <LogoProvider>
            <Header />
            {/* Make sure children is wrapping everything */}
            <main>{children}</main>
            <Footer />
          </LogoProvider>
        {/* </Providers> */}
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
