import { db } from 'src/lib/db'
import { pubSub } from 'src/lib/pubSub'

// Busca receitas com ordenação, limite e inclui tags
export const recipes = ({
  orderBy = 'createdAt',
  sortOrder = 'desc',
  limit = 50,
} = {}) => {
  return db.recipe.findMany({
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { [orderBy]: sortOrder },
    take: limit,
  })
}

// Busca receita por id, incluindo tags
export const recipe = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

// Busca receitas por texto, incluindo tags
export const searchRecipes = ({ query, limit = 50 }) => {
  return db.recipe.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { ingredients: { contains: query, mode: 'insensitive' } },
        { instructions: { contains: query, mode: 'insensitive' } },
        { notes: { contains: query, mode: 'insensitive' } },
        {
          tags: {
            some: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
        },
      ],
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Busca receitas populares (likes > 0)
export const popularRecipes = ({ limit = 10 } = {}) => {
  return db.recipe.findMany({
    where: {
      likes: {
        gt: 0,
      },
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  })
}

// Busca receitas recentes
export const recentRecipes = ({ limit = 20 } = {}) => {
  return db.recipe.findMany({
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Busca receitas por nome da tag
export const recipesByTag = ({ tagName, limit = 50 }) => {
  return db.recipe.findMany({
    where: {
      tags: {
        some: {
          name: { equals: tagName, mode: 'insensitive' },
        },
      },
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Cria uma nova receita e publica evento
export const createRecipe = async ({ input }) => {
  const { tags = [], ...recipeData } = input

  const recipe = await db.recipe.create({
    data: {
      ...recipeData,
      tags: {
        connectOrCreate: tags.filter(Boolean).map((tag) => ({
          where: { name: tag.toLowerCase().trim() },
          create: { name: tag.toLowerCase().trim() },
        })),
      },
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  await pubSub.publish('recipeCreated', recipe)
  return recipe
}

// Atualiza receita existente
export const updateRecipe = ({ id, input }) => {
  const { tags, ...recipeData } = input

  return db.recipe.update({
    data: {
      ...recipeData,
      ...(tags && {
        tags: {
          set: [],
          connectOrCreate: tags.filter(Boolean).map((tag) => ({
            where: { name: tag.toLowerCase().trim() },
            create: { name: tag.toLowerCase().trim() },
          })),
        },
      }),
    },
    where: { id },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

// Incrementa likes e publica evento
export const likeRecipe = async ({ id }) => {
  const recipe = await db.recipe.update({
    data: { likes: { increment: 1 } },
    where: { id },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  await pubSub.publish('recipeLiked', recipe)

  return recipe
}

// Retorna estatísticas agregadas
export const recipeStats = async () => {
  const totalRecipes = await db.recipe.count()
  const totalTags = await db.tag.count()
  const totalLikes = await db.recipe.aggregate({
    _sum: {
      likes: true,
    },
  })

  return {
    totalRecipes,
    totalTags,
    totalLikes: totalLikes._sum.likes || 0,
  }
}
