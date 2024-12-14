import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import { FC, useMemo } from 'react'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { ZmkStudio } from '@/components/ui/zmk-studio.tsx'
import { ExternalLink } from '@/misc/ExternalLink.tsx'

import { useLockState } from './useLockState.ts'

export const LockStateModal: FC = () => {
  const { conn } = useConnectionContext()
  const state = useLockState()

  const open = useMemo(
    () =>
      Boolean(conn && state !== LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED),
    [conn, state],
  )

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center">
            <div className="flex cursor-default select-none items-center justify-start gap-1.5">
              <ZmkStudio />
              <span className="font-bold uppercase opacity-85">Studio</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            Unlock to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-10 text-center">
          <p className="text-sm">
            For security reasons, your keyboard requires unlocking before using
            ZMK Studio.
          </p>

          <p className="text-sm">
            If studio unlocking hasn&apos;t been added to your keymap or a
            combo, see the{' '}
            <ExternalLink href="https://zmk.dev/docs/keymaps/behaviors/studio-unlock">
              Studio Unlock Behavior
            </ExternalLink>{' '}
            documentation for more infomation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
