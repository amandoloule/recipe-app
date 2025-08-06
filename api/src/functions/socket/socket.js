import { createServer } from 'http'
import { Server } from 'socket.io'
import { logger } from 'src/lib/logger'

let ioServer

// Handler para inicializar o servidor Socket.IO
export const handler = async (event, context) => {
  if (!ioServer) {
    const httpServer = createServer()

    // Cria o servidor Socket.IO com CORS e path customizado
    ioServer = new Server(httpServer, {
      cors: {
        origin: process.env.WEB_URL || 'http://localhost:8910',
        methods: ['GET', 'POST'],
      },
      path: '/.redwood/functions/socket',
    })

    // Eventos de conexão e sala de receitas
    ioServer.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`)

      socket.on('joinRecipesRoom', () => {
        socket.join('recipesRoom')
        logger.info(`Client ${socket.id} joined recipesRoom`)
      })

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`)
      })
    })

    const port = process.env.SOCKET_PORT || 8912

    httpServer.listen(port, () => {
      logger.info(`Socket.IO server running on port ${port}`)
    })
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'Socket.IO ready' }),
  }
}
