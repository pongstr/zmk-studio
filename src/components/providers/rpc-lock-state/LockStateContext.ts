import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import { createContext } from 'react'

export const LockStateContext = createContext<LockState>(
  LockState.ZMK_STUDIO_CORE_LOCK_STATE_LOCKED,
)
