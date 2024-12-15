import '@/index.css'

import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Switch } from 'wouter'

import { Header } from '@/components/blocks/header/header'
import { ZmkStudioFooter } from '@/components/blocks/zmk-studio-footer'
import { ConnectionProvider } from '@/components/providers/rpc-connect/ConnectionProvider.tsx'
import { ThemeProvider } from '@/components/providers/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import AppPage from '@/pages/app'
import SettingsPage from '@/pages/settings'
import SponsorsPage from '@/pages/sponsors'
import TestPage from '@/pages/test'

import { DialogAbout } from './components/blocks/dialog-about'
import { DialogLicense } from './components/blocks/dialog-license'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Suspense>
      <ThemeProvider>
        <ConnectionProvider>
          <Header />
          <main className="h-[calc(100vh_-_100px)] w-screen">
            <Switch>
              <Route path="/sponsors" component={SponsorsPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/test" component={TestPage} />
              <Route path="/" component={AppPage} />
            </Switch>
          </main>
          <Toaster />
          <ZmkStudioFooter />
        </ConnectionProvider>
        <DialogAbout />
        <DialogLicense />
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
)
