import { Toaster } from 'sonner'

const Toastify = () => {
  return (
    <Toaster
      position="bottom-center"
      richColors
      closeButton
      toastOptions={{
        duration: 5000,
      }}
    />
  )
}

export default Toastify
