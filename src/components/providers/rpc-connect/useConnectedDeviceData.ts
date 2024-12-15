import { Request, RequestResponse } from '@zmkfirmware/zmk-studio-ts-client'
import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import React, { SetStateAction, useContext, useEffect, useState } from 'react'

import { call_rpc } from '../../../lib/logging.ts'
import { LockStateContext } from '../rpc-lock-state/LockStateContext.ts'
import { ConnectionContext } from './ConnectionContext.tsx'

export function useConnectedDeviceData<T>(
  req: Omit<Request, 'requestId'>,
  response_mapper: (resp: RequestResponse) => T | undefined,
  requireUnlock?: boolean,
): [T | undefined, React.Dispatch<SetStateAction<T | undefined>>] {
  const connection = useContext(ConnectionContext)
  const lockState = useContext(LockStateContext)
  const [data, setData] = useState<T | undefined>(undefined)

  useEffect(
    () => {
      if (
        !connection.conn ||
        (requireUnlock &&
          lockState != LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED)
      ) {
        setData(undefined)
        return
      }

      async function startRequest() {
        setData(undefined)
        if (!connection.conn) {
          return
        }

        const response = response_mapper(await call_rpc(connection.conn, req))

        if (!ignore) {
          setData(response)
        }
      }

      let ignore = false
      startRequest()

      return () => {
        ignore = true
      }
    },
    requireUnlock
      ? [connection, requireUnlock, lockState]
      : [connection, requireUnlock],
  )

  return [data, setData]
}
