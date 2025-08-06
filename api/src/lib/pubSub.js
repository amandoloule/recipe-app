import { createPubSub } from '@redwoodjs/realtime'

// Instância global de pubSub
export const pubSub = createPubSub()

// Resolvedores para subscriptions de receitas
export const subscriptionResolvers = {
  recipeCreated: {
    // Assina evento de criação de receita
    subscribe: (_args, { pubSub }) => pubSub.subscribe('recipeCreated'),

    // Retorna o payload recebido
    resolve: (payload) => payload,
  },

  recipeLiked: {
    // Assina evento de curtida em receita
    subscribe: (_args, { pubSub }) => pubSub.subscribe('recipeLiked'),

    // Retorna o payload recebido
    resolve: (payload) => payload,
  },
}
