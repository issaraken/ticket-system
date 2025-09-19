import { TicketPriority, TicketStatus } from '@/enum/ticket.enum'

export const TicketStatusOptions = [
  ...Object.values(TicketStatus).map((v) => ({
    value: v,
    label: v,
  })),
]

export const TicketPriorityOptions = [
  ...Object.values(TicketPriority).map((v) => ({
    value: v,
    label: v,
  })),
]
