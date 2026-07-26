import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../../context/AuthProvider"; // Ensure the path matches your actual file extension (.js or .jsx)
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Travel Planner",
  description: "Generate highly optimized, sandboxed multi-day itineraries.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="corporate"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}