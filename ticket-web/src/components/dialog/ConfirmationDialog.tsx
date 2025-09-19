import { ConfirmationDialogType } from '@/enum/dialog.enum'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState, type ReactNode } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: (status: boolean) => void
  textTitle?: string
  textContent?: ReactNode
  textConfirm?: string
  textCancel?: string
  isLoading?: boolean
  type?: ConfirmationDialogType
}

const ConfirmationDialog = ({
  open,
  onClose,
  textTitle,
  textContent,
  textConfirm,
  textCancel,
  isLoading = false,
  type = ConfirmationDialogType.Confirm,
}: Props) => {
  const [confirmVariant, setConfirmVariant] =
    useState<ButtonProps['variant']>('contained')
  const [confirmColor, setConfirmColor] =
    useState<ButtonProps['color']>('success')
  const [cancelVariant, setCancelVariant] =
    useState<ButtonProps['variant']>('outlined')
  const [cancelColor, setCancelColor] =
    useState<ButtonProps['color']>('secondary')

  useEffect(() => {
    switch (type) {
      case ConfirmationDialogType.Danger:
        setConfirmVariant('outlined')
        setConfirmColor('error')
        setCancelVariant('contained')
        setCancelColor('primary')
        break
      case ConfirmationDialogType.Discard:
        setConfirmVariant('outlined')
        setConfirmColor('secondary')
        setCancelVariant('contained')
        setCancelColor('primary')
        break
      default:
        setConfirmVariant('contained')
        setConfirmColor('success')
        setCancelVariant('outlined')
        setCancelColor('secondary')
    }
  }, [type])

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      closeAfterTransition={false}
      disableEscapeKeyDown
    >
      <DialogTitle className="!pb-2">
        {textTitle ?? 'คุณแน่ใจหรือไม่ที่ต้องการ ?'}
      </DialogTitle>

      <DialogContent
        className={cn('sm:pbs-16 sm:pbe-6 sm:pli-16 flex flex-col')}
      >
        {textContent ?? 'บันทึกข้อมูล !!'}
      </DialogContent>

      <DialogActions className="px-4 pb-4">
        <Button
          loading={isLoading}
          variant={confirmVariant}
          className="basis-[49%] sm:basis-25"
          size="small"
          color={confirmColor}
          onClick={() => onClose(true)}
        >
          {textConfirm ?? 'ยืนยัน'}
        </Button>
        <Button
          loading={isLoading}
          variant={cancelVariant}
          className="!ml-2 basis-[49%] sm:basis-25"
          size="small"
          color={cancelColor}
          onClick={() => onClose(false)}
        >
          {textCancel ?? 'ยกเลิก'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
