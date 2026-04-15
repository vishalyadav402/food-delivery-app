import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KiranaNeeds | Daily Grocery & Kirana Store Near You",
  description:
    "Order groceries online from KiranaNeeds. Buy daily essentials like rice, atta, oil, sugar, snacks and household items with fast delivery at your doorstep.",
  themeColor: "#22c55e",
  keywords: [
    "kirana store near me",
    "online grocery shopping",
    "grocery delivery",
    "daily essentials online",
    "atta rice oil delivery",
    "kirana shop online",
    "grocery store near me",
    "fast grocery delivery",
    "household items delivery",
    "KiranaNeeds",
    "KiranaNeeds store",
    "prithviganj kirana store",
    "prithviganj grocery delivery",
    "Pratapgarh kirana store",
    "Pratapgarh grocery shop",
    "Patti kirana store",
    "Patti grocery delivery",
    "local kirana shop online",
    "cheap grocery delivery",
    "best kirana shop near me",
    "order grocery online",
    "whatsapp grocery order",
    "kirana needs online",
    "kirana needs delivery",
    "grocery items list online",
    "daily use items delivery",
    "grocery store Patti",
    "grocery store Prithviganj",
    "grocery store Pratapgarh"
  ],

  authors: [
    {
      name: "KiranaNeeds",
      url: "https://kirananeeds.in",
    },
  ],

  openGraph: {
    title: "KiranaNeeds | Grocery Delivery Near You",
    description:
      "Shop daily groceries online from KiranaNeeds. Fast delivery of fresh and essential items at your doorstep.",
    url: "https://kirananeeds.in",
    siteName: "KiranaNeeds",
    images: [
      {
        url: "https://kirananeeds.in",
        width: 1200,
        height: 630,
        alt: "KiranaNeeds Grocery Store",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "KiranaNeeds | Grocery Delivery Near You",
    description:
      "Order groceries online from KiranaNeeds. Fast delivery of daily essentials at your doorstep.",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#22c55e" /> {/* ✅ */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
