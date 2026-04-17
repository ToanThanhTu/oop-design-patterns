import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PropsWithChildren } from 'react'

interface ModalProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export default function Modal({ close, className, children }: PropsWithChildren<ModalProps>) {
  return (
    <div
      className="fixed inset-0 bg-blue-900/40 flex items-center justify-center z-50"
      onClick={() => close(false)}
    >
      <div
        className={cn('bg-white rounded-lg shadow-lg p-12 z-50 relative', className)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Button className="absolute top-4 right-4" onClick={() => close(false)} variant="ghost">
          X
        </Button>

        {children}
      </div>
    </div>
  )
}
