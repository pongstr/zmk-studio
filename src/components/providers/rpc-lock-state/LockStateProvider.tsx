import { call_rpc } from '@zmkfirmware/zmk-studio-ts-client'
import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { ConnectionContext } from '@/components/providers/rpc-connect/ConnectionContext.tsx'
import { LockStateContext } from '@/components/providers/rpc-lock-state/LockStateContext.ts'
import { useSub } from '@/usePubSub.ts'

import { LockStateModal } from './LockStateModal.tsx'

export const LockStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { conn } = useContext(ConnectionContext)
  const [lockState, setLockState] = useState<LockState>(
    LockState.ZMK_STUDIO_CORE_LOCK_STATE_LOCKED,
  )

  useSub(
    'rpc_notification.core.lockStateChanged',
    (_lockState: unknown) => void setLockState(_lockState as LockState),
  )

  useEffect(() => {
    if (!conn) {
      // TODO: should reset history stack here
      // reset()
      setLockState(LockState.ZMK_STUDIO_CORE_LOCK_STATE_LOCKED)
      return
    }

    call_rpc(conn, { core: { getLockState: true } })
      .then((res) =>
        setLockState(
          res.core?.getLockState || LockState.ZMK_STUDIO_CORE_LOCK_STATE_LOCKED,
        ),
      )
      .catch(console.error)
  }, [conn])

  return (
    <LockStateContext.Provider value={lockState}>
      <LockStateModal />
      {children}
    </LockStateContext.Provider>
  )
}
