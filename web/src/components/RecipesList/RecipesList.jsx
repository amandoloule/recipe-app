import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
} from '@mui/material'
import { useQuery } from '@redwoodjs/web'
import RecipeCard from 'src/components/RecipeCard'
import SearchAndFilters from 'src/components/SearchAndFilters'

// Query principal para receitas
const RECIPES_QUERY = gql`
  query RecipesQuery {
    recipes {
      id
      title
      ingredients
      instructions
      prepTime
      servings
      notes
      likes
      createdAt
      tags {
        id
        name
      }
    }
  }
`

// Query para busca por texto
const SEARCH_RECIPES_QUERY = gql`
  query SearchRecipesQuery($query: String!) {
    searchRecipes(query: $query) {
      id
      title
      ingredients
      instructions
      prepTime
      servings
      notes
      likes
      createdAt
      tags {
        id
        name
      }
    }
  }
`

const RecipesList = () => {
  // Estados para receitas, filtros, busca e paginação
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentFilters, setCurrentFilters] = useState({
    tags: [],
    sortBy: 'recent',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const recipesPerPage = 10

  // Busca receitas da API
  const { data, loading, error, refetch } = useQuery(RECIPES_QUERY)

  // Busca receitas por texto (condicional)
  const {
    data: searchData,
    loading: searchLoading,
    refetch: searchRefetch,
  } = useQuery(SEARCH_RECIPES_QUERY, {
    variables: { query: searchQuery },
    skip: !searchQuery.trim(), // Só busca se há termo
  })

  // Carrega receitas iniciais
  useEffect(() => {
    if (data?.recipes) {
      setRecipes(data.recipes)
    }
  }, [data])

  // Filtra e ordena receitas conforme busca e filtros
  useEffect(() => {
    let currentRecipes = []

    // Se há busca por texto, use os resultados da busca
    if (searchQuery.trim() && searchData?.searchRecipes) {
      currentRecipes = searchData.searchRecipes
    } else {
      currentRecipes = recipes
    }

    // Aplicar filtros de tags
    if (currentFilters.tags.length > 0) {
      currentRecipes = currentRecipes.filter((recipe) =>
        currentFilters.tags.every((tag) =>
          recipe.tags.some((recipeTag) =>
            recipeTag.name.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
    }

    // Aplicar ordenação
    if (currentFilters.sortBy === 'popular') {
      currentRecipes = [...currentRecipes].sort((a, b) => {
        if (b.likes !== a.likes) return b.likes - a.likes
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    } else {
      currentRecipes = [...currentRecipes].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    }

    setFilteredRecipes(currentRecipes)
    setCurrentPage(1) // Reset página quando filtros mudam
  }, [recipes, searchData, searchQuery, currentFilters])

  // Handler para busca
  const handleSearchChange = (query) => {
    setSearchQuery(query)
    // Se há query, a busca será executada automaticamente pelo useQuery
  }

  // Handler para filtros
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters)
  }

  // Extrai tags populares das receitas
  const popularTags = recipes
    .flatMap((recipe) => recipe.tags)
    .reduce((acc, tag) => {
      acc[tag.name] = (acc[tag.name] || 0) + 1
      return acc
    }, {})

  const sortedPopularTags = Object.entries(popularTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tagName]) => tagName)

  // Paginação
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)
  const startIndex = (currentPage - 1) * recipesPerPage
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  )

  const isLoading = loading || (searchQuery.trim() && searchLoading)

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Erro ao carregar receitas: {error.message}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Componente de busca e filtros */}
      <SearchAndFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        popularTags={sortedPopularTags}
        loading={isLoading}
      />

      {/* Indicador de carregamento */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista de receitas */}
      {!isLoading && (
        <>
          {/* Contador de resultados */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredRecipes.length === 0
              ? 'Nenhuma receita encontrada'
              : `${filteredRecipes.length} receita${filteredRecipes.length !== 1 ? 's' : ''} encontrada${filteredRecipes.length !== 1 ? 's' : ''}`}
            {searchQuery.trim() && ` para "${searchQuery}"`}
            {currentFilters.tags.length > 0 &&
              ` com tags: ${currentFilters.tags.join(', ')}`}
          </Typography>

          {/* Cards das receitas */}
          {paginatedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}

          {/* Paginação */}
          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}

          {/* Mensagem quando não há receitas */}
          {filteredRecipes.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                🍽️ Nenhuma receita encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery.trim() || currentFilters.tags.length > 0
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Seja o primeiro a compartilhar uma receita incrível!'}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default RecipesList
