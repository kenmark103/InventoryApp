import {
  IconChecklist,
  IconGraph,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLogs,
  IconMoneybag,
  IconNotification,
  IconPalette,
  IconReport,
  IconSettings,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { 
  Activity,
  Bookmark,
  Box,
  Briefcase,
  CheckCircle,
  Command,
  CreditCard,
  FileText,
  LayoutGrid,
  List,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Warehouse
} from 'lucide-react'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  shopHeader: {
    name: 'Inventory System',
    logo: Command,
    subtitle: 'Easy Sell',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,  // Good choice
          badge: '2',
        },
      ],
    },
    {
      title: 'Shop Management',
      items: [
        {
          title: 'Sales',
          icon: ShoppingCart,  // More direct association
          items: [
            {
              title: 'New Sale',
              url: '/sales',
              icon: CreditCard,  // Represents transactions
            },
            {
              title: 'Sales Order',
              url: '/sales/salesorders',
              icon: Activity,  // Better for analytics
            }
          ],
        },
        {
          title: 'Inventory',
          icon: Warehouse,  // More accurate representation
          items: [
            {
              title: 'Products',
              url: '/products',
              icon: Package,  // Direct product association
            },
            {
              title: 'Categories',
              url: '/categories',
              icon: Tag,  // Standard for categorization
            },
            {
              title: 'Stock',
              url: '/products/stock-management',
              icon: Box,  // Represents physical stock
            },
            {
              title: 'Purchases',
              url: '/purchase',
              icon: Box,  // Represents physical stock
            },
          ],
        },
        {
          title: 'Expenses',
          icon: IconMoneybag,  // Good choice
          items: [
            {
              title: 'View Expenses',
              url: '/expenses',
              icon: FileText,  // Document view
            },
            {
              title: 'Approve Expenses',
              url: '/expenses/approve',
              icon: CheckCircle,  // Approval action
            },
          ],
        },
        {
          title: 'Customers',
          url: '/customers',
          icon: Users,  // Lucide's users
        },
        {
          title: 'Suppliers',
          url: '/suppliers',
          icon: Briefcase,  // Business relationship
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Users',
          icon: IconUsers,  // Tabler's users
          url: "/users",
        },
        {
          title: 'Roles',
          icon: IconLock,  // Security focus
          items: [
            {
              title: 'Permissions',
              url: "/permissions",
              icon: Bookmark,  // Access markers
            },
            {
              title: 'Audit Logs',
              url: "/logs",
              icon: List,  // List view
            }
          ]
        },      
      ],
    },
    {
      title: 'Analytics',
      items: [
        {
          title: 'Reports',
          icon: IconReport,
          items: [
            {
              title: 'Accounting',
              icon: IconGraph,
              url: "/reports",
            },
            {
              title: 'Sales',
              icon: IconGraph,
              url: "/reports/sales-report",
            },
            {
              title: 'Inventory',
              icon: LayoutGrid, 
              url: "/reports/inventory",
            },
            {
              title: 'Expenses',
              icon: FileText,  
              url: "/reports/expenses",
            },
          ],
        },
        {
          title: 'Live Metrics',
          icon: Activity,  // Better activity representation
          url: '/metrics',
          badge: 'Beta',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Help',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}