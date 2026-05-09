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
  title: "والي شوب | waly",
  icons: {
    icon: '/Logo2.png',
  },
  description: "متجر و الي شوب للمكملات الغذائية",
  keywords: ["والي شوب", "waly", "كملات غذائية", "مكملات", "مكملات غذائية", "مكملات", "مكملات غذائية", "مكملات"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playpen+Sans+Arabic:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
