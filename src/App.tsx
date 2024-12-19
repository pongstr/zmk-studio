import { LockStateProvider } from '@/components/providers/rpc-lock-state/LockStateProvider'

import Keyboard from './keyboard/Keyboard'

function App() {
  return (
    <LockStateProvider>
      <Keyboard />
    </LockStateProvider>
  )
}

export default App
