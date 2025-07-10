"use client";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Footer } from "@/components/layout/footer";
import Head from "next/head";
import { Header } from "@/components/layout/header";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { defaultSEO } from "@/lib/seo";
import { useEffect, useState } from "react";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Handle theme transition classes only on client side
    const root = document.documentElement;
    root.classList.add("no-transitions");

    const timer = setTimeout(() => {
      root.classList.remove("no-transitions");
    }, 100);

    setMounted(true);
    return () => clearTimeout(timer);
  }, []);

  // Prevent flash during SSR by rendering nothing until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-KKW79YC8KG"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KKW79YC8KG');
        `}
      </Script>
      <DefaultSeo {...defaultSEO} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster position="bottom-right" />
        </div>
      </ThemeProvider>
    </>
  );
}
