import {
  call_rpc,
  create_rpc_connection,
} from '@zmkfirmware/zmk-studio-ts-client'
import type { Notification } from '@zmkfirmware/zmk-studio-ts-client/studio'
import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { Dispatch } from 'react'

import { valueAfter } from '@/misc/async.ts'
import { ConnectionState } from '@/types.ts'
import { emitter } from '@/usePubSub.ts'

export async function listen_for_notifications(
  stream: ReadableStream<Notification>,
  signal: AbortSignal,
) {
  const reader = stream.getReader()
  const onAbort = () => {
    reader.cancel()
    reader.releaseLock()
  }

  signal.addEventListener('abort', onAbort, { once: true })

  do {
    try {
      const { done, value } = await reader.read()

      if (done) break
      if (!value) continue

      console.info('Notification', value)
      await emitter.emit('rpc_notification', value)

      const subsystem = Object.entries(value).find(([_, v]) => Boolean(v))

      if (!subsystem) continue

      const [subId, subData] = subsystem
      const event = Object.entries(subData).find(([_, v]) => Boolean(v))

      if (!event) continue

      const [eventName, eventData] = event
      await emitter.emit(
        ['rpc_notification', subId, eventName].join('.'),
        eventData,
      )
    } catch (error: unknown) {
      signal.removeEventListener('abort', onAbort)
      reader.releaseLock()
      throw error
    }

    // eslint-disable-next-line
  } while (true)
}

export async function connect(
  transport: RpcTransport,
  setConn: Dispatch<ConnectionState>,
  setConnectedDeviceName: Dispatch<string | undefined>,
  signal: AbortSignal,
) {
  const conn = create_rpc_connection(transport, { signal })

  const data = await Promise.race([
    call_rpc(conn, { core: { getDeviceInfo: true } })
      .then((r) => r?.core?.getDeviceInfo)
      .catch((e) => {
        console.error('Failed first RPC call', e)
        return undefined
      }),
    valueAfter(undefined, 1000),
  ])

  if (!data) {
    // TODO: Show a proper toast/alert not using `window.alert`
    window.alert('Failed to rpc-connect to the chosen device')
    return
  }

  listen_for_notifications(conn.notification_readable, signal)
    .then(() => {
      setConnectedDeviceName(undefined)
      setConn({ conn: null })
    })
    .catch(() => {
      setConnectedDeviceName(undefined)
      setConn({ conn: null })
    })

  setConnectedDeviceName(data.name)
  setConn({ conn })
}
