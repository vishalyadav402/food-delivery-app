import "./globals.css";
import InstallPWA from "./components/InstallPWA";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
        <meta charSet="UTF-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <title>Dailyneeds delivered in minutes | kirananeeds</title>

        {/* SEO Meta Tags */}
        <link rel="canonical" href="https://kirananeeds.com/" />
        <meta name="title" content="Dailyneeds delivered in minutes | kirananeeds"/>
        <meta name="description" content="Shop groceries online & get them delivered to your doorstep in minutes. Enjoy instant delivery with kirananeeds."/>
        <meta name="keywords" content="Buy Grocery Online, Online Grocery, VegaCart, kirananeeds,Vega Cart Go, VegaCart Go, Grocery Store, Online Grocery Shopping, Online Grocery Store, Online Supermarket, Free Delivery, Great Offers, Best Prices"/>
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
        <meta name="author" content="kirananeeds"/>

        {/* Open Graph Meta Tags (For Social Media) */}
        <meta property="og:title" content="Dailyneeds delivered in minutes | kirananeeds"/>
        <meta property="og:site_name" content="kirananeeds"/>
        <meta property="og:url" content="https://kirananeeds.com/"/>
        <meta property="og:description" content="Shop groceries online & get them delivered to your doorstep in minutes. Enjoy instant delivery with kirananeeds."/>
        <meta property="og:type" content="website"/>
        <meta property="og:image" content="/favicon/favicon.ico"/>

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Dailyneeds delivering in minutes | kirananeeds" />
        <meta name="twitter:description" content="Shop groceries online & get them delivered to your doorstep in minutes. Enjoy instant delivery with kirananeeds." />
        <meta name="twitter:image" content="/favicon/favicon.ico" />
        <meta name="twitter:site" content="@kirananeeds" />
        <meta name="twitter:creator" content="@kirananeeds" />


        <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#69247C"></meta>
        <link rel="shortcut icon" href="/favicon/favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon"></link>
    </head>
      <body className={inter.className}>
         <Toaster position="bottom-center" />
          {children}
          <InstallPWA/>
      </body>
    </html>
  );
}
