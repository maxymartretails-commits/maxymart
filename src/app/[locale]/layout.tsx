import { Toaster } from "react-hot-toast";

//styles
import "./globals.css";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

//components
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { hasLocale, NextIntlClientProvider } from 'next-intl';

//store
import StoreProvider from "@/lib/store/StoreProvider";

//utils
import AuthProvider from "@/lib/auth/AuthProvider";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import Script from "next/script";
import { Metadata } from "next";
import CartLoader from "@/components/cart-loader/CartLoader";
import { Suspense } from "react";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

ModuleRegistry.registerModules([AllCommunityModule]);

export const metadata: Metadata = {
  title: "MaxyMart | Grocery Delivery & Fresh Products at Your Doorstep",
  description:
    "Shop online at MaxyMart for fresh groceries, fruits, vegetables, and essentials with same-day delivery at the best prices.",
  keywords: "MaxyMart, grocery, online grocery, fruits, vegetables, delivery",
  openGraph: {
    title: "MaxyMart | Grocery Delivery & Fresh Products",
    description:
      "Order fresh groceries from MaxyMart online now with same-day delivery. Get fruits, vegetables, and essentials delivered to your home.",
    // url: "https://yourdomain.com",
    type: "website",
    images: [
      {
        url: "assets/maxymart_logo.svg",
        width: 1200,
        height: 630,
        alt: "MaxyMart Grocery Delivery Banner",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params:any
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  console.log(locale, messages)
  console.log(hasLocale(routing.locales,locale),"has")
  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <Suspense>
                <Header />
                <CartLoader />
                {children}
                <Footer />
              </Suspense>
            </AuthProvider>
          </NextIntlClientProvider>
        </StoreProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: {
                background: "#dcfce7",
                color: "#16a34a",
              },
              iconTheme: {
                primary: "#4ade80",
                secondary: "#f0fdf4",
              },
            },
            error: {
              style: {
                background: "#fee2e2",
                color: "#b91c1c",
              },
              iconTheme: {
                primary: "#f87171",
                secondary: "#fef2f2",
              },
            },
          }}
        />
        <div id="modalRoot"></div>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
