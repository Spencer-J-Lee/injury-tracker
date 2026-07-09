import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface LogModalState {
  open: boolean
  initialInjuryIds: string[]
}

interface LogModalContextValue {
  state: LogModalState
  openLogModal: (initialInjuryIds?: string[]) => void
  closeLogModal: () => void
}

const LogModalContext = createContext<LogModalContextValue | null>(null)

export function LogModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LogModalState>({ open: false, initialInjuryIds: [] })

  const openLogModal = useCallback((initialInjuryIds: string[] = []) => {
    setState({ open: true, initialInjuryIds })
  }, [])

  const closeLogModal = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  return (
    <LogModalContext.Provider value={{ state, openLogModal, closeLogModal }}>
      {children}
    </LogModalContext.Provider>
  )
}

export function useLogModal() {
  const ctx = useContext(LogModalContext)
  if (!ctx) throw new Error('useLogModal must be used within LogModalProvider')
  return ctx
}
