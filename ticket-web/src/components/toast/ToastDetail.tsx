import Typography from '@mui/material/Typography'

const ToastDetail = (title: string, description?: string) => {
  return (
    <div>
      <Typography variant="h6">{title}</Typography>
      {description ? (
        <Typography variant="body1">{description}</Typography>
      ) : null}
    </div>
  )
}

export default ToastDetail
