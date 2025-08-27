"use client"

import React, { useEffect, useState } from "react"
import { api, setAdminAuth } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [simEnabled, setSimEnabled] = useState<boolean | null>(null)
  const [uploading, setUploading] = useState(false)
  const [llm, setLlm] = useState({ llm_enabled: true, llm_model: "mistral" })
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const t = useToast()

  useEffect(() => {
    // fetch current settings
    api
      .getLlmSettings()
      .then((res: any) => setLlm({ llm_enabled: Boolean(res.llm_enabled), llm_model: String(res.llm_model || "mistral") }))
      .catch(() => {})
    // infer simulate flag from global state endpoint via status — fallback true
    api.fetchStatus().then(() => setSimEnabled(true)).catch(() => setSimEnabled(false))
  }, [])

  async function toggleSim() {
    const target = !simEnabled
    setSimEnabled(target)
    try {
      await api.setSimulation(Boolean(target))
  t.toast({ title: "Simulation updated", description: `Simulation ${target ? "enabled" : "disabled"}` })
    } catch (e) {
      setSimEnabled(!target)
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    try {
      const res = await api.uploadModel(f)
      if (res.error) {
        t.toast({ title: "Upload failed", description: String(res.error) })
      } else {
        t.toast({ title: "Upload successful", description: `Saved ${res.saved}` })
      }
    } catch (err) {
      t.toast({ title: "Upload error", description: String(err) })
    } finally {
      setUploading(false)
    }
  }

  async function saveLlm() {
    try {
      const res = await api.setLlmSettings(llm.llm_enabled, llm.llm_model)
      setLlm(res)
  t.toast({ title: "LLM settings saved", description: `${res.llm_model} — ${res.llm_enabled ? "enabled" : "disabled"}` })
    } catch (e) {
  t.toast({ title: "LLM save failed", description: String(e) })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Console</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-medium mb-2">Simulator</h3>
          <p className="text-sm text-muted-foreground mb-3">Toggle background traffic simulation.</p>
          {simEnabled === null ? (
            <LoadingSpinner />
          ) : (
            <button
              className={`px-4 py-2 rounded ${simEnabled ? "bg-green-600 text-white" : "bg-muted"}`}
              onClick={toggleSim}
            >
              {simEnabled ? "Disable Simulation" : "Enable Simulation"}
            </button>
          )}
        </div>

        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-medium mb-2">Upload Sentry Model</h3>
          <p className="text-sm text-muted-foreground mb-3">Upload a joblib/.pkl payload produced by <code>train_sentry.py</code>.</p>
          <input type="file" accept=".pkl,.joblib" onChange={onFile} />
          <div className="mt-3">
            <button className="px-4 py-2 rounded bg-primary text-white" onClick={() => {}}>Upload</button>
            {uploading && <span className="ml-3"><LoadingSpinner size="sm" /></span>}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4 md:col-span-2">
          <h3 className="font-medium mb-2">Vanguard LLM Settings</h3>
          <p className="text-sm text-muted-foreground mb-3">Toggle LLM fallback and set model name used by the backend's Ollama call.</p>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={llm.llm_enabled} onChange={(e) => setLlm({ ...llm, llm_enabled: e.target.checked })} />
              <span>LLM enabled</span>
            </label>
            <input className="border rounded px-2 py-1" value={llm.llm_model} onChange={(e) => setLlm({ ...llm, llm_model: e.target.value })} />
            <button className="px-3 py-1 rounded bg-primary text-white" onClick={saveLlm}>Save</button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card rounded-xl border p-4">
        <h3 className="font-medium mb-2">Admin Credentials</h3>
        <div className="flex items-center space-x-3">
          <input className="border rounded px-2 py-1" placeholder="username" value={user} onChange={(e) => setUser(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button
            className="px-3 py-1 rounded bg-primary text-white"
            onClick={() => {
              setAdminAuth(user, pass)
              t.toast({ title: "Credentials set", description: "Admin auth stored in session" })
            }}
          >
            Set Credentials
          </button>
        </div>
      </div>
    </div>
  )
}
