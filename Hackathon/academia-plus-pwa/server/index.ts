import express from 'express'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { loggerMiddleware } from './middlewares/logger.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { authRouter } from './routes/auth.routes.js'
import { ordersRouter } from './routes/orders.routes.js'
import { categoryRouter } from './routes/category.routes.js'
import { productsRouter } from './routes/products.routes.js'
import { usersRouter } from './routes/users.routes.js'
import { postsRouter } from './routes/posts.routes.js'
import { followsRouter } from './routes/follows.routes.js'
import { notificationsRouter } from './routes/notifications.routes.js'

const app = express()
const port = process.env.PORT ?? 3000
const distDir = path.join(process.cwd(), 'dist')
const distIndex = path.join(distDir, 'index.html')
const apiPrefixes = ['/auth', '/category', '/categories', '/products', '/orders', '/users', '/posts', '/follows', '/notifications']

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  if (_req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})
app.use(express.json())
app.use(loggerMiddleware)

app.use('/auth', authRouter)
app.use('/category', categoryRouter)
app.use('/categories', categoryRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/follows', followsRouter)
app.use('/notifications', notificationsRouter)

if (existsSync(distIndex)) {
  app.use(express.static(distDir))

  app.use((req, res, next) => {
    if (req.method !== 'GET' || apiPrefixes.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`))) {
      next()
      return
    }

    res.sendFile(distIndex)
  })
} else {
  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'API Academia+ rodando. Gere o PWA com npm run build para servir as telas nesta porta.',
      resources: ['auth', 'users', 'posts', 'follows', 'notifications'],
    })
  })
}

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
