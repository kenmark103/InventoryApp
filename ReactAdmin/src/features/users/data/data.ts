import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['Active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['Inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['Invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'Suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'Superadmin',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'Admin',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'Manager',
    icon: IconUsersGroup,
  },
  {
    label: 'Cashier',
    value: 'Cashier',
    icon: IconCash,
  },
] as const
