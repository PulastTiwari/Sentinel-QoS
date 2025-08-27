import type { FlowFeatures, ClassificationResult, StatusResponse, Suggestion } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export const api = {
  // Get system status with all real-time data
  async fetchStatus(): Promise<StatusResponse> {
    return apiRequest<StatusResponse>("/status")
  },

  // Classify network traffic flow
  async postClassify(features: FlowFeatures): Promise<ClassificationResult> {
    return apiRequest<ClassificationResult>("/classify", {
      method: "POST",
      body: JSON.stringify(features),
    })
  },

  // Get policy suggestions
  async listSuggestions(): Promise<Suggestion[]> {
    return apiRequest<Suggestion[]>("/suggestions")
  },

  // Approve a suggestion
  async approveSuggestion(suggestionId: string): Promise<{ id: string; status: string }> {
    return apiRequest(`/suggestions/${suggestionId}/approve`, {
      method: "POST",
    })
  },

  // Deny a suggestion
  async denySuggestion(suggestionId: string): Promise<{ id: string; status: string }> {
    return apiRequest(`/suggestions/${suggestionId}/deny`, {
      method: "POST",
    })
  },
}

export { ApiError }
