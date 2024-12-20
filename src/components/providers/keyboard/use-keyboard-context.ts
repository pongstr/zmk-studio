import { useContext } from 'react'

import { KeyboardContext } from '@/components/providers/keyboard/keyboard-context.ts'

export function useKeyboardContext() {
  return useContext(KeyboardContext)
}
