import { History, Keyboard, Unplug } from 'lucide-react'
import { FC } from 'react'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export const ConnectedDevice: FC = () => {
  const { deviceName, conn, disconnect } = useConnectionContext()

  if (!deviceName) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center justify-end gap-x-2.5 rounded-md border px-2 py-1',
          !deviceName ? 'text-muted-foreground/35' : 'text-foreground',
        )}
      >
        <span className="text-xs uppercase">
          {deviceName ?? 'Disconnected'}
        </span>
        <Keyboard className="size-4" />
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            conn ? 'bg-green-400' : 'bg-muted',
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        sideOffset={12}
        align="center"
        alignOffset={0}
      >
        <DropdownMenuItem className="gap-3" onSelect={disconnect}>
          <Unplug className="size-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-3 text-red-400 transition-colors hover:bg-red-400 hover:text-white">
          <History className="size-4" />
          <span className="text-xs">Restore Stock Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
