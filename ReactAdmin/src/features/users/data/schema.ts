import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('Active'),
  z.literal('Inactive'),
  z.literal('Invited'),
  z.literal('Suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('Superadmin'),
  z.literal('Admin'),
  z.literal('Cashier'),
  z.literal('Manager'),
])

export const userSchema = z.object({
  id: z.coerce.number(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}).passthrough();

export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
