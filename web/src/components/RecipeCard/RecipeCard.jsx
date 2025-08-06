import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Chip,
  Stack,
  IconButton,
  Collapse,
  Box,
  Divider,
} from '@mui/material'
import {
  Favorite,
  Share,
  ExpandMore,
  AccessTime,
  Restaurant,
  LocalOffer,
} from '@mui/icons-material'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from 'react-hot-toast'
import MarkdownRenderer from 'src/components/MarkdownRenderer'

// Mutation para curtir receita
const LIKE_RECIPE = gql`
  mutation LikeRecipeMutation($id: String!) {
    likeRecipe(id: $id) {
      id
      likes
    }
  }
`

const RecipeCard = ({ recipe, expanded = false }) => {
  // Estados para expansão, curtidas e controle de botão
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likes)

  // Mutation hook para curtir receita
  const [likeRecipe] = useMutation(LIKE_RECIPE, {
    onCompleted: () => {
      setLikeCount(likeCount + 1)
      setLiked(true)
      toast.success('Receita curtida! ❤️')
    },
    onError: (error) => {
      toast.error(`Erro ao curtir receita: ${error.message}`)
    },
  })

  // Lógica para curtir receita
  const handleLike = () => {
    if (!liked) {
      likeRecipe({ variables: { id: recipe.id } })
    }
  }

  // Compartilhar receita (web share ou copiar link)
  const handleShare = async () => {
    const url = `${window.location.origin}${routes.recipe({ id: recipe.id })}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Confira esta receita incrível: ${recipe.title}`,
          url,
        })
      } catch (error) {
        // Se cancelar o share, não fazer nada
      }
    } else {
      // Fallback para copiar para clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Link copiado para a área de transferência!')
      } catch (error) {
        toast.error('Erro ao copiar link')
      }
    }
  }

  // Formata data para exibição
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card
      sx={{
        mb: 3,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
      elevation={2}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Título e data da receita */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 0.5,
            }}
          >
            {recipe.title}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Publicado em {formatDate(recipe.createdAt)}
          </Typography>
        </Box>

        {/* Chips de informações rápidas */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
        >
          <Chip
            icon={<AccessTime />}
            label={recipe.prepTime}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<Restaurant />}
            label={recipe.servings}
            size="small"
            color="secondary"
            variant="outlined"
          />

          {recipe.tags.map((tag) => (
            <Chip
              key={tag.id}
              icon={<LocalOffer />}
              label={tag.name}
              size="small"
              variant="outlined"
              sx={{
                backgroundColor: 'action.hover',
                '&:hover': { backgroundColor: 'action.selected' },
              }}
            />
          ))}
        </Stack>

        {/* Preview das notas pessoais */}
        {recipe.notes && !isExpanded && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Dica:</strong>{' '}
              <MarkdownRenderer
                content={
                  recipe.notes.substring(0, 100) +
                  (recipe.notes.length > 100 ? '...' : '')
                }
                component="span"
              />
            </Typography>
          </Box>
        )}

        {/* Conteúdo expandido: ingredientes, preparo, notas */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />

            {/* Ingredientes */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              📝 Ingredientes
            </Typography>
            <Box sx={{ mb: 3, pl: 1 }}>
              <MarkdownRenderer content={recipe.ingredients} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Modo de preparo */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              👨‍🍳 Modo de Preparo
            </Typography>
            <Box sx={{ mb: 3, pl: 1 }}>
              <MarkdownRenderer content={recipe.instructions} />
            </Box>

            {/* Notas pessoais completas */}
            {recipe.notes && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  💡 Notas Pessoais
                </Typography>
                <Box sx={{ pl: 1 }}>
                  <MarkdownRenderer content={recipe.notes} />
                </Box>
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Botão de curtir e contador */}
          <IconButton
            aria-label="curtir receita"
            color={liked ? 'error' : 'default'}
            onClick={handleLike}
            disabled={liked}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Favorite />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likeCount} {likeCount === 1 ? 'curtida' : 'curtidas'}
          </Typography>

          {/* Botão de compartilhar */}
          <IconButton
            aria-label="compartilhar receita"
            onClick={handleShare}
            sx={{
              ml: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Share />
          </IconButton>
        </Box>

        {/* Botão de expandir/colapsar */}
        <Button
          size="small"
          endIcon={
            <ExpandMore
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          }
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ fontWeight: 500 }}
        >
          {isExpanded ? 'Mostrar menos' : 'Ver receita completa'}
        </Button>
      </CardActions>
    </Card>
  )
}

export default RecipeCard
