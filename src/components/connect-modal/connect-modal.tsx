import { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'
import { ExternalLink } from 'lucide-react'
import { FC, useMemo } from 'react'

import { ZmkStudioFooter } from '@/components/blocks/zmk-studio-footer.tsx'
import { DeviceList } from '@/components/connect-modal/device-list'
import { SimpleDevicePicker } from '@/components/connect-modal/simple-device-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ZmkStudio } from '@/components/ui/zmk-studio'
import type { TransportFactory } from '@/types'

type ConnectModalProps = {
  open: boolean
  transports: Array<TransportFactory>
  onTransportCreated: (t: RpcTransport) => void
}

const SetupDevicePicker: FC<ConnectModalProps> = (props) => {
  const simpleMode = useMemo(
    () => props.transports.every((t) => !t.pick_and_connect),
    [props.transports],
  )

  if (simpleMode) return <SimpleDevicePicker {...props} />

  return <DeviceList {...props} />
}

const NoTransportOptions: FC = () => {
  return (
    <div className="m-4 flex flex-col gap-2">
      <p>
        Your browser is not supported. ZMK Studio uses either{' '}
        <ExternalLink href="https://caniuse.com/web-serial">
          Web Serial
        </ExternalLink>{' '}
        or{' '}
        <ExternalLink href="https://caniuse.com/web-bluetooth">
          Web Bluetooth
        </ExternalLink>{' '}
        (Linux only) to connect to ZMK devices.
      </p>

      <div>
        <p>To use ZMK Studio, either:</p>
        <ul className="list-inside list-disc">
          <li>
            Use a browser that supports the above web technologies, e.g.
            Chrome/Edge, or
          </li>
          <li>
            Download our{' '}
            <ExternalLink href="https://github.com/zmkfirmware/zmk-studio/releases">
              cross platform application
            </ExternalLink>
            .
          </li>
        </ul>
      </div>
    </div>
  )
}

export const ConnectModal: FC<ConnectModalProps> = (props) => {
  const hasTransports = useMemo(
    (): boolean => props.transports.length > 0,
    [props.transports],
  )

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            <div className="flex cursor-default select-none items-center justify-start gap-1.5">
              <ZmkStudio />
              <span className="font-bold uppercase opacity-85">Studio</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            Select a connection type
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-48 items-center justify-center py-4">
          {hasTransports && <SetupDevicePicker {...props} />}
          {!hasTransports && <NoTransportOptions />}
        </div>
        <DialogFooter>
          <ZmkStudioFooter />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}