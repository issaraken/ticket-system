'use client'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import { GridColDef } from '@mui/x-data-grid'
import TableComponent from '@components/TableComponent'
import { useEffect, useState } from 'react'
import TableSkeleton from '@components/skeleton/TableSkeleton'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import axiosInstance from '@/lib/axios'
import { TicketListsDTO } from '@/types/ticket.type'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { TicketPriorityOptions, TicketStatusOptions } from '@/data/ticket.data'
import IconButton from '@mui/material/IconButton'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import type { PerPageResponse } from '@/types/response.type'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import type { AutocompleteOptionType } from '@/types/common.type'
import Delete from '@mui/icons-material/Delete'
import ConfirmationDialog from '@components/dialog/ConfirmationDialog'
import { ConfirmationDialogType } from '@/enum/dialog.enum'
import { toast } from 'sonner'

const TicketsPage = () => {
  const router = useRouter()
  const [isLoadingLayout, setIsLoadingLayout] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ticketLists, setTicketLists] = useState<TicketListsDTO[]>([])
  const [searchTxt, setSearchTxt] = useState<string>('')
  const [status, setStatus] = useState<AutocompleteOptionType | null>(null)
  const [priority, setPriority] = useState<AutocompleteOptionType | null>(null)
  const [pagination, setPagination] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  })
  const [sorting, setSorting] = useState<GridSortModel>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const getTicketParams = () => {
    const params = new URLSearchParams()
    params.append('page', (pagination.page + 1).toString()) // MUI DataGrid เริ่มจาก 0 แต่ API อาจเริ่มจาก 1
    params.append('pageSize', pagination.pageSize.toString())
    if (sorting.length > 0) {
      params.append('sortBy', sorting[0].field)
      params.append('sortOrder', sorting[0].sort?.toUpperCase() || 'ASC')
    }
    if (searchTxt) params.append('search', searchTxt)
    if (status?.value) params.append('status', status?.value ?? '')
    if (priority?.value) params.append('priority', priority?.value ?? '')

    return params
  }

  const fetchTickets = () => {
    setIsLoading(true)
    const params = getTicketParams()
    axiosInstance
      .get<PerPageResponse<TicketListsDTO[]>>(`/tickets?${params.toString()}`)
      .then((response) => {
        const result = response.data.data
        setTicketLists(result?.data ?? [])
        setRowCount(result?.pagination?.total ?? 0)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchTickets()
    setIsLoadingLayout(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 130,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: 'จัดการ',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <div className="flex w-full justify-center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/tickets/${params.id}`)
            }}
            size="small"
          >
            <ModeEditOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => onDelete(params.id as number)}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ]

  useEffect(() => {
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting])

  const onClearFilter = () => {
    setSearchTxt('')
    setStatus(null)
    setPriority(null)
  }

  const onDelete = (id: number) => {
    setDeleteId(id)
    setIsOpenDialog(true)
  }

  const onConfirmDelete = (status: boolean) => {
    if (!status) return setIsOpenDialog(false)

    setIsDialogLoading(true)
    axiosInstance
      .delete(`/tickets/${deleteId}`)
      .then(() => {
        fetchTickets()
        toast.success('ลบข้อมูลสำเร็จ !!')
      })
      .finally(() => {
        setIsDialogLoading(false)
        setIsOpenDialog(false)
      })
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold">Tickets</span>
          <Button
            variant="contained"
            onClick={() => router.push('/tickets/create')}
          >
            เพิ่ม ticket
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-col gap-2 md:flex-row">
                <TextField
                  label="title / description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTxt}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  onChange={(e) => setSearchTxt(e.target.value)}
                  className="w-full! sm:w-1/3!"
                />

                <Autocomplete
                  size="small"
                  fullWidth
                  options={TicketStatusOptions ?? []}
                  value={status}
                  onChange={(_, newValue) => setStatus(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                  className="w-full! sm:w-1/3!"
                />

                <Autocomplete
                  size="small"
                  fullWidth
                  options={TicketPriorityOptions ?? []}
                  value={priority}
                  onChange={(_, newValue) => setPriority(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Priority"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                  className="w-full! sm:w-1/3!"
                />
              </div>

              <div className="flex flex-row items-center justify-end gap-2 sm:flex-row">
                <Button
                  size="small"
                  variant="contained"
                  className="w-1/2! sm:w-24!"
                  onClick={fetchTickets}
                  loading={isLoading}
                >
                  ค้นหา
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={onClearFilter}
                  className="w-1/2! sm:w-24!"
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          </CardContent>

          {isLoadingLayout ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <TableComponent
              rows={ticketLists}
              columns={columns}
              loading={isLoading}
              paginationMode={'server'}
              paginationModel={pagination}
              onPaginationModelChange={(model) => setPagination(model)}
              rowCount={rowCount}
              sortingMode="server"
              sortModel={sorting}
              onSortModelChange={setSorting}
              onRowClick={(params) => {
                console.log('Row clicked:', params.row)
                // router.push(`/tickets/${params.id}`)
              }}
            />
          )}
        </Card>
      </div>

      <ConfirmationDialog
        open={isOpenDialog}
        onClose={onConfirmDelete}
        isLoading={isDialogLoading}
        textContent="ลบข้อมูลที่อยู่ !!"
        type={ConfirmationDialogType.Danger}
      />
    </>
  )
}

export default TicketsPage
