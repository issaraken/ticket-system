import { DefaultResponse } from '@/types/response.type'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const handleErrorMessage = async (error: AxiosError): Promise<string> => {
  const errorResponse = (error?.response?.data as DefaultResponse) ?? {}
  let errorResponseMessage = errorResponse.message

  if (
    error?.request?.responseType === 'blob' &&
    error?.response?.data instanceof Blob &&
    error?.response?.data?.type &&
    error?.response?.data?.type.toLowerCase().indexOf('json') != -1
  ) {
    const errorJson = JSON.parse(await error?.response?.data.text())
    errorResponseMessage = errorJson?.message
  }

  const errorMessage = Array.isArray(errorResponseMessage)
    ? errorResponseMessage.join(', ')
    : errorResponseMessage
  return errorMessage || error.message
}

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const errorMessage = await handleErrorMessage(error)
    console.error(error)
    toast.error(errorMessage)
    return Promise.reject(error)
  }
)

export default axiosInstance
