import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getLangDir } from "rtl-detect";
import { BrandsProvider } from "@/contexts/AllDataProvider";
import LanguageSwitcherContext from "@/contexts/LanguageSwitcherContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { OdooProvider } from "@/contexts/OdooContext";
import ProgressBar from "@/MyComponents/Progressbar/ProgressBar";
import Header from "@/MyComponents/NavebarComponents/components/Header";
import Footer from "@/MyComponents/Footer/Footer";
import { LogoProvider } from "@/contexts/LogoContext";
import { DetailProvider } from "@/contexts/detailProvider";

export const metadata = {
  title: "الرميح للسيارات - موقع بيع وشراء السيارات",
  description:
    "موقع الرميح للسيارات - أكبر موقع لبيع وشراء السيارات في المملكة العربية السعودية",
};

export default async function RootLayout({ children, params }) {
  const locale = await params.locale;

  // ✅ Ensure valid locale
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // ✅ Get messages for localization
  const messages = await getMessages();
  const direction = getLangDir(locale);
  // ✅ Ensure authentication is handled correctly
  // ✅ Debugging: Check authentication

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <DetailProvider>
            <ProgressBar />
            <OdooProvider>
              <LanguageSwitcherContext>
                <FavoritesProvider>
                  <BrandsProvider>
                    <LogoProvider>
                      <Header />
                      <main className="p-4 lg:px-[7rem]">
                      {children}
                      </main>
                      <Footer />
                    </LogoProvider>
                  </BrandsProvider>
                </FavoritesProvider>
              </LanguageSwitcherContext>
            </OdooProvider>
          </DetailProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
