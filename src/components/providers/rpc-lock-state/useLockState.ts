import { useContext } from 'react'

import { LockStateContext } from './LockStateContext.ts'

export function useLockState() {
  return useContext(LockStateContext)
}
