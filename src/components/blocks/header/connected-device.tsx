import { FlaskConical, History, Keyboard, Settings, Unplug } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'wouter'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import { buttonVariants } from '@/components/ui/button'
import { ButtonWithToolTip } from '@/components/ui/button-with-tooltip'
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

  //className="inline-block rounded-lg p-2 transition-colors hover:bg-muted hover:text-accent"
  if (!deviceName) {
    return (
      <div className="flex items-center justify-center gap-0.5">
        <ButtonWithToolTip text="Configure">
          <Link
            to="/"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <Keyboard className="size-5" />
          </Link>
        </ButtonWithToolTip>

        <ButtonWithToolTip text="Key Tester">
          <Link
            to="/test"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <FlaskConical className="size-5" />
          </Link>
        </ButtonWithToolTip>

        <ButtonWithToolTip text="ZMK Studio Settings">
          <Link
            to="/settings"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <Settings className="size-5" />
          </Link>
        </ButtonWithToolTip>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center justify-end gap-x-2.5 rounded-md border px-2 py-1',
          !deviceName ? 'text-muted-foreground/35' : 'text-secondary',
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
