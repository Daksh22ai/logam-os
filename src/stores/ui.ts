import { create } from 'zustand'

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
  
  // AI Panel State
  messages: Message[]
  addMessage: (msg: Omit<Message, 'id'>) => void
  setAIPrompt: (prompt: string, simulatedResponse: string) => void
  
  // Chart Interaction State
  selectedWeek: number | null
  setSelectedWeek: (week: number | null) => void
}

export const useUI = create<UIStore>((set) => ({
  aiPanelOpen: false,
  aiPanelFS: false,
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  toggleAIFS: () => set((s) => ({ aiPanelFS: !s.aiPanelFS })),
  activeSection: 'reporting',
  setActiveSection: (activeSection) => set({ activeSection }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  messages: [],
  addMessage: (msg: Omit<Message, 'id'>) => 
    set((state) => ({ 
      messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7) }] 
    })),
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

  selectedWeek: null,
  setSelectedWeek: (week) => set({ selectedWeek: week }),
}))
