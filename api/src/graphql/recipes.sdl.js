export const schema = gql`
  # Tipo principal que representa uma receita
  type Recipe {
    id: String!
    title: String!
    ingredients: String!
    instructions: String!
    prepTime: String!
    servings: String!
    notes: String
    likes: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    tags: [Tag]!
  }

  # Tipo para tags associadas à receita
  type Tag {
    id: String!
    name: String!
  }

  # Estatísticas agregadas sobre receitas
  type RecipeStats {
    totalRecipes: Int!
    totalTags: Int!
    totalLikes: Int!
  }

  # Enum para ordenar receitas
  enum RecipeOrderBy {
    createdAt
    likes
    title
  }

  # Enum para direção de ordenação
  enum SortOrder {
    asc
    desc
  }

  # Consultas disponíveis
  type Query {
    recipes(
      orderBy: RecipeOrderBy
      sortOrder: SortOrder
      limit: Int
    ): [Recipe!]! @skipAuth
    recipe(id: String!): Recipe @skipAuth
    searchRecipes(query: String!, limit: Int): [Recipe!]! @skipAuth
    popularRecipes(limit: Int): [Recipe!]! @skipAuth
    recentRecipes(limit: Int): [Recipe!]! @skipAuth
    recipesByTag(tagName: String!, limit: Int): [Recipe!]! @skipAuth
    recipeStats: RecipeStats! @skipAuth
  }

  # Input para criar receita
  input CreateRecipeInput {
    title: String!
    ingredients: String!
    instructions: String!
    prepTime: String!
    servings: String!
    notes: String
    tags: [String!]
  }

  # Input para atualizar receita
  input UpdateRecipeInput {
    title: String
    ingredients: String
    instructions: String
    prepTime: String
    servings: String
    notes: String
    likes: Int
    tags: [String!]
  }

  # Mutations disponíveis
  type Mutation {
    createRecipe(input: CreateRecipeInput!): Recipe! @skipAuth
    updateRecipe(id: String!, input: UpdateRecipeInput!): Recipe! @skipAuth
    likeRecipe(id: String!): Recipe! @skipAuth
  }

  # Subscriptions para eventos de receita
  type Subscription {
    recipeCreated: Recipe! @skipAuth
    recipeLiked: Recipe! @skipAuth
  }
`
