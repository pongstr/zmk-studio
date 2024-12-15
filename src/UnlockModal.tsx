import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import type { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { useContext, useMemo } from 'react'

import { ConnectionContext } from '@/components/providers/rpc-connect/ConnectionContext.tsx'

import { LockStateContext } from './components/providers/rpc-lock-state/LockStateContext.ts'
import { GenericModal } from './GenericModal'
import { ExternalLink } from './misc/ExternalLink'
import { useModalRef } from './misc/useModalRef'
import type { AvailableDevice } from './tauri/index'

export type TransportFactory = {
  label: string
  connect?: () => Promise<RpcTransport>
  pick_and_connect?: {
    list: () => Promise<Array<AvailableDevice>>
    connect: (dev: AvailableDevice) => Promise<RpcTransport>
  }
}

export interface UnlockModalProps {}

// eslint-disable-next-line no-empty-pattern
export const UnlockModal = ({}: UnlockModalProps) => {
  const conn = useContext(ConnectionContext)
  const lockState = useContext(LockStateContext)

  const open = useMemo(
    () =>
      !!conn.conn && lockState != LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED,
    [conn, lockState],
  )
  const dialog = useModalRef(open, false, false)

  return (
    <GenericModal ref={dialog}>
      <h1 className="text-xl">Unlock To Continue</h1>
      <p>
        For security reasons, your keyboard requires unlocking before using ZMK
        Studio.
      </p>
      <p>
        If studio unlocking hasn&apos;t been added to your keymap or a combo,
        see the{' '}
        <ExternalLink href="https://zmk.dev/docs/keymaps/behaviors/studio-unlock">
          Studio Unlock Behavior
        </ExternalLink>{' '}
        documentation for more infomation.
      </p>
    </GenericModal>
  )
}
