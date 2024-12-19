import { createContext } from 'react'

import { DoCallback } from '@/types'

type AsyncFnType = () => Promise<void>

type EditHistoryContextType = {
  doIt: ((_dc: DoCallback) => Promise<void>) | null
  undo: AsyncFnType | undefined
  redo: AsyncFnType | undefined
  canUndo: boolean
  canRedo: boolean
  reset: () => void
}

export const EditHistoryContext = createContext<EditHistoryContextType>({
  doIt: null,
  undo: undefined,
  redo: undefined,
  canRedo: false,
  canUndo: false,
  reset: () => {},
})
