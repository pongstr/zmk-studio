import { EditHistoryProvider } from '@/components/providers/edit-history/EditHistoryProvider'
import Keyboard from '@/keyboard/Keyboard'

function App() {
  return (
    <EditHistoryProvider>
      <Keyboard />
    </EditHistoryProvider>
  )
}

export default App
