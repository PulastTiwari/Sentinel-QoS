"use client"

import { useState } from "react"
import { useLiveStatus } from "@/hooks/use-live-status"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Investigation } from "@/lib/types"
import { cn } from "@/lib/utils"

// Mock investigations data
const mockInvestigations: Investigation[] = [
  {
    id: "inv_001",
    flow_id: "flow_12345",
    timestamp: "2024-01-15T14:30:00Z",
    details:
      "Unusual traffic pattern detected from 192.168.1.100 - potential P2P file sharing misclassified as web browsing",
    status: "open",
  },
  {
    id: "inv_002",
    flow_id: "flow_12346",
    timestamp: "2024-01-15T13:15:00Z",
    details:
      "High bandwidth usage on port 443 with low packet count - investigating potential video streaming over HTTPS",
    status: "in-progress",
  },
  {
    id: "inv_003",
    flow_id: "flow_12347",
    timestamp: "2024-01-15T12:00:00Z",
    details: "VoIP classification confidence below threshold - manual verification completed, classification correct",
    status: "resolved",
  },
  {
    id: "inv_004",
    flow_id: "flow_12348",
    timestamp: "2024-01-15T11:45:00Z",
    details: "Gaming traffic detected during business hours from corporate network - policy violation investigation",
    status: "escalated",
  },
]

export default function InvestigationsPage() {
  const { data, loading, error } = useLiveStatus()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [investigations] = useState<Investigation[]>(mockInvestigations)

  const filteredInvestigations = investigations.filter((inv) => filterStatus === "all" || inv.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-chart-3 text-white"
      case "in-progress":
        return "bg-chart-4 text-white"
      case "resolved":
        return "bg-chart-2 text-white"
      case "escalated":
        return "bg-chart-5 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusCounts = () => {
    return {
      total: investigations.length,
      open: investigations.filter((inv) => inv.status === "open").length,
      inProgress: investigations.filter((inv) => inv.status === "in-progress").length,
      resolved: investigations.filter((inv) => inv.status === "resolved").length,
      escalated: investigations.filter((inv) => inv.status === "escalated").length,
    }
  }

  const statusCounts = getStatusCounts()

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <Alert variant="destructive">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to Sentinel-QoS backend. Please ensure the API server is running on localhost:8000.
              <br />
              <span className="text-xs mt-2 block">Error: {error}</span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-display font-bold text-balance">Flow Investigations</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage network flow anomalies and classification investigations
            </p>
          </div>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">Investigation Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono">{statusCounts.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-chart-3">{statusCounts.open}</div>
                  <div className="text-xs text-muted-foreground">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-chart-4">{statusCounts.inProgress}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-chart-2">{statusCounts.resolved}</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono text-chart-5">{statusCounts.escalated}</div>
                  <div className="text-xs text-muted-foreground">Escalated</div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-4 pt-4 border-t border-border mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm bg-background border border-border rounded px-2 py-1"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  {loading && <LoadingSpinner size="sm" />}
                  <span className="text-sm text-muted-foreground">{filteredInvestigations.length} investigations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investigations List */}
          <div className="space-y-4">
            {filteredInvestigations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="space-y-2">
                    <div className="text-muted-foreground">No investigations found</div>
                    <div className="text-xs text-muted-foreground">
                      {filterStatus !== "all"
                        ? "Try adjusting your filters"
                        : "All network flows are operating normally"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredInvestigations.map((investigation) => (
                <Card key={investigation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">Investigation {investigation.id}</h3>
                        <Badge variant="secondary" className={cn("text-xs", getStatusColor(investigation.status))}>
                          {investigation.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(investigation.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Related Flow:</span>
                        <div className="font-mono text-sm mt-1">{investigation.flow_id}</div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Investigation Details:</span>
                        <div className="text-sm mt-1 leading-relaxed">{investigation.details}</div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          View Flow Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                        <Button variant="outline" size="sm">
                          Add Notes
                        </Button>
                        {investigation.status === "resolved" && (
                          <Button variant="outline" size="sm">
                            Export Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
