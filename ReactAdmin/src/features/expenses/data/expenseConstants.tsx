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

export const expenseStatuses = [
  {
    value: 'Pending',
    label: 'Pending',
    icon: IconExclamationCircle,
    color: 'text-yellow-500',
  },
  {
    value: 'Submitted',
    label: 'Submitted',
    icon: IconCircle,
    color: 'text-blue-500',
  },
  {
    value: 'Approved',
    label: 'Approved',
    icon: IconCircleCheck,
    color: 'text-green-600',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    icon: IconCircleX,
    color: 'text-red-600',
  },
  {
    value: 'Paid',
    label: 'Paid',
    icon: IconCircleCheck,
    color: 'text-purple-600',
  },
];

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


export const statusIcons = {
    pending: IconExclamationCircle,
    submitted: IconExclamationCircle,
    approved: IconCircleCheck,
    rejected: IconCircleX,
    paid: IconCircleCheck
  };

export const priorityIcons = {
    low: IconArrowDown,
    medium: IconArrowRight,
    high: IconArrowUp
  };
