import { ExternalLink as LinkIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

export interface ExternalLinkProps {
  href: string
}

export const ExternalLink = ({
  href,
  children,
}: PropsWithChildren<ExternalLinkProps>) => {
  return (
    <a
      className="inline-flex items-center justify-center gap-1 text-accent hover:underline"
      target="_new"
      href={href}
    >
      {children}
      <LinkIcon className="size-4" />
    </a>
  )
}
