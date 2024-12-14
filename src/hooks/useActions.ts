import { call_rpc, RequestResponse } from '@zmkfirmware/zmk-studio-ts-client'
import { useCallback, useContext } from 'react'
import { toast } from 'sonner'

import { ConnectionContext } from '@/components/providers/rpc-connect/ConnectionContext.tsx'

export function useActions() {
  const { conn } = useContext(ConnectionContext)

  const save = useCallback(() => {
    // TODO: broadcast notification that connection is not active
    if (!conn) return

    function successCallback(res: RequestResponse) {
      // TODO: broadcast notification for success/failed response
      if (!res.keymap?.saveChanges || res.keymap?.saveChanges.err) {
        console.error('Failed to save changes', res.keymap?.saveChanges)
      }
    }

    call_rpc(conn, { keymap: { saveChanges: true } })
      .then(successCallback)
      .catch(console.error)
  }, [conn])

  const discard = useCallback(() => {
    // TODO: broadcast notification that connection is not active
    if (!conn) return
  }, [conn])

  const resetSetttings = useCallback(() => {
    // TODO: broadcast notification that connection is not active
    if (!conn) return

    function successCallback() {}

    call_rpc(conn, { core: { resetSettings: true } })
      .then(successCallback)
      .catch((err: unknown) => {
        toast('Restore settings', {
          description: 'Successfully restored settings',
        })
        console.error(err as Error)
      })
  }, [conn])

  return { save, discard, resetSetttings }
}
