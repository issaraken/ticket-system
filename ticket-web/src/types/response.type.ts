export type DefaultResponse<T = null> = {
  statusCode: number
  message: string
  timestamp: string
  data: T
}

export type PerPageResponse<T = []> = DefaultResponse<{
  data: T
  pagination: DefaultPaginationResponse
}>

export type DefaultPaginationResponse = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
