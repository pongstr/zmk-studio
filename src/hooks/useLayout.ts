import { call_rpc } from '@zmkfirmware/zmk-studio-ts-client'
import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import { PhysicalLayout } from '@zmkfirmware/zmk-studio-ts-client/keymap'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import { useLockState } from '@/components/providers/rpc-lock-state/useLockState.ts'

type UseLayoutsReturnType = [
  PhysicalLayout[],
  Dispatch<SetStateAction<PhysicalLayout[]>>,
  number,
  Dispatch<SetStateAction<number>>,
]

export function useLayouts(): UseLayoutsReturnType {
  const { conn } = useConnectionContext()
  const lockState = useLockState()

  const [layouts, setLayouts] = useState<PhysicalLayout[]>([])
  const [selectedPhysicalLayoutIndex, setSelectedPhysicalLayoutIndex] =
    useState<number>(0)

  useEffect(() => {
    if (!conn || lockState != LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED) {
      setLayouts([])
      return
    }

    async function startRequest() {
      setLayouts([])

      if (!conn) {
        return
      }

      const response = await call_rpc(conn, {
        keymap: { getPhysicalLayouts: true },
      })

      if (!ignore) {
        setLayouts(response?.keymap?.getPhysicalLayouts?.layouts ?? [])
        setSelectedPhysicalLayoutIndex(
          response?.keymap?.getPhysicalLayouts?.activeLayoutIndex ?? 0,
        )
      }
    }

    let ignore = false
    startRequest().then(console.info).catch(console.error)
    return () => {
      ignore = true
    }
  }, [conn, lockState])

  return [
    layouts,
    setLayouts,
    selectedPhysicalLayoutIndex,
    setSelectedPhysicalLayoutIndex,
  ]
}
