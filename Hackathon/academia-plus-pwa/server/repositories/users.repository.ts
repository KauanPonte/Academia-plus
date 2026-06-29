import type { User } from '../entities/user.entity.js'
import { readDatabase, writeDatabase } from '../database/json-database.js'

export const usersRepository = {
  findAll(): User[] {
    return readDatabase().users
  },

  findById(id: string): User | null {
    return readDatabase().users.find((user) => user.id === id) ?? null
  },

  findByEmail(email: string): User | null {
    return readDatabase().users.find((user) => user.email === email.trim().toLowerCase()) ?? null
  },

  create(user: User): User {
    const database = readDatabase()
    database.users.push(user)
    writeDatabase(database)

    return user
  },

  update(userId: string, data: Partial<User>): User | null {
    const database = readDatabase()
    const index = database.users.findIndex((user) => user.id === userId)

    if (index < 0) {
      return null
    }

    database.users[index] = {
      ...database.users[index],
      ...data,
      id: database.users[index].id,
      email: database.users[index].email,
      password: database.users[index].password,
      role: database.users[index].role,
    }
    writeDatabase(database)

    return database.users[index]
  },

  search(term: string): User[] {
    const normalizedTerm = term.trim().toLowerCase()

    if (!normalizedTerm) {
      return []
    }

    return readDatabase().users.filter((user) =>
      [user.name, user.email, user.course, user.institution]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedTerm),
    )
  },
}
