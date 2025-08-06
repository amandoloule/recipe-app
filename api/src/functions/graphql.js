import { createGraphQLHandler } from '@redwoodjs/graphql-server'
import { subscriptionResolvers } from 'src/lib/pubSub'

// Importa diretivas, SDLs e serviços
import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

// Handler principal GraphQL da API
export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  subscriptions: {
    ...subscriptionResolvers, // Adiciona subscriptions customizadas
  },
  onException: () => {
    db.$disconnect() // Desconecta do banco em caso de erro
  },
})
