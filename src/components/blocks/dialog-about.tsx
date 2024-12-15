import { FC } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ZmkStudio } from '@/components/ui/zmk-studio'
import { useToggleModal } from '@/hooks/useToggleModal'
import { cn } from '@/lib/utils'
import { SponsorsType } from '@/types'

//import cannonKeys from './assets/cannonkeys.png'
//import cannonKeysDarkMode from './assets/cannonkeys-dark-mode.png'
//import deskHero from './assets/deskhero.webp'
//import deskHeroDarkMode from './assets/deskhero-dark-mode.webp'
//import keebio from './assets/keebio.avif'
//import keebmaker from './assets/keebmaker.png'
//import keebmakerDarkMode from './assets/keebmaker-dark-mode.png'
//import keycapsss from './assets/keycapsss.png'
//import keycapsssDarkMode from './assets/keycapsss-dark-mode.png'
//import keychron from './assets/keychron.png'
//import keychronDarkMode from './assets/keychron-dark-mode.png'
//import kinesis from './assets/kinesis.png'
//import kinesisDarkMode from './assets/kinesis-dark-mode.png'
//import littleKeyboards from './assets/littlekeyboards.avif'
//import littleKeyboardsDarkMode from './assets/littlekeyboards-dark-mode.avif'
//import mechlovinDarkMode from './assets/mechlovin-dark-mode.png'
//import mechlovin from './assets/mechloving.png'
//import mekibo from './assets/mekibo.png'
//import mekiboDarkMode from './assets/mekibo-dark-mode.png'
//import mode from './assets/mode.png'
//import modeDarkMode from './assets/mode-dark-mode.png'
//import niceAndTyperactive from './assets/niceandtyperactive.png'
//import niceAndTyperactiveDarkMode from './assets/niceandtyperactive-dark-mode.png'
//import phaseByte from './assets/phasebyte.png'
//import splitkb from './assets/splitkb.png'
//import splitkbDarkMode from './assets/splitkb-dark-mode.png'
//
const sponsors: Array<SponsorsType> = [
  {
    level: 'Platinum',
    size: 'large',
    vendors: [
      {
        name: 'nice!keyboards / typeractive',
        darkModeImg: '/assets/niceandtyperactive-dark-mode.png',
        url: 'https://typeractive.xyz/',
        img: '/assets/niceandtyperactive.png',
      },
      {
        name: 'Kinesis',
        darkModeImg: '/assets/kinesis-dark-mode.png',
        url: 'https://kinesis-ergo.com/',
        img: '/assets/kinesis.png',
      },
    ],
  },
  //{
  //  level: 'Gold+',
  //  size: 'large',
  //  vendors: [
  //    {
  //      name: 'CannonKeys',
  //      img: cannonKeys,
  //      darkModeImg: cannonKeysDarkMode,
  //      url: 'https://cannonkeys.com/',
  //    },
  //    {
  //      name: 'Keychron',
  //      img: keychron,
  //      darkModeImg: keychronDarkMode,
  //      url: 'https://keychron.com/',
  //    },
  //  ],
  //},
  //{
  //  level: 'Gold',
  //  size: 'medium',
  //  vendors: [
  //    {
  //      name: 'Little Keyboards',
  //      img: littleKeyboards,
  //      darkModeImg: littleKeyboardsDarkMode,
  //      url: 'https://littlekeyboards.com/',
  //    },
  //    {
  //      name: 'Keebmaker',
  //      img: keebmaker,
  //      darkModeImg: keebmakerDarkMode,
  //      url: 'https://keebmaker.com/',
  //    },
  //  ],
  //},
  //{
  //  level: 'Silver',
  //  size: 'medium',
  //  vendors: [
  //    {
  //      name: 'keeb.io',
  //      img: keebio,
  //      url: 'https://keeb.io/',
  //    },
  //    {
  //      name: 'Mode Designs',
  //      img: mode,
  //      darkModeImg: modeDarkMode,
  //      url: 'https://modedesigns.com/',
  //    },
  //  ],
  //},
  //{
  //  level: 'Bronze',
  //  size: 'small',
  //  vendors: [
  //    {
  //      name: 'deskhero',
  //      img: deskHero,
  //      darkModeImg: deskHeroDarkMode,
  //      url: 'https://deskhero.ca/',
  //    },
  //    {
  //      name: 'PhaseByte',
  //      img: phaseByte,
  //      url: 'https://phasebyte.com/',
  //    },
  //    {
  //      name: "Mechlovin'",
  //      img: mechlovin,
  //      darkModeImg: mechlovinDarkMode,
  //      url: 'https://mechlovin.studio/',
  //    },
  //  ],
  //},
  //{
  //  level: 'Additional',
  //  size: 'small',
  //  vendors: [
  //    {
  //      name: 'splitkb.com',
  //      img: splitkb,
  //      darkModeImg: splitkbDarkMode,
  //      url: 'https://splitkb.com/',
  //    },
  //    {
  //      name: 'keycapsss',
  //      img: keycapsss,
  //      darkModeImg: keycapsssDarkMode,
  //      url: 'https://keycapsss.com/',
  //    },
  //    {
  //      name: 'mekibo',
  //      img: mekibo,
  //      darkModeImg: mekiboDarkMode,
  //      url: 'https://mekibo.com/',
  //    },
  //  ],
  //},
]

type SponsorLevelProps = {
  label: string
  level:
    | 'platinum'
    | 'gold+'
    | 'gold'
    | 'gold'
    | 'silver'
    | 'bronze'
    | 'additional'
}

const SponsorLevel: FC<SponsorLevelProps> = ({ label, level }) => {
  const levels = {
    platinum: 'grid-cols-2',
    'gold+': 'grid-cols-3',
    gold: 'grid-cols-3',
    silver: 'grid-cols-4',
    bronze: 'grid-cols-5',
    additional: 'grid-cols-6',
  }

  return (
    <div className="space-y-2">
      <h3 className="rounded-lg border bg-muted/30 p-1 text-center">
        <span className="text-xs font-semibold uppercase opacity-50">
          {label}
        </span>
      </h3>

      <div className={cn('grid grid-flow-row gap-2', levels[level])}>
        <a className="flex h-32 items-center justify-center rounded-lg border bg-muted/30 p-1 text-center">
          vendor
        </a>

        <a className="flex h-32 items-center justify-center rounded-lg border bg-muted/30 p-1 text-center">
          vendor
        </a>
      </div>
    </div>
  )
}

export const DialogAbout: FC = () => {
  const { isOpen, handleOnOpenChange } = useToggleModal(
    'dialog',
    'dialog:about',
  )

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
        <div className="mx-auto max-w-4xl space-y-8 px-4 pt-4">
          <p className="mx-auto max-w-screen-sm text-center text-sm leading-relaxed">
            ZMK Studio is made possible thanks to the generous donation of time
            from our contributors, as well as the financial sponsorship from the
            following vendors:
          </p>
        </div>

        <SponsorLevel label="Platinum" level="platinum" />
      </DialogContent>
    </Dialog>
  )
}
