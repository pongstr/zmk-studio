import { Bluetooth, RefreshCcw } from 'lucide-react'
import type { FC } from 'react'
import { ListBox, ListBoxItem } from 'react-aria-components'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext'
import { Button } from '@/components/ui/button'
import { UsbIcon } from '@/components/ui/icon'
import { useDeviceList } from '@/hooks/useDeviceList'
import { cn } from '@/lib/utils'

export const DeviceList: FC = () => {
  const {
    isOpen,
    transports,
    onConnect: onTransportCreated,
  } = useConnectionContext()

  const { devices, onRefresh, onSelect, refreshing, selectedDev } =
    useDeviceList(isOpen, transports, onTransportCreated)

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase text-muted-foreground">
          Select Device
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCcw
            className={cn(
              'size-2 transition-transform',
              refreshing && 'animate-spin',
            )}
          />
          <span className="sr-only">Refresh device list</span>
        </Button>
      </div>

      {devices.length === 0 && (
        <div className="flex min-h-32 select-none flex-col items-center justify-center space-y-0.5 rounded-lg border">
          <span className="block p-4 text-xs text-muted-foreground">
            Loading devices...
          </span>
        </div>
      )}

      {devices.length > 0 && (
        <ListBox
          aria-label="Device"
          selectionMode="single"
          items={devices}
          selectedKeys={selectedDev}
          onSelectionChange={onSelect}
          className="flex select-none flex-col justify-center space-y-0.5 rounded-lg border"
        >
          {([t, d]) => (
            <ListBoxItem
              className="flex cursor-pointer justify-between gap-2 rounded-lg p-4 text-sm transition-colors hover:bg-muted/25"
              id={d.id}
              aria-label={d.label}
            >
              <span>{d.label}</span>
              {t.isWireless && <Bluetooth className="size-4 opacity-75" />}
              {!t.isWireless && <UsbIcon className="size-4 opacity-75" />}
            </ListBoxItem>
          )}
        </ListBox>
      )}
    </div>
  )
}
