// src/components/customers-row-actions.tsx
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { useCustomers } from '../context/customers-context'
import { Customer } from '../data/customerSchema'
import { useNavigate } from '@tanstack/react-router' // or your router hook
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-react'

interface CustomersRowActionsProps {
  row: Row<Customer>
}

export function CustomersRowActions({ row }: CustomersRowActionsProps) {
  const { setOpen, setCurrentCustomer } = useCustomers()
  const navigate = useNavigate() // if you plan to navigate for "View" action

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => {
            // For view action, navigate to a detailed view page
            setCurrentCustomer(row.original)
            navigate({ to: `/customers/${row.original.id}` },)
          }}
          className='!text-green-800'
        >
          View
          <DropdownMenuShortcut>
              <IconUser size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentCustomer(row.original)
            setOpen('edit')
          }}
        >
          Edit
          <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentCustomer(row.original)
            setOpen('delete')
          }}
          className='!text-red-500'
          >
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
