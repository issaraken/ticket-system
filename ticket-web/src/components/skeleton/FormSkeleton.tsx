import Skeleton from '@mui/material/Skeleton'

const FormSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-4 sm:items-center">
        <div className="flex items-center gap-0">
          <Skeleton
            variant="text"
            width={200}
            height={36}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow">
        <Skeleton variant="rectangular" width="50%" height={36} />
        <Skeleton variant="rectangular" width="100%" height={150} />
        <Skeleton variant="rectangular" width="49%" height={36} />
        <Skeleton variant="rectangular" width="49%" height={36} />
      </div>
    </div>
  )
}

export default FormSkeleton
