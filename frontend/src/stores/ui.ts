import { create } from 'zustand'
import { ApiClient, ChatSession } from '@/lib/api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UIStore {
  aiPanelOpen: boolean
  aiPanelFS: boolean
  setAIPanelOpen: (open: boolean) => void
  toggleAIPanel: () => void
  toggleAIFS: () => void
  activeSection: string
  setActiveSection: (s: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // AI Panel State (Session & Chat)
  companyId: string
  sessions: ChatSession[]
  activeSessionId: string | null
  messages: Message[]
  isStreaming: boolean
  error: string | null
  isUploading: boolean
  uploadStatus: string | null

  // Session Actions
  loadSessions: () => Promise<void>
  loadMessagesForSession: (sessionId: string) => Promise<void>
  createNewSession: () => Promise<void>
  switchSession: (sessionId: string) => void

  // Chat Actions
  addMessage: (msg: Omit<Message, 'id'>) => void
  updateLastMessage: (content: string, isError?: boolean) => void
  sendMessage: (prompt: string) => Promise<void>
  uploadFile: (file: File) => Promise<void>
  setAIPrompt: (prompt: string, simulatedResponse: string) => void
  clearError: () => void
  clearMessages: () => void
  
  // Chart Interaction State
  selectedWeek: number | null
  setSelectedWeek: (week: number | null) => void
}

export const useUI = create<UIStore>((set, get) => ({
  aiPanelOpen: false,
  aiPanelFS: false,
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  toggleAIFS: () => set((s) => ({ aiPanelFS: !s.aiPanelFS })),
  activeSection: 'reporting',
  setActiveSection: (activeSection) => set({ activeSection }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  companyId: 'company_1', // default mock company ID
  sessions: [],
  activeSessionId: null,
  messages: [],
  isStreaming: false,
  error: null,
  isUploading: false,
  uploadStatus: null,

  loadSessions: async () => {
    try {
      const dbSessions = await ApiClient.getSessions(get().companyId);
      set({ sessions: dbSessions });
      if (dbSessions.length > 0 && !get().activeSessionId) {
        // Auto-select most recent session if none active
        await get().loadMessagesForSession(dbSessions[0].id);
      } else if (dbSessions.length === 0) {
        await get().createNewSession();
      }
    } catch (error) {
      console.warn("Failed to load sessions (backend might be down)", error);
    }
  },

  loadMessagesForSession: async (sessionId: string) => {
    try {
      set({ activeSessionId: sessionId });
      const dbMessages = await ApiClient.getMessages(sessionId);
      const mapped: Message[] = dbMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content
      }));
      set({ messages: mapped });
    } catch (error) {
      console.warn("Failed to load messages", error);
    }
  },

  createNewSession: async () => {
    try {
      const newSess = await ApiClient.createSession(get().companyId, "New Chat");
      set((state) => ({ 
        sessions: [newSess, ...state.sessions],
        activeSessionId: newSess.id,
        messages: []
      }));
    } catch (error) {
      console.warn("Failed to create session", error);
    }
  },

  switchSession: async (sessionId: string) => {
    if (get().activeSessionId === sessionId) return;
    await get().loadMessagesForSession(sessionId);
  },

  addMessage: (msg: Omit<Message, 'id'>) => 
    set((state) => ({ 
      messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7) }] 
    })),
  
  updateLastMessage: (content: string, isError = false) =>
    set((state) => {
      const newMessages = [...state.messages]
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content
        if (isError) newMessages[newMessages.length - 1].role = 'assistant' // Ensure it's assistant
      }
      return { messages: newMessages }
    }),
  
  sendMessage: async (prompt: string) => {
    const { activeSessionId, createNewSession } = get();
    
    // Ensure we have an active session
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      await createNewSession();
      currentSessionId = get().activeSessionId;
      if (!currentSessionId) return; // Fallback abort if still null
    }

    set({ aiPanelOpen: true, isStreaming: true, error: null })

    // 1. Add user message
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Math.random().toString(36).substring(7), role: 'user', content: prompt }
      ]
    }))

    // 2. Add empty assistant placeholder
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Math.random().toString(36).substring(7), role: 'assistant', content: '' }
      ]
    }))

    let currentResponse = ''

    // 3. Stream from API (passing sessionId, not history arrays)
    await ApiClient.streamChatMessage(
      prompt,
      currentSessionId,
      (chunk) => {
        currentResponse += chunk
        set((state) => {
          const newMessages = [...state.messages]
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = currentResponse
          }
          return { messages: newMessages }
        })
      },
      () => { 
        set({ isStreaming: false });
        // Refresh sessions to get updated title
        get().loadSessions(); 
      },
      (error) => {
        set({ isStreaming: false, error: error.message })
        set((state) => {
          const newMessages = [...state.messages]
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].content === '') {
            newMessages.pop() // Remove empty placeholder on total failure
          }
          return { messages: newMessages }
        })
      }
    )
  },
  uploadFile: async (file: File) => {
    set({ isUploading: true, uploadStatus: null, error: null })
    try {
      const result = await ApiClient.uploadFile(file)
      set({ 
        isUploading: false, 
        uploadStatus: result.message,
        // Inject a system-style message into chat confirming the upload
        messages: [
          ...get().messages,
          {
            id: Math.random().toString(36).substring(7),
            role: 'assistant' as const,
            content: `📎 **File uploaded:** \`${result.filename}\`\n${result.message}\n\nYou can now ask me questions about this file.`
          }
        ]
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      set({ isUploading: false, error: msg })
    }
  },
  setAIPrompt: (prompt: string, simulatedResponse: string) => {
    set({ aiPanelOpen: true })
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Math.random().toString(36).substring(7), role: 'user', content: prompt }
      ]
    }))
    
    // Simulate streaming delay
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          { id: Math.random().toString(36).substring(7), role: 'assistant', content: simulatedResponse }
        ]
      }))
    }, 600)
  },
  clearError: () => set({ error: null }),
  clearMessages: () => set({ messages: [] }),

  selectedWeek: null,
  setSelectedWeek: (week) => set({ selectedWeek: week }),
}))
