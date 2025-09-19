import { blue, grey } from '@mui/material/colors'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import NoDataOverlay from './skeleton/NoDataOverlay'
import type { DataGridProps } from '@mui/x-data-grid'

export const defaultInitialState = {
  pagination: {
    paginationModel: { page: 0, pageSize: 10 },
  },
}

export const defaultPageSizeOptions = [5, 10, 20]

const hoverStyle = {
  '.MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',
  },
}

const TableComponent = ({
  rows,
  columns,
  sx,
  enableRowHover = false,
  ...props
}: DataGridProps & { enableRowHover?: boolean }) => {
  return (
    <div className="flex flex-col">
      <DataGrid
        rows={rows ?? []}
        columns={columns ?? []}
        initialState={defaultInitialState}
        pageSizeOptions={defaultPageSizeOptions}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        disableColumnFilter={true}
        density="compact"
        slots={{ noRowsOverlay: NoDataOverlay }}
        {...props}
        sx={{
          backgroundColor: grey[50],
          borderWidth: 'unset',
          borderStyle: 'unset',
          borderRadius: 'unset',
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: 'normal',
            textAlign: 'center',
            fontWeight: 800,
          },
          '& .MuiDataGrid-columnHeaders': {
            maxHeight: '168px !important',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: blue[50],
            borderRadius: 'unset !important',
            // height: 'unset !important',
          },
          '--DataGrid-overlayHeight': '300px',
          ...(enableRowHover ? hoverStyle : {}),
          ...sx,
        }}
      />
    </div>
  )
}

export default TableComponent
