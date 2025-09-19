import type { TicketPriority, TicketStatus } from '@/enum/ticket.enum'
import type { AutocompleteOptionType } from '@/types/common.type'

export type TicketListsDTO = {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
}

export type TicketFormUpdate = {
  title: string
  description: string
  status: AutocompleteOptionType
  priority: AutocompleteOptionType
}
