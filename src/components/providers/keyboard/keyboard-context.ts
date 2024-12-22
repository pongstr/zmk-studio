import { Keymap } from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { createContext, Dispatch, SetStateAction } from 'react'

type KeyboardContextType = {
  keymap: Keymap
  setKeymap: Dispatch<SetStateAction<Keymap | undefined>>
  currentLayer: number
  setCurrentLayer: Dispatch<SetStateAction<number>>
}

export const KeyboardContext = createContext<KeyboardContextType>(
  {} as KeyboardContextType,
)
