import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "GreenThumb | Indoor Plant Marketplace",
  description: "Helping you grow your home jungle one plant at a time. Quality guaranteed with 30-day care support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="bg-background-light dark:bg-background-dark text-[#111812] dark:text-white transition-colors duration-300">
        <Providers>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
