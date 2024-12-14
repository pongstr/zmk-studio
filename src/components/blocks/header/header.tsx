import { CircleHelp } from 'lucide-react'
import { FC } from 'react'

import { ConnectedDevice } from '@/components/blocks/header/connected-device'
import { ButtonWithToolTip } from '@/components/ui/button-with-tooltip'
import { DiscordIcon, GithubIcon } from '@/components/ui/icon'
import { ZmkStudio } from '@/components/ui/zmk-studio'

export const Header: FC = () => {
  return (
    <header className="mx-auto flex w-full items-center justify-between gap-14 p-4 md:max-w-7xl md:px-2 xl:px-0">
      <div className="flex cursor-default select-none items-center justify-start gap-1.5">
        <ZmkStudio />
        <span className="font-bold uppercase opacity-85">Studio</span>
      </div>

      <ConnectedDevice />

      <div className="flex items-stretch justify-end gap-x-0.5">
        <ButtonWithToolTip text="About ZMK Studio">
          <button className="flex items-center justify-center rounded-md p-2 transition-colors hover:bg-muted">
            <CircleHelp className="size-[16px]" />
          </button>
        </ButtonWithToolTip>

        <ButtonWithToolTip text="Github">
          <button className="flex items-center justify-center rounded-md p-2 transition-colors hover:bg-muted">
            <GithubIcon className="size-4" />
          </button>
        </ButtonWithToolTip>

        <ButtonWithToolTip text="Discord">
          <button className="flex items-center justify-center rounded-md p-2 transition-colors hover:bg-muted">
            <DiscordIcon className="size-4" />
          </button>
        </ButtonWithToolTip>
      </div>
    </header>
  )
}
