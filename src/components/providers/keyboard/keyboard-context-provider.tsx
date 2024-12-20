import { Keymap } from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { FC, PropsWithChildren } from 'react'

import { KeyboardContext } from '@/components/providers/keyboard/keyboard-context.ts'
import { useConnectedDeviceData } from '@/components/providers/rpc-connect/useConnectedDeviceData.ts'

export const KeyboardContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [keymap, setKeymap] = useConnectedDeviceData<Keymap>(
    { keymap: { getKeymap: true } },
    (keymap) => {
      console.log('Got the keymap!')
      return keymap?.keymap?.getKeymap
    },
    true,
  )

  if (!keymap) return null

  return (
    <KeyboardContext.Provider value={{ keymap, setKeymap }}>
      {children}
    </KeyboardContext.Provider>
  )
}
