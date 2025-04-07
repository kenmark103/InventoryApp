import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
} from '@tabler/icons-react';

// Expense Types (formerly labels)
export const expenseTypes = [
  {
    value: 'travel',
    label: 'Travel',
  },
  {
    value: 'office_supplies',
    label: 'Office Supplies',
  },
  {
    value: 'entertainment',
    label: 'Entertainment',
  },
  {
    value: 'utilities',
    label: 'Utilities',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

// Expense Statuses
export const expenseStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: IconExclamationCircle,
  },
  {
    value: 'submitted',
    label: 'Submitted',
    icon: IconCircle,
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: IconCircleCheck,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: IconCircleX,
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: IconArrowRight,
  },
];

// Expense Priorities
export const expensePriorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
];
