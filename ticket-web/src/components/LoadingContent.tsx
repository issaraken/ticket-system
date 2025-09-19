import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const LoadingContent = () => {
  return (
    <div className="bs-full flex items-center justify-center gap-2">
      <CircularProgress size="1rem" color="inherit" />
      <Typography variant="subtitle1">{`Loading...`}</Typography>
    </div>
  )
}

export default LoadingContent
