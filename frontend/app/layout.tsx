import type React from "react"

import type { Metadata } from "next"
import { Source_Sans_3, Playfair_Display, Geist_Mono } from "next/font/google"
import { ErrorBoundary } from "@/components/ui/error-boundary" // Added error boundary import
import NavBar from "@/components/ui/tubelight-navbar"
import Image from "next/image"
import Link from "next/link"
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

  {/* universal home button removed per request */}
        {/* site-wide fixed floating navbar */}
        <NavBar
          items={[
            { name: "Dashboard", url: "/dashboard", icon: "Home" },
            { name: "Traffic Monitor", url: "/traffic", icon: "Activity" },
            { name: "AI Classification", url: "/classify", icon: "Cpu" },
            { name: "Suggestions", url: "/suggestions", icon: "Zap" },
            { name: "Model Status", url: "/model", icon: "ServerCog" },
            { name: "Admin", url: "/admin", icon: "Settings" },
            { name: "Investigations", url: "/investigations", icon: "Search" },
          ]}
        />
      </body>
    </html>
  )
}
