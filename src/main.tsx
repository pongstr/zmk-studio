import '@/index.css'

import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { DialogAbout } from '@/components/blocks/dialog-about'
import { DialogLicense } from '@/components/blocks/dialog-license'
import { Header } from '@/components/blocks/header/header'
import { ZmkStudioFooter } from '@/components/blocks/zmk-studio-footer'
import { ConnectionProvider } from '@/components/providers/rpc-connect/ConnectionProvider.tsx'
import { ThemeProvider } from '@/components/providers/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Suspense>
      <ThemeProvider>
        <ConnectionProvider>
          <Header />
          <main className="h-[calc(100vh_-_100px)] w-screen">
            <App />
          </main>
          <ZmkStudioFooter />
        </ConnectionProvider>
        <DialogAbout />
        <DialogLicense />
        <Toaster />
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
)
