import type { Dispatch, SetStateAction } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { DialogOverlay } from "./dialog"
import { cn } from "@/lib/utils"

export default function Modal({
  children,
  showModal,
  setShowModal,
  onClose,
  preventDefaultClose,
  className,
}: {
  children: React.ReactNode
  className?: string
  showModal?: boolean
  setShowModal?: Dispatch<SetStateAction<boolean>>
  onClose?: () => void
  preventDefaultClose?: boolean
}) {

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) return

    onClose?.() 

    if (setShowModal) {
      setShowModal(false) 
    } 
  }

  return (
    <Dialog.Root
      open={!!showModal} 
      onOpenChange={(open) => {
        if (!open) closeModal({ dragged: true })
      }}
    >
      <DialogOverlay className="z-[60]"/>
      <Dialog.Content 
        className={cn(
          "fixed left-[50%] z-[60] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
          className 
        )}
        aria-label="Modal"
      >
        {children}

        <Dialog.Close 
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  )
}
