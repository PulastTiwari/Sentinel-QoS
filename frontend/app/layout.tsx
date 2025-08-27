import type React from "react"

import type { Metadata } from "next"
import { Source_Sans_3, Playfair_Display, Geist_Mono } from "next/font/google"
import { ErrorBoundary } from "@/components/ui/error-boundary" // Added error boundary import
import "./globals.css"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Sentinel-QoS | AI Network Orchestrator",
  description:
    "AI-driven Quality of Service orchestrator for intelligent network traffic classification and policy management",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${playfairDisplay.variable} ${geistMono.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
