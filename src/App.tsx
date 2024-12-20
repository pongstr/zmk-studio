import { Keyboard } from '@/components/keyboard/Keyboard.tsx'
import { EditHistoryProvider } from '@/components/providers/edit-history/EditHistoryProvider'
import { KeyboardContextProvider } from '@/components/providers/keyboard/keyboard-context-provider.tsx'
// import Keyboard from '@/keyboard/Keyboard'

function App() {
  return (
    <EditHistoryProvider>
      <KeyboardContextProvider>
        <Keyboard />
      </KeyboardContextProvider>
    </EditHistoryProvider>
  )
}

export default App
