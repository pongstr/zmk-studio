import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearch } from 'wouter'

export type ModalDialogType = 'alert' | 'dialog' | 'prompt'
export type ModalDialogName = 'dialog:license' | 'dialog:about'
type ModalParamsType = Record<string, string | number | boolean>

export function useToggleModal(
  modal: ModalDialogType,
  name: ModalDialogName,
  params?: ModalParamsType,
) {
  const searchParams = useSearch()
  const [pathname, navigate] = useLocation()
  const query = useMemo(
    () => new URLSearchParams(['?', searchParams].join('')),
    [searchParams],
  )

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    const curr = new URLSearchParams(query)
    curr.set(modal, name)

    if (params && Object.keys(params)) {
      Object.keys(params).forEach((item) =>
        curr.set(item, String(params[item])),
      )
    }

    navigate([pathname, curr.toString()].join('?'))
  }

  const handleClose = () => {
    const curr = new URLSearchParams(query)
    curr.delete(modal, name)

    if (params && Object.keys(params)) {
      Object.keys(params).forEach((item) =>
        curr.delete(item, String(params[item])),
      )
    }

    navigate([pathname, curr.toString()].join('?'))
  }

  const handleOnOpenChange = (value: boolean) => {
    if (value) return

    const curr = new URLSearchParams(query)

    curr.delete(modal, name)

    if (params && Object.keys(params)) {
      Object.keys(params).forEach((item) => curr.delete(item))
    }

    navigate(pathname)
  }

  useEffect(() => {
    const isOpen = query.has(modal) && query.get(modal) === name

    if (isOpen) {
      setIsOpen(true)
      return
    }

    setIsOpen(false)
  }, [query, modal, name])
  return {
    isOpen,
    handleOpen,
    handleClose,
    handleOnOpenChange,
  }
}

export function useToggleDialog() {
  const searchParams = useSearch()
  const [pathname, navigate] = useLocation()
  const query = useMemo(
    () => new URLSearchParams(['?', searchParams].join('')),
    [searchParams],
  )

  const openDialog = (
    modal: ModalDialogType,
    name: ModalDialogName,
    params?: Record<string, string | number>,
  ) => {
    const curr = new URLSearchParams(Array.from(query.entries()))
    curr.set(modal, name)

    if (params && Object.keys(params)) {
      Object.keys(params).forEach((item) =>
        curr.set(item, String(params[item])),
      )
    }

    navigate([pathname, curr.toString()].join('?'), { replace: true })
  }

  return openDialog
}
