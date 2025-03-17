import {
   IconBrowserCheck,
  IconChecklist,
  IconFileDatabase,
  IconGraph,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconLogs,
  IconMoneybag,
  IconNotification,
  IconPalette,
  IconReport,
  IconSettings,
  IconTool,
  IconUserCog,
 
} from '@tabler/icons-react'
import { AudioWaveform, Command, Edit2Icon, GalleryVerticalEnd, LockIcon, PanelsTopLeftIcon, ShoppingBagIcon, ShoppingCart, SquareDashedBottomIcon, StoreIcon, UserPlus2Icon, UsersIcon } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },

    {
      title: 'Shop',
      items:[
        {
          title: 'Sales',
          icon: ShoppingBagIcon,
          items: [
            {
              title: 'New Sale',
              url: '/401',
              icon: ShoppingCart,
            },
            {
              title: 'Sales Dashboard',
              url: '/401',
              icon: SquareDashedBottomIcon,
            }
          ],
          },
          {
            title: 'Inventory',
            icon: StoreIcon,
            items: [
              {
                title: 'Products',
                url: '/401',
                icon: Edit2Icon,
              },
              {
                title: 'Suppliers',
                url: '/401',
                icon: PanelsTopLeftIcon,
              }
            ],
            },
        {
          title: 'Expenses',
          icon: IconMoneybag,
          badge: '3',
          items:[
            {
              title: 'View Expenses',
              url: '/tasks',
              icon: IconChecklist,
            },
            {
              title: 'Approve Expenses',
              url: '/tasks',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Customers',
          url: '/chats',
          icon: UsersIcon,
        },
      ],

    },
    
    {
      title: 'User Management',
      items: [
        {
          title: 'Users',
          icon: UserPlus2Icon,
          url: "/users",
        },
        {
          title: 'Roles and Permissions',
          icon: LockIcon,
          url: "/",
        },      
      ],
      },
    {
      title: 'Reports',
      items: [
        {
          title: 'View Reports',
          icon: IconReport,
          items:[
            {
              title: 'Sales Reports',
              icon: IconGraph,
              url: "/tasks",
            },
            {
              title: 'Inventory Reports',
              icon: IconFileDatabase,
              url: "/tasks",
            },
          ],
        },
        {
          title: 'Financial Statements',
          icon: IconLockAccess,
          url: "/",
        },
        {
          title:'logs',
          icon: IconLogs,
          url:'/',
        },
      ],
      },
    {
      title: 'Other',
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
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
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
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
