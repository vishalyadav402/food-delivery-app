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
  title: "Fast & Fresh Food Delivery | YourCity Food Express",
  description: "Order delicious noodles, burgers, momos, cold coffee and more from YourCity Food Express. Quick delivery, fresh meals at your doorstep.",
  keywords: [
    "food delivery",
    "online food order",
    "noodles delivery",
    "burger delivery",
    "momos near me",
    "cold coffee order",
    "fast food delivery",
    "YourCity food delivery",
    "Sangipur food delivery",
    "sangipur Food Express",
    "food delivery app",
    "food delivery service",
    "quick food delivery",
    "fresh meals",
    "local food delivery",
    "order food online",
    "food delivery near me",
    "food delivery Sangipur",
    "food delivery YourCity",
    "YourCity food express",
    "Sangipur food express",
    "food delivery app Sangipur",
    "food delivery app YourCity",
    "food delivery service Sangipur",
    "food delivery service YourCity",
    "food delivery app YourCity",
    "food delivery app Sangipur",
    "food delivery service YourCity",
    "food delivery service Sangipur",
    "YourCity food delivery app",
    "Sangipur food delivery app",
    "YourCity food delivery service",
    "Sangipur food delivery service",
    "YourCity food express app",
    "Sangipur food express app",
    "YourCity food express service",
    "Sangipur food express service",
    "YourCity food delivery online",
    "Sangipur food delivery online",
    "YourCity food express online",
    "Sangipur food express online",
    "YourCity food delivery restaurant",
    "Sangipur food delivery restaurant",
    "YourCity food express restaurant",
    "Sangipur food express restaurant",
    "YourCity food delivery takeaway",
    "Sangipur food delivery takeaway",
    "YourCity food express takeaway",
    "Sangipur food express takeaway",
    "YourCity food delivery online order",
    "Sangipur food delivery online order",
    "YourCity food express online order",
    "Sangipur food express online order",
    "YourCity food delivery quick",
    "Sangipur food delivery quick",
    "YourCity food express quick",
    "Sangipur food express quick",
    "YourCity food delivery fresh",
    "Sangipur food delivery fresh",
    "YourCity food express fresh",
    "Sangipur food express fresh",
    "YourCity food delivery local",
    "Sangipur food delivery local", 
    "Lalganj food delivery",
    "Lalganj food express",
    "Lalganj food delivery app",
    "Lalganj food delivery service",
    "Lalganj food express app",
    "Lalganj food express service",
    "Lalganj food delivery online",
    "Lalganj food express online",
    "Lalganj food delivery restaurant",
    "Lalganj food express restaurant",      
  ],
  authors: [{ name: "Divine Food Hub", url: "https://food-delivery-app-sigma-blush.vercel.app/" }],
  openGraph: {
    title: "Fast & Fresh Food Delivery | YourCity Food Express",
    description: "Order delicious noodles, burgers, momos, cold coffee and more from YourCity Food Express. Quick delivery, fresh meals at your doorstep.",
    url: "https://food-delivery-app-sigma-blush.vercel.app/",
    siteName: "YourCity Food Express",
    images: [
      {
        url: "https://food-delivery-app-sigma-blush.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Delicious food from YourCity Food Express",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast & Fresh Food Delivery | YourCity Food Express",
    description: "Order delicious noodles, burgers, momos, cold coffee and more. Quick delivery, fresh meals at your doorstep.",
    // site: "@YourTwitterHandle",
    // creator: "@YourTwitterHandle",
    // images: ["https://food-delivery-app-sigma-blush.vercel.app/twitter-image.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
