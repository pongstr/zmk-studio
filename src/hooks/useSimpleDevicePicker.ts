import { UserCancelledError } from '@zmkfirmware/zmk-studio-ts-client/transport/errors'
import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { useEffect, useState } from 'react'

import { AvailableDevice } from '@/tauri'
import type { TransportFactory } from '@/types'

export function useSimpleDevicePicker(
  onTransportCreated: (t: RpcTransport) => void,
) {
  const [availableDevices, setAvailableDevices] = useState<
    AvailableDevice[] | undefined
  >(undefined)
  const [selectedTransport, setSelectedTransport] = useState<
    TransportFactory | undefined
  >(undefined)

  useEffect(() => {
    if (!selectedTransport) {
      setAvailableDevices(undefined)
      return
    }

    let ignore = false

    async function connectTransport() {
      try {
        const transport = await selectedTransport?.connect?.()

        if (!ignore) {
          if (transport) {
            onTransportCreated(transport)
          }
          setSelectedTransport(undefined)
        }
      } catch (e) {
        if (!ignore) {
          console.error(e)
          if (e instanceof Error && !(e instanceof UserCancelledError)) {
            alert(e.message)
          }
          setSelectedTransport(undefined)
        }
      }
    }

    async function loadAvailableDevices() {
      const devices = await selectedTransport?.pick_and_connect?.list()

      if (!ignore) {
        setAvailableDevices(devices)
      }
    }

    if (selectedTransport.connect) {
      connectTransport().then(console.info).catch(console.error)
      return
    }

    loadAvailableDevices().then(console.info).catch(console.error)
    return () => {
      ignore = true
    }
  }, [onTransportCreated, selectedTransport])

  return {
    availableDevices,
    selectedTransport,
    setSelectedTransport,
  }
}