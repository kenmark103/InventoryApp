import React, { createContext, useContext, useState, useEffect } from 'react'
import userService from '@/services/userService'
import useDialogState from '@/hooks/use-dialog-state'
import { User } from '../data/schema'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UsersContextType {
  // Dialog state for opening modals and tracking the current user row
  open: UsersDialogType | null
  setOpen: (val: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>

  // User list state for storing and refreshing the list of users
  users: User[]
  refreshUsers: () => Promise<void>
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export default function UsersProvider({ children }: { children: React.ReactNode }) {
  // Dialog state (for modals, editing, etc.)
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  // User list state (fetched from the backend)
  const [users, setUsers] = useState<User[]>([])

  const refreshUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
      // eslint-disable-next-line no-console
      console.log('Fetched users:', data) 
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch users', error)
    }
  }

  // Fetch the list of users when the provider mounts.
  useEffect(() => {
    refreshUsers()
  }, [])

  const value: UsersContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    users,
    refreshUsers,
  }

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}
