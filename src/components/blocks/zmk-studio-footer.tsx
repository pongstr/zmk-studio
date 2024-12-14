import { FC } from 'react'

import { useToggleDialog } from '@/hooks/useToggleModal'
import { cn } from '@/lib/utils.ts'

const Content: FC = () => {
  const year = new Date().getFullYear()
  const openDialog = useToggleDialog()

  return (
    <>
      <span className="inline-block px-2">
        &copy; {year} The ZMK Contributors
      </span>
      <button
        className="inline-block px-2"
        onClick={() => openDialog('dialog', 'dialog:about')}
      >
        about ZMK Studio
      </button>
      <button className="inline-block px-2">License Notice</button>
    </>
  )
}

export const ZmkStudioFooter: FC<{ className?: string; asChild?: boolean }> = ({
  className,
  asChild = false,
}) => {
  if (asChild) {
    return <Content />
  }

  return (
    <footer
      className={cn(
        'w-full divide-x text-center text-xs opacity-40 py-2',
        className,
      )}
    >
      <Content />
    </footer>
  )
}
