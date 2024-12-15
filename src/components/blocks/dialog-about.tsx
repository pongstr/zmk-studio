import { FC, useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ZmkStudio } from '@/components/ui/zmk-studio'
import { useToggleModal } from '@/hooks/useToggleModal'
import type { SponsorsType } from '@/types'

export const DialogAbout: FC = () => {
  const [sponsors, setSponsors] = useState<Array<SponsorsType>>([])

  const { isOpen, handleOnOpenChange } = useToggleModal(
    'dialog',
    'dialog:about',
  )

  useEffect(() => {
    if (sponsors.length !== 0) return

    fetch('/data/sponsors.json', {
      method: 'get',
      mode: 'same-origin',
    })
      .then((res) => res.json() as Promise<Array<SponsorsType>>)
      .then(setSponsors)
      .catch(console.error)
  }, [sponsors])

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            <div className="flex cursor-default select-none items-center justify-start gap-1.5">
              <ZmkStudio />
              <span className="font-bold uppercase opacity-85">Studio</span>
            </div>
          </DialogTitle>
          <DialogDescription className="pt-4 text-center">
            <span className="block text-xl">The ZMK Project</span>
            <a
              href="https://zmk.dev/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary"
            >
              Official Website
            </a>
            <span className="mx-auto flex max-w-4xl items-center justify-center divide-x">
              <a
                href="https://github.com/zmk/zmk-studio/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-2 text-xs text-accent"
              >
                <span>Github Issues</span>
              </a>

              <a
                href="https://zmk.dev/community/discord/invite"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-2 text-xs text-accent"
              >
                <span>Discord Server</span>
              </a>
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <p className="mx-auto max-w-screen-sm text-center text-sm leading-relaxed">
            ZMK Studio is made possible thanks to the generous donation of time
            from our contributors, as well as the financial sponsorship from the
            following vendors:
          </p>
        </div>

        <div className="w-full space-y-2"></div>
      </DialogContent>
    </Dialog>
  )
}
