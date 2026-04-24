import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Lessario Studios | High-Fidelity Technical Production",
  description: "Bridging high-end entertainment (VFX/Gaming) and enterprise industrial solutions. A structured technical powerhouse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased mesh-bg min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
