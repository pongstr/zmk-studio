import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { BluetoothIcon, UsbIcon } from '@/components/ui/icon'
import { useSimpleDevicePicker } from '@/hooks/useSimpleDevicePicker'
import type { TransportFactory } from '@/types'

type SimpleDevicePickerProps = {
  transports: TransportFactory[]
  onTransportCreated: (t: RpcTransport) => void
}

export const SimpleDevicePicker: FC<SimpleDevicePickerProps> = ({
  transports,
  onTransportCreated,
}) => {
  const { selectedTransport, setSelectedTransport, availableDevices } =
    useSimpleDevicePicker(onTransportCreated)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-start gap-2">
        {transports.map((transport) => (
          <Button
            type="button"
            variant="secondary"
            className="pr-6"
            key={transport.label}
            onClick={() => setSelectedTransport(transport)}
          >
            <span>
              {transport.isWireless ? (
                <BluetoothIcon className="size-3" />
              ) : (
                <UsbIcon className="size-3" />
              )}
            </span>
            <span>{transport.label}</span>
          </Button>
        ))}
      </div>
      <div>
        {selectedTransport && availableDevices && (
          <ul>
            {availableDevices.map((d) => (
              <li
                key={d.id}
                className="m-1 p-1"
                onClick={async () => {
                  onTransportCreated(
                    await selectedTransport!.pick_and_connect!.connect(d),
                  )
                  setSelectedTransport(undefined)
                }}
              >
                {d.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
