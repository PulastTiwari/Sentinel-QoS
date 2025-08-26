"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: "" },
  { name: "Traffic Monitor", href: "/traffic", icon: "" },
  { name: "AI Classification", href: "/classify", icon: "" }, // Added AI Classification page
  { name: "Suggestions", href: "/suggestions", icon: "" },
  { name: "Model Status", href: "/model", icon: "" },
  { name: "Investigations", href: "/investigations", icon: "" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-display font-bold text-sidebar-foreground">Sentinel-QoS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <span className="mr-3 text-base">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">AI Network Orchestrator</div>
        <div className="text-xs text-sidebar-foreground/40 mt-1">v1.0.0 • Real-time Classification</div>
      </div>
    </div>
  )
}
