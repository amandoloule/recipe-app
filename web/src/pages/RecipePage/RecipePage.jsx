import { Container, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@redwoodjs/web'
import { RecipeCard } from 'src/components/RecipeCard'

// Query para buscar receita por id
const RECIPE_QUERY = gql`
  query RecipeQuery($id: String!) {
    recipe(id: $id) {
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

// Página de detalhes da receita
const RecipePage = ({ id }) => {
  const { data, loading, error } = useQuery(RECIPE_QUERY, {
    variables: { id },
  })

  if (loading) return <CircularProgress />
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Card expandido da receita */}
      {data?.recipe && <RecipeCard recipe={data.recipe} expanded />}
    </Container>
  )
}

export default RecipePage
