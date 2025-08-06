import { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from '@mui/material'
import { useMutation } from '@redwoodjs/web'
import { toast } from 'react-hot-toast'
import TiptapEditor from 'src/components/TiptapEditor'

// Mutation para criar receita
const CREATE_RECIPE = gql`
  mutation CreateRecipeMutation($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
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

// Query para atualizar cache após criar receita
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

const RecipeForm = () => {
  // Estados para campos do formulário
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [instructions, setInstructions] = useState('')
  const [instructionsText, setInstructionsText] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [notes, setNotes] = useState('')
  const [notesText, setNotesText] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  // Mutation hook para criar receita
  const [createRecipe] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      toast.success('Receita criada com sucesso!')
      resetForm()
    },
    onError: (error) => {
      toast.error(`Erro ao criar receita: ${error.message}`)
    },
    update: (cache, { data }) => {
      // Atualiza cache local com nova receita
      if (data?.createRecipe) {
        try {
          const existingRecipes = cache.readQuery({ query: RECIPES_QUERY })

          cache.writeQuery({
            query: RECIPES_QUERY,
            data: {
              recipes: [data.createRecipe, ...(existingRecipes?.recipes || [])],
            },
          })
        } catch (error) {
          console.error('Erro ao atualizar cache:', error)
        }
      }
    },
  })

  // Limpa todos os campos do formulário
  const resetForm = () => {
    setTitle('')
    setIngredients('')
    setIngredientsText('')
    setInstructions('')
    setInstructionsText('')
    setPrepTime('')
    setServings('')
    setNotes('')
    setNotesText('')
    setTags([])
    setTagInput('')
  }

  // Adiciona nova tag à lista
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // Remove tag da lista
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Envia dados do formulário
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !ingredientsText.trim() || !instructionsText.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!prepTime.trim() || !servings.trim()) {
      toast.error('Por favor, preencha o tempo de preparo e rendimento')
      return
    }

    createRecipe({
      variables: {
        input: {
          title: title.trim(),
          ingredients: ingredients,
          instructions: instructions,
          prepTime: prepTime.trim(),
          servings: servings.trim(),
          notes: notes || '',
          tags: tags.filter((tag) => tag.trim()),
        },
      },
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      {/* Título do formulário */}
      <Typography variant="h5" gutterBottom>
        🍳 Compartilhe sua receita
      </Typography>

      {/* Subtítulo */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use formatação rica para deixar sua receita mais clara e atrativa!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* Campo título */}
        <TextField
          fullWidth
          label="Título da Receita"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ex: Bolo de Chocolate da Vovó"
          helperText="Dê um nome atrativo para sua receita"
        />

        <Divider />

        {/* Campo ingredientes com editor rico */}
        <TiptapEditor
          label="📝 Ingredientes *"
          content={ingredients}
          onChange={(html, text) => {
            setIngredients(html)
            setIngredientsText(text)
          }}
          placeholder="Liste os ingredientes da sua receita. Use formatação para deixar mais claro:

• 2 xícaras de farinha de trigo
• 1 xícara de açúcar
• 3 ovos
• 200g de chocolate"
          minHeight="200px"
        />

        {/* Campo modo de preparo com editor rico */}
        <TiptapEditor
          label="👨‍🍳 Modo de Preparo *"
          content={instructions}
          onChange={(html, text) => {
            setInstructions(html)
            setInstructionsText(text)
          }}
          placeholder="Descreva o passo a passo do preparo:

1. **Pré-aqueça o forno** a 180°C
2. Em uma tigela, misture os ingredientes secos
3. Adicione os ovos e misture bem
4. Asse por 30-40 minutos"
          minHeight="250px"
        />

        <Divider />

        {/* Campos tempo de preparo e rendimento */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="⏱️ Tempo de Preparo"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            required
            placeholder="Ex: 1h 30min"
            helperText="Inclua preparo + cozimento"
          />
          <TextField
            fullWidth
            label="🍽️ Rendimento"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
            placeholder="Ex: 8 porções"
            helperText="Quantas pessoas serve?"
          />
        </Stack>

        {/* Campo notas pessoais com editor rico */}
        <TiptapEditor
          label="💡 Notas Pessoais (opcional)"
          content={notes}
          onChange={(html, text) => {
            setNotes(html)
            setNotesText(text)
          }}
          placeholder="Compartilhe dicas especiais, variações ou a história por trás da receita:

💡 **Dica:** Para um bolo mais fofo, deixe os ovos em temperatura ambiente
🌟 **Variação:** Adicione raspas de limão para um sabor especial"
          minHeight="120px"
        />

        <Divider />

        {/* Seção de tags */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            🏷️ Tags (categorias)
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <TextField
              label="Adicionar tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              size="small"
              sx={{ flexGrow: 1 }}
              placeholder="Ex: sobremesa, fácil, chocolate"
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddTag}
              type="button"
            >
              Adicionar
            </Button>
          </Stack>

          <Box>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{ mr: 1, mb: 1 }}
                color="primary"
                variant="outlined"
              />
            ))}
            {tags.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Adicione tags para ajudar outros usuários a encontrar sua
                receita
              </Typography>
            )}
          </Box>
        </Box>

        {/* Botão de envio */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          🚀 Publicar Receita
        </Button>
      </Box>
    </Paper>
  )
}

export default RecipeForm
