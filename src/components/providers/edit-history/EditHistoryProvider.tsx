import { FC, PropsWithChildren, useMemo, useState } from 'react'

import { DoCallback, UndoCallback } from '@/types'

import { EditHistoryContext } from './EditHistoryContext'

export const EditHistoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [locked, setLocked] = useState<boolean>(false)
  const [undoStack, setUndoStack] = useState<Array<[DoCallback, UndoCallback]>>(
    [],
  )
  const [redoStack, setRedoStack] = useState<Array<DoCallback>>([])

  const canUndo = useMemo(
    () => !locked && undoStack.length > 0,
    [locked, undoStack],
  )
  const canRedo = useMemo(
    () => !locked && redoStack.length > 0,
    [locked, redoStack],
  )

  const doIt = async (doCb: DoCallback, preserveRedo?: boolean) => {
    setLocked(true)
    const undo = await doCb()

    setUndoStack([[doCb, undo], ...undoStack])
    if (!preserveRedo) {
      setRedoStack([])
    }
    setLocked(false)
  }

  const undo = async () => {
    if (locked) {
      throw new Error('undo invoked when existing operation in progress')
    }

    if (undoStack.length === 0) {
      throw new Error('undo invoked with no operations to undo')
    }

    setLocked(true)
    const [doCb, undoCb] = undoStack[0]
    setUndoStack(undoStack.slice(1))
    setRedoStack([doCb, ...redoStack])

    await undoCb()

    setLocked(false)
  }

  const redo = async () => {
    if (locked) {
      throw new Error('redo invoked when existing operation in progress')
    }

    if (redoStack.length === 0) {
      throw new Error('redo invoked with no operations to redo')
    }

    const doCb = redoStack[0]

    setRedoStack(redoStack.slice(1))

    return await doIt(doCb, true)
  }

  const reset = () => {
    setRedoStack([])
    setUndoStack([])
  }

  return (
    <EditHistoryContext.Provider
      value={{ doIt, undo, redo, canUndo, canRedo, reset }}
    >
      {children}
    </EditHistoryContext.Provider>
  )
}
