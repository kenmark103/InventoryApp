import { faker } from '@faker-js/faker'
import userService from '@/services/userService'

export const users = await userService.getAllUsers()

export const usersFaked = Array.from({ length: 5 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'Active',
      'Inactive',
      'Invited',
      'Suspended',
    ]),
    role: faker.helpers.arrayElement([
      'Superadmin',
      'Admin',
      'Cashier',
      'Manager',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
