import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { useMemo } from 'react'

import { useDeviceList } from '@/hooks/useDeviceList'
import { useSimpleDevicePicker } from '@/hooks/useSimpleDevicePicker'
import { TransportFactory } from '@/UnlockModal'

export function useConnectOptions(
  open: boolean,
  transports: TransportFactory[],
  onTransportCreated: (t: RpcTransport) => void,
) {
  console.log(transports)

  const useSimplePicker = useMemo(
    () => transports.every((t) => !t.pick_and_connect),
    [transports],
  )
  const devicePicker = useSimpleDevicePicker(onTransportCreated)
  const deviceList = useDeviceList(
    open ?? false,
    transports,
    onTransportCreated,
  )

  return useSimplePicker ? devicePicker : deviceList
}
