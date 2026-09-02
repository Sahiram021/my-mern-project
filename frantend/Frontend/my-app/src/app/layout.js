import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import MainLayout from "./MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jgbmtrading.online";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JGB Trading Private Limited",
  url: siteUrl,
  logo: `${siteUrl}/images/jgb-logo.jpg`,
  email: "info@jgbtrading.com",
  telephone: "+91-8810426236",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mahadev Ghat Road",
    addressLocality: "Raipur",
    addressRegion: "Chhattisgarh",
    postalCode: "492001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8810426236",
    contactType: "sales",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JGB Trading Private Limited | Industrial Mineral Powders",
    template: "%s | JGB Trading Private Limited",
  },
  description:
    "JGB Trading Private Limited supplies calcium carbonate, anti-moisture powder and industrial mineral powders from Raipur, Chhattisgarh.",
  applicationName: "JGB Trading Private Limited",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "JGB Trading Private Limited",
    title: "JGB Trading Private Limited | Industrial Mineral Powders",
    description:
      "Calcium carbonate, anti-moisture powder and industrial mineral powder supplier in Raipur, India.",
    url: siteUrl,
    images: [
      {
        url: "/powder-images/jgb-calcium-minerals-slider.jpg",
        width: 1376,
        height: 768,
        alt: "JGB Trading industrial calcium and mineral powders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JGB Trading Private Limited | Industrial Mineral Powders",
    description:
      "Calcium carbonate, anti-moisture powder and industrial mineral powder supplier in Raipur, India.",
    images: ["/powder-images/jgb-calcium-minerals-slider.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  icons: {
    icon: [
      { url: '/favicon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2' }
    ],
    shortcut: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <MainLayout>
          <Header/>
           {children}
          <Footer/>
        </MainLayout>
      </body>
    </html>
  );
}
