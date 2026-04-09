import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PropsWithChildren } from 'react'

interface ModalProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export default function Modal({ close, className, children }: PropsWithChildren<ModalProps>) {
  return (
    <div className={cn('fixed top-1/3 left-1/2 shadow-md p-12', className)}>
      <Button className="absolute top-4 right-4" onClick={() => close(false)} variant="ghost">
        X
      </Button>

      {children}
    </div>
  )
}
