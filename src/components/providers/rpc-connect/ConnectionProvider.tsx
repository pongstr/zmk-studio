import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { Unplug } from 'lucide-react'
import { FC, PropsWithChildren, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { connect } from '@/components/providers/rpc-connect/connect.util.ts'
import { TRANSPORTS } from '@/lib/transports.ts'
import type { ConnectionState } from '@/types.ts'

import { ConnectionContext } from './ConnectionContext.tsx'

const DisconnectPrompt: FC<{ deviceName?: string }> = ({ deviceName }) => (
  <div className="flex items-center justify-start gap-2">
    <Unplug className="size-4" />
    <span>{deviceName ?? 'Device'} disconnected.</span>
  </div>
)

export const ConnectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const abort = useRef<AbortController | null>(null)

  const [conn, setConn] = useState<ConnectionState>({
    conn: null,
    transports: [],
  })
  const [deviceName, setConnectedDeviceName] = useState<string | undefined>(
    undefined,
  )

  // eslint-disable-next-line
  const onConnect = useCallback(
    (transport: RpcTransport) => {
      abort.current = new AbortController()
      connect(transport, setConn, setConnectedDeviceName, abort.current.signal)
    },
    [setConnectedDeviceName],
  )

  const disconnect = useCallback(() => {
    if (!conn.conn) return

    conn.conn.request_writable
      .close()
      .then(() => {
        abort.current?.abort('User disconnected')
        toast(<DisconnectPrompt deviceName={deviceName} />, { duration: 5000 })
      })
      .catch(console.error)
  }, [conn.conn])

  // eslint-disable-next-line
  //const connectPrompt = useMemo(() => !conn.conn, [conn.conn])

  return (
    <ConnectionContext.Provider
      value={{
        conn: conn.conn,
        disconnect,
        deviceName,
        onConnect,
        transports: TRANSPORTS,
      }}
    >
      {/*<ConnectModal
        open={connectPrompt}
        transports={TRANSPORTS}
        onTransportCreated={onConnect}
      />*/}
      {children}
    </ConnectionContext.Provider>
  )
}
