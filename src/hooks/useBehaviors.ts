import { Request } from '@zmkfirmware/zmk-studio-ts-client'
import type { GetBehaviorDetailsResponse } from '@zmkfirmware/zmk-studio-ts-client/behaviors'
import { LockState } from '@zmkfirmware/zmk-studio-ts-client/core'
import { useEffect, useState } from 'react'

import { useConnectionContext } from '@/components/providers/rpc-connect/useConnectionContext.tsx'
import { useLockState } from '@/components/providers/rpc-lock-state/useLockState.ts'
import { call_rpc } from '@/lib/logging.ts'
import { BehaviorMap } from '@/types.ts'

export function useBehaviors(): BehaviorMap {
  const { conn } = useConnectionContext()
  const lockState = useLockState()

  const [behaviors, setBehaviors] = useState<BehaviorMap>({})

  useEffect(() => {
    if (!conn || lockState != LockState.ZMK_STUDIO_CORE_LOCK_STATE_UNLOCKED) {
      setBehaviors({})
      return
    }

    async function startRequest() {
      setBehaviors({})

      if (!conn) {
        return
      }

      const get_behaviors: Request = {
        behaviors: { listAllBehaviors: true },
        requestId: 0,
      }

      const behavior_list = await call_rpc(conn, get_behaviors)
      if (!ignore) {
        const behavior_map: BehaviorMap = {}
        for (const behaviorId of behavior_list.behaviors?.listAllBehaviors
          ?.behaviors || []) {
          if (ignore) {
            break
          }
          const details_req = {
            behaviors: { getBehaviorDetails: { behaviorId } },
            requestId: 0,
          }
          const behavior_details = await call_rpc(conn, details_req)
          const dets: GetBehaviorDetailsResponse | undefined =
            behavior_details?.behaviors?.getBehaviorDetails

          if (dets) {
            behavior_map[dets.id] = dets
          }
        }

        if (!ignore) {
          setBehaviors(behavior_map)
        }
      }
    }

    let ignore = false
    startRequest().then(console.info).catch(console.error)
    return () => {
      ignore = true
    }
  }, [conn, lockState])

  return behaviors
}
