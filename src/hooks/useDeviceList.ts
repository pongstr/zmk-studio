import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { useCallback, useEffect, useState } from 'react'
import type { Key, Selection } from 'react-aria-components'

import { AvailableDevice } from '@/tauri'
import type { TransportFactory } from '@/types'

export function useDeviceList(
  open: boolean,
  transports: Array<TransportFactory>,
  onTransportCreated: (t: RpcTransport) => void,
) {
  const [devices, setDevices] = useState<
    Array<[TransportFactory, AvailableDevice]>
  >([])
  const [selectedDev, setSelectedDev] = useState(new Set<Key>())
  const [refreshing, setRefreshing] = useState(false)

  const LoadEm = useCallback(async () => {
    setRefreshing(true)
    const entries: Array<[TransportFactory, AvailableDevice]> = []
    for (const t of transports.filter((t) => t.pick_and_connect)) {
      const devices = await t.pick_and_connect?.list()
      if (!devices) {
        continue
      }

      entries.push(
        ...devices.map<[TransportFactory, AvailableDevice]>((d) => {
          return [t, d]
        }),
      )
    }

    setDevices(entries)
    setRefreshing(false)
  }, [transports])

  useEffect(() => {
    setSelectedDev(new Set())
    setDevices([])

    LoadEm().then(console.info).catch(console.error)
  }, [transports, open, setDevices, LoadEm])

  const onRefresh = useCallback(() => {
    setSelectedDev(new Set())
    setDevices([])

    LoadEm().then(console.info).catch(console.error)
  }, [LoadEm])

  const onSelect = useCallback(
    async (keys: Selection) => {
      if (keys === 'all') {
        return
      }
      const dev = devices.find(([_t, d]) => keys.has(d.id))
      if (dev) {
        dev[0]
          .pick_and_connect!.connect(dev[1])
          .then(onTransportCreated)
          .catch((e) => alert(e))
      }
    },
    [devices, onTransportCreated],
  )

  return {
    devices,
    setDevices,
    onRefresh,
    onSelect,
    refreshing,
    selectedDev,
    setSelectedDev,
  }
}
