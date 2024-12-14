import { DialogAbout } from '@/components/blocks/dialog-about.tsx'
import { DialogLicense } from '@/components/blocks/dialog-license.tsx'
import { Header } from '@/components/blocks/header/header'
import { ZmkStudioFooter } from '@/components/blocks/zmk-studio-footer.tsx'
import { LockStateProvider } from '@/components/providers/rpc-lock-state/LockStateProvider.tsx'

function App() {
  return (
    <>
      <LockStateProvider>
        <Header />
        <main className="h-[calc(100vh_-_100px)] w-screen">
          test
          {/*
        <UndoRedoContext.Provider value={doIt}>
          <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
          <LicenseNoticeModal
            open={showLicenseNotice}
            onClose={() => setShowLicenseNotice(false)}
          />
          <div className="inline-grid size-full max-h-screen max-w-[100vw] grid-cols-[auto] grid-rows-[auto_1fr_auto] overflow-hidden bg-base-100 text-base-content">
            <AppHeader
              connectedDeviceLabel={connectedDeviceName}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onSave={save}
              onDiscard={discard}
              onDisconnect={disconnect}
              onResetSettings={resetSettings}
            />
            <Keyboard />
            <AppFooter
              onShowAbout={() => setShowAbout(true)}
              onShowLicenseNotice={() => setShowLicenseNotice(true)}
            />
          </div>
        </UndoRedoContext.Provider>
            */}
        </main>
        <ZmkStudioFooter />
      </LockStateProvider>
      <DialogAbout />
      <DialogLicense />
    </>
  )
}

export default App
