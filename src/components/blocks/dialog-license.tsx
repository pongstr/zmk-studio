import { FC } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ZmkStudio } from '@/components/ui/zmk-studio'

export const DialogLicense: FC = () => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            <div className="flex cursor-default select-none items-center justify-start gap-1.5">
              <ZmkStudio />
              <span className="font-bold uppercase opacity-85">Studio</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            ZMK Studio is released under the open source Apache 2.0 license. A
            copy of the NOTICE file from the ZMK Studio repository is included
            here:
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
