import { useContext } from 'react'

import { EditHistoryContext } from './EditHistoryContext'

export function useEditHistory() {
  return useContext(EditHistoryContext)
}
