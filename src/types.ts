import type { RpcConnection } from '@zmkfirmware/zmk-studio-ts-client/index'
import type { RpcTransport } from '@zmkfirmware/zmk-studio-ts-client/transport/index'

import type { AvailableDevice } from '@/tauri'

declare global {
  interface Window {
    __TAURI_INTERNALS__?: object
  }
}

export type ConnectionState = {
  conn: RpcConnection | null
  transports: Array<TransportFactory>
  deviceName?: string
  disconnect?: () => void
  onConnect?: (t: RpcTransport) => void
}

export type TransportFactory = {
  label: string
  isWireless?: boolean
  connect?: () => Promise<RpcTransport>
  pick_and_connect?: {
    list: () => Promise<Array<AvailableDevice>>
    connect: (dev: AvailableDevice) => Promise<RpcTransport>
  }
}

export type Theme = 'dark' | 'light' | 'system'

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export type SponsorSize = 'large' | 'medium' | 'small'

export type SponsorsType = {
  level: string
  size: SponsorSize
  vendors: SponsorVendorType[]
}

export type SponsorVendorType = {
  name: string
  darkModeImg?: string
  url: string
  img: string
}
