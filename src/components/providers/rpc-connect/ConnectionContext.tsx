import { createContext } from 'react'

import { ConnectionState } from '@/types'

export const ConnectionContext = createContext<ConnectionState>({ conn: null })
