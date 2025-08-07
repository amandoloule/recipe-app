import { db } from 'src/lib/db'
import { pubSub } from 'src/lib/pubSub'

export const recipes = ({ orderBy = 'createdAt', sortOrder = 'desc', limit = 50 } = {}) => {
  return db.recipe.findMany({
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
    orderBy: { [orderBy]: sortOrder },
    take: limit,
  })
}

export const recipe = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
  })
}

// Busca compatível com SQLite - sem mode: insensitive
export const searchRecipes = async ({ query, limit = 50 }) => {
  if (!query || query.trim() === '') {
    return []
  }

  // Busca básica (case-sensitive no SQLite)
  const results = await db.recipe.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { ingredients: { contains: query } },
        { instructions: { contains: query } },
        { notes: { contains: query } },
        {
          tags: {
            some: {
              name: { contains: query }
            }
          }
        }
      ],
    },
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
    orderBy: { createdAt: 'desc' },
    take: limit * 2, // Pegamos mais para filtrar depois
  })

  // Filtro case-insensitive no JavaScript
  const queryLower = query.toLowerCase()
  const filteredResults = results.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(queryLower)
    const ingredientsMatch = recipe.ingredients.toLowerCase().includes(queryLower)
    const instructionsMatch = recipe.instructions.toLowerCase().includes(queryLower)
    const notesMatch = recipe.notes?.toLowerCase().includes(queryLower) || false
    const tagsMatch = recipe.tags.some(tag => 
      tag.name.toLowerCase().includes(queryLower)
    )
    
    return titleMatch || ingredientsMatch || instructionsMatch || notesMatch || tagsMatch
  })

  return filteredResults.slice(0, limit)
}

export const popularRecipes = ({ limit = 10 } = {}) => {
  return db.recipe.findMany({
    where: {
      likes: {
        gt: 0
      }
    },
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
    orderBy: [
      { likes: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit,
  })
}

export const recentRecipes = ({ limit = 20 } = {}) => {
  return db.recipe.findMany({
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export const recipesByTag = async ({ tagName, limit = 50 }) => {
  // Busca case-insensitive para tags
  const results = await db.recipe.findMany({
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
    orderBy: { createdAt: 'desc' },
  })

  const tagNameLower = tagName.toLowerCase()
  const filteredResults = results.filter(recipe =>
    recipe.tags.some(tag => 
      tag.name.toLowerCase() === tagNameLower ||
      tag.name.toLowerCase().includes(tagNameLower)
    )
  )

  return filteredResults.slice(0, limit)
}

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
        }
      } 
    },
  })

  await pubSub.publish('recipeCreated', recipe)
  return recipe
}

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
        }
      })
    },
    where: { id },
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
  })
}

export const likeRecipe = async ({ id }) => {
  const recipe = await db.recipe.update({
    data: { likes: { increment: 1 } },
    where: { id },
    include: { 
      tags: {
        select: {
          id: true,
          name: true,
        }
      } 
    },
  })

  await pubSub.publish('recipeLiked', recipe)

  return recipe
}

export const recipeStats = async () => {
  const totalRecipes = await db.recipe.count()
  const totalTags = await db.tag.count()
  const totalLikes = await db.recipe.aggregate({
    _sum: {
      likes: true
    }
  })
  
  return {
    totalRecipes,
    totalTags,
    totalLikes: totalLikes._sum.likes || 0,
  }
}