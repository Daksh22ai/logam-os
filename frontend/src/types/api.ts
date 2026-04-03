export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
  timestamp: string
}

export interface HealthResponse {
  status: string
  timestamp: string
  version: string
}

export interface ErrorResponse {
  error: string
  code?: string
}
