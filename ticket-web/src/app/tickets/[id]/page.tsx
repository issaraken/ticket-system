'use client'
import { TicketPriorityOptions, TicketStatusOptions } from '@/data/ticket.data'
import { TicketPriority, TicketStatus } from '@/enum/ticket.enum'
import axiosInstance from '@/lib/axios'
import { DefaultResponse } from '@/types/response.type'
import { TicketListsDTO } from '@/types/ticket.type'
import FormSkeleton from '@components/skeleton/FormSkeleton'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import ConfirmationDialog from '@components/dialog/ConfirmationDialog'

const ticketSchema = z.object({
  title: z
    .string()
    .min(5, 'กรุณากรอกหัวข้ออย่างน้อย 5 ตัวอักษร')
    .max(200, 'หัวข้อต้องไม่เกิน 200 ตัวอักษร'),
  description: z
    .string()
    .min(10, 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(5000, 'รายละเอียดต้องไม่เกิน 1000 ตัวอักษร'),
  status: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { message: 'กรุณาเลือกสถานะ' }
  ),
  priority: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { message: 'กรุณาเลือกระดับความสำคัญ' }
  ),
})

type TicketFormData = z.infer<typeof ticketSchema>

type Props = {
  params: Promise<{ id: string }>
}

const TicketUpdatePage = ({ params }: Props) => {
  const { id } = use(params)
  const router = useRouter()
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false)
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id === 'create') {
      setIsLoadingData(false)
      return
    }

    fetchTicketDetail()
    setIsUpdateMode(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchTicketDetail = () => {
    axiosInstance
      .get<DefaultResponse<TicketListsDTO>>(`/tickets/${id}`)
      .then((response) => {
        const result = response.data.data
        setValue('title', result.title || '')
        setValue('description', result.description || '')
        setValue('status', {
          value: result.status,
          label: result.status,
        })
        setValue('priority', {
          value: result.priority,
          label: result.priority,
        })
        trigger()
      })
      .catch(() => router.push('/tickets'))
      .finally(() => setIsLoadingData(false))
  }

  const {
    setValue,
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: {
        value: TicketStatus.OPEN,
        label: TicketStatus.OPEN,
      },
      priority: {
        value: TicketPriority.MEDIUM,
        label: TicketPriority.MEDIUM,
      },
    },
  })

  const onConfirmSave = async (status: boolean) => {
    if (!status) {
      setIsOpenConfirmDialog(false)
      return
    }

    setIsLoading(true)
    try {
      const data = getValues()
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status.value,
        priority: data.priority.value,
      }

      await (isUpdateMode
        ? axiosInstance.patch(`/tickets/${id}`, payload)
        : axiosInstance.post('/tickets', payload))

      toast.success('บันทึกข้อมูลสำเร็จ !!')
      router.push('/tickets')
    } catch (error) {
      console.error('Error saving ticket:', error)
    } finally {
      setIsLoading(false)
      setIsOpenConfirmDialog(false)
    }
  }

  if (isLoadingData) return <FormSkeleton />
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-0">
          <IconButton onClick={() => router.push('/tickets')}>
            <ArrowBackIosNew />
          </IconButton>

          <Typography variant="h4">
            {isUpdateMode ? 'แก้ไข Ticket' : 'เพิ่ม Ticket'}
          </Typography>
        </div>

        <form onSubmit={handleSubmit(() => setIsOpenConfirmDialog(true))}>
          <Card>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-[49%]">
                  <TextField
                    label="Title*"
                    variant="outlined"
                    size="small"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    {...register('title')}
                    error={!!errors?.title}
                    helperText={errors.title?.message}
                  />
                </div>

                <TextField
                  label="Description*"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={5}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('description')}
                  error={!!errors?.description}
                  helperText={errors.description?.message}
                />

                <div className="w-full md:w-[49%]">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { value, onChange, ...field } }) => (
                      <Autocomplete
                        size="small"
                        options={TicketStatusOptions ?? []}
                        value={value}
                        getOptionLabel={(option) => option?.label ?? ''}
                        getOptionKey={(option) => option?.value ?? ''}
                        onChange={(_, value) => onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Status*"
                            error={!!errors.status}
                            helperText={errors.status?.message}
                            slotProps={{
                              inputLabel: { shrink: true },
                            }}
                          />
                        )}
                        disableClearable
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="w-full md:w-[49%]">
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field: { value, onChange, ...field } }) => (
                      <Autocomplete
                        size="small"
                        options={TicketPriorityOptions ?? []}
                        value={value}
                        getOptionLabel={(option) => option?.label ?? ''}
                        getOptionKey={(option) => option?.value ?? ''}
                        onChange={(_, value) => onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Priority*"
                            error={!!errors.priority}
                            helperText={errors.priority?.message}
                            slotProps={{
                              inputLabel: { shrink: true },
                            }}
                          />
                        )}
                        disableClearable
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>

            <CardActions className="float-right px-4 pb-4">
              <Button
                type="submit"
                size="small"
                variant="contained"
                className="w-full! md:w-50!"
                color="success"
                loading={isLoading}
                disabled={!isValid || isLoading}
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>

      <ConfirmationDialog
        open={isOpenConfirmDialog}
        textTitle={isUpdateMode ? 'ยืนยันการแก้ไข' : 'ยืนยันการสร้าง'}
        textContent={`คุณต้องการ${isUpdateMode ? 'แก้ไข' : 'สร้าง'}ข้อมูล Ticket นี้ใช่หรือไม่?`}
        onClose={onConfirmSave}
        isLoading={isLoading}
      />
    </>
  )
}

export default TicketUpdatePage
