import Modal from '@/shared/components/modal/Modal'
import { Button } from '@/shared/components/ui/button'

interface ConfirmModalProps {
  cancelLabel?: string
  close: () => void
  confirmLabel?: string
  isPending?: boolean
  message: string
  onConfirm: () => void
  title: string
  variant?: 'default' | 'destructive'
}

export default function ConfirmModal({
  cancelLabel = 'Cancel',
  close,
  confirmLabel = 'Confirm',
  isPending = false,
  message,
  onConfirm,
  title,
  variant = 'destructive',
}: ConfirmModalProps) {
  return (
    <Modal close={() => close()} className="w-96 max-w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
