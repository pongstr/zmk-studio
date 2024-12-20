import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { Unplug } from 'lucide-react'
import {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

import { ConnectModal } from '@/components/connect-modal/connect-modal.tsx'
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

  const [conn, setConn] = useState<Pick<ConnectionState, 'conn'>>({
    conn: null,
  })

  const [deviceName, setConnectedDeviceName] = useState<string | undefined>(
    undefined,
  )

  const onConnect = useCallback(
    (transport: RpcTransport) => {
      abort.current = new AbortController()
      connect(transport, setConn, setConnectedDeviceName, abort.current.signal)
        .then(console.info)
        .catch(console.error)
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

  const isOpen = useMemo(() => !conn.conn, [conn.conn])

  return (
    <ConnectionContext.Provider
      value={{
        isOpen,
        onConnect,
        deviceName,
        disconnect,
        conn: conn.conn,
        transports: TRANSPORTS,
      }}
    >
      <ConnectModal />
      {children}
    </ConnectionContext.Provider>
  )
}
