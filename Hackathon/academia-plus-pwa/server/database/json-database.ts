import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { users as seedUsers } from '../data/users.js'
import type { Comment } from '../entities/comment.entity.js'
import type { Follow } from '../entities/follow.entity.js'
import type { Like } from '../entities/like.entity.js'
import type { Post } from '../entities/post.entity.js'
import type { User } from '../entities/user.entity.js'

interface Database {
  users: User[]
  posts: Post[]
  comments: Comment[]
  likes: Like[]
  follows: Follow[]
}

const currentFile = fileURLToPath(import.meta.url)
const databasePath = resolve(dirname(currentFile), 'app-db.json')

const initialDatabase: Database = {
  users: seedUsers.map((user) => ({
    ...user,
    course: user.email === 'user@teste.com' ? 'Engenharia de Software' : 'Administracao',
    institution: user.email === 'user@teste.com' ? 'IFCE' : 'Academia+',
    bio: user.email === 'user@teste.com' ? 'Estudante verificando oportunidades e materiais.' : 'Gestao da plataforma.',
    createdAt: new Date().toISOString(),
  })),
  posts: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      authorId: '44444444-4444-4444-8444-444444444444',
      content: 'Alguem tem resumo de Banco de Dados para revisar normalizacao?',
      type: 'question',
      createdAt: new Date().toISOString(),
    },
  ],
  comments: [],
  likes: [],
  follows: [],
}

function ensureDatabase(): void {
  if (existsSync(databasePath)) {
    return
  }

  mkdirSync(dirname(databasePath), { recursive: true })
  writeFileSync(databasePath, JSON.stringify(initialDatabase, null, 2))
}

export function readDatabase(): Database {
  ensureDatabase()

  return JSON.parse(readFileSync(databasePath, 'utf-8')) as Database
}

export function writeDatabase(database: Database): void {
  writeFileSync(databasePath, JSON.stringify(database, null, 2))
}

