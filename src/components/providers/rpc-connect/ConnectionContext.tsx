import { createContext } from 'react'

import type { ConnectionState } from '@/types'

export const ConnectionContext = createContext<ConnectionState>({
  isOpen: false,
  conn: null,
  transports: [],
  disconnect: () => {},
  onConnect: () => {},
})
