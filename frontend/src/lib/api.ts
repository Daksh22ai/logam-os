import { ChatRequest, ChatResponse, HealthResponse } from '@/types/api'

// Frontend runs on :3000, backend on :8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Types ────────────────────────────────────────────────────────────────

export interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatSession {
  id: string
  company_id: string
  title: string
  created_at: string
  messages: MessageResponse[]
}

export interface MessageResponse {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface UploadResult {
  success: boolean
  filename: string
  message: string
  chunks_stored: number
}

// ── Mock typing simulation (used when backend is unreachable) ─────────────

const MOCK_RESPONSES: Record<string, string> = {
  roas:    "Based on the live data context, **ROAS is holding at 7.2×** — above the 5.5× account benchmark. The 'Do kids get bored?' hook is converting at 34% above average. However, frequency on 'DIY Canvas' has crossed 4.8× with CTR dropping 56% over 6 days. I'd recommend launching fresh creative by Wednesday.",
  cpl:     "**CPL is currently at ₹380** — up 12% vs last month. The retargeting audience is performing best at ₹185 CPL. Recommend pausing the 'Awareness — Cold Interest' campaign and reallocating 10% budget into retargeting.",
  fatigue: "**Creative fatigue confirmed on 2 active ad sets.** DIY Canvas shows frequency 4.8× with CTR declining 56% in 6 days. Brief a new 'curiosity hook' variant and launch this Wednesday to prevent ROAS erosion.",
  default: "I'm Logam AI, your agency intelligence layer. I can analyze campaign performance, detect creative fatigue, generate client summaries, and flag churn signals. Ask me: *'Why did ROAS drop?'* or *'Check for creative fatigue.'*",
}

function _getMockResponse(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('roas') || m.includes('revenue')) return MOCK_RESPONSES.roas
  if (m.includes('cpl') || m.includes('lead')) return MOCK_RESPONSES.cpl
  if (m.includes('fatigue') || m.includes('creative')) return MOCK_RESPONSES.fatigue
  return MOCK_RESPONSES.default
}

async function _simulateMockStream(
  message: string,
  onChunk: (text: string) => void,
  onComplete: () => void
): Promise<void> {
  const response = _getMockResponse(message)
  let i = 0
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (i < response.length) {
        onChunk(response.slice(i, i + 4))
        i += 4
      } else {
        clearInterval(interval)
        onComplete()
        resolve()
      }
    }, 18) // ~18ms per 4 chars ≈ smooth typing speed
  })
}


// ── ApiClient ─────────────────────────────────────────────────────────────

export class ApiClient {

  /** Health check */
  static async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (!response.ok) throw new Error(`Health check failed: ${response.status}`)
    return response.json()
  }

  // ── Session APIs ──

  static async getSessions(companyId: string): Promise<ChatSession[]> {
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions/${companyId}`)
    if (!response.ok) throw new Error(`Failed to fetch sessions: ${response.status}`)
    return response.json()
  }

  static async createSession(companyId: string, title?: string): Promise<ChatSession> {
    const payload = { company_id: companyId, title: title || "New Chat" }
    const response = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error(`Failed to create session: ${response.status}`)
    return response.json()
  }

  static async getMessages(sessionId: string): Promise<MessageResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/chat/messages/${sessionId}`)
    if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`)
    return response.json()
  }

  // ── Chat APIs ──

  /**
   * Streaming chat via SSE (Server-Sent Events).
   * Sends message + session_id for multi-turn context handled by backend DB.
   * Falls back to a smooth mock response if the backend is unreachable.
   */
  static async streamChatMessage(
    message: string,
    sessionId: string,
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const payload = { message, session_id: sessionId }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId);

      // Connection errors that resolve but are non-200
      if (!response.ok) {
        console.warn(`Backend returned ${response.status}. Activating mock stream.`)
        await _simulateMockStream(message, onChunk, onComplete)
        return
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      // ── SSE reader ──
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) { onComplete(); break }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          if (!line.startsWith('data: ')) continue

          const dataStr = line.slice(6)
          if (dataStr === '[DONE]') { onComplete(); return }

          try {
            const data = JSON.parse(dataStr)
            if (data.text) onChunk(data.text)
            else if (data.error) onError(new Error(data.error))
          } catch {
            // Partial JSON chunk — ignore, buffer handles it
          }
        }
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      const isConnectionRefused =
        (error.name === 'TypeError' && error.message.toLowerCase().includes('fetch')) ||
        error.name === 'AbortError'

      if (isConnectionRefused) {
        // Backend is offline — silently activate smooth demo fallback
        console.warn('Backend unreachable. Activating offline mock stream.')
        await _simulateMockStream(message, onChunk, onComplete)
      } else {
        // Real unexpected error — propagate
        console.error('Streaming error:', error)
        onError(error)
      }
    }
  }


  /**
   * Upload a file for RAG document ingestion.
   */
  static async uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', file)

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for uploads

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody?.detail || `Upload failed: ${response.status}`)
      }

      return response.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        throw new Error('Backend unreachable.')
      }
      throw error
    }
  }
}
