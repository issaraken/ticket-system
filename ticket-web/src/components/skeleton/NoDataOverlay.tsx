import { cn } from '@/lib/utils'
import NoData from '@/svg/NoData'

type Props = {
  className?: string
}

const NoDataOverlay = ({ className = '' }: Props) => {
  return (
    <div
      className={cn('flex items-center justify-center px-5 py-18', className)}
    >
      <NoData className="text-[150px]" />
    </div>
  )
}

export default NoDataOverlay
