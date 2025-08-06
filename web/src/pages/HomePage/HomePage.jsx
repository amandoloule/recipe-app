import { Container } from '@mui/material'
import RecipeForm from 'src/components/RecipeForm'
import RecipesList from 'src/components/RecipesList'

// Página principal: formulário + lista de receitas
const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Formulário para criar receita */}
      <RecipeForm />
      {/* Lista de receitas */}
      <RecipesList />
    </Container>
  )
}

export default HomePage
