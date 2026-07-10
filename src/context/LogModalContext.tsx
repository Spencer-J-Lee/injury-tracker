import { useState, useCallback, type ReactNode } from 'react'
import { LogModalContext, type LogModalState } from '@/context/logModalStore'

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
