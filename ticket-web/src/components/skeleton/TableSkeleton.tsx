import { Skeleton } from '@mui/material'

type Props = { rows: number; columns: number }

const TableRowsLoader = ({ columns }: { columns: number }) => {
  return [...Array(columns)].map((_, index) => (
    <Skeleton key={index} sx={{ flexGrow: 1 }} height={24} />
  ))
}

const TableSkeleton = ({ rows, columns }: Props) => {
  return (
    <div className="px-4">
      {[...Array(rows)].map((_, index) => (
        <div
          className="flex grow gap-4 border-b border-gray-200 py-2 last:border-b-0"
          key={index}
        >
          <TableRowsLoader columns={columns} />
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
