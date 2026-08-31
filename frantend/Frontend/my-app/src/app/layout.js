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

export const metadata = {
  title: "JGB TRADING PRIVATE LIMITED | Quality Minerals & Calcium Powder",
  description:
    "JGB Trading Private Limited — Premium Calcium Powder, Anti-Moisture Powder, Calcite Lumps, Talc Powder, Dolomite & Minerals. Raipur, Chhattisgarh. Tel: 8810426236",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body>
        <MainLayout>
          <Header/>
           {children}
          <Footer/>
        </MainLayout>
      </body>
    </html>
  );
}
