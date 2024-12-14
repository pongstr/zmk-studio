import { useContext } from 'react'

import { ConnectionContext } from './ConnectionContext.tsx'

export function useConnectionContext() {
  return useContext(ConnectionContext)
}
