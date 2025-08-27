"use client"

import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page"
import NavBar from "@/components/ui/tubelight-navbar"
import { Home, Activity, Cpu, Server, Lightbulb, Search } from "lucide-react"

export default function LandingPage() {
  return (
    // full-width responsive landing with a floating center-bottom navbar
    <div className="min-h-screen w-full relative">
      <DigitalSerenity />

      {/* center-bottom floating glass navbar */}
      <NavBar
        items={[
          { name: "Dashboard", url: "/dashboard", icon: Home },
          { name: "Traffic Monitor", url: "/traffic", icon: Activity },
          { name: "AI Classification", url: "/classify", icon: Cpu },
          { name: "Suggestions", url: "/suggestions", icon: Lightbulb },
          { name: "Model Status", url: "/model", icon: Server },
          { name: "Investigations", url: "/investigations", icon: Search },
        ] as any}
      />
    </div>
  )
}
