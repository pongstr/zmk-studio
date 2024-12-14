import { TooltipContentProps } from '@radix-ui/react-tooltip'
import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const ButtonWithToolTip: React.FC<
  React.PropsWithChildren<{
    text: string
    tooltipContentProps?: TooltipContentProps
  }>
> = ({ text, children, tooltipContentProps }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...tooltipContentProps}>
        <span className="text-xs capitalize">{text}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
