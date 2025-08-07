// Busca, filtros e ordenação de receitas
import { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack,
  Paper,
  Typography,
  InputAdornment,
  Collapse,
  Button,
} from '@mui/material'
import {
  Search,
  FilterList,
  TrendingUp,
  Schedule,
  LocalOffer,
  ExpandMore,
} from '@mui/icons-material'

// Componente principal
const SearchAndFilters = ({
  onSearchChange,
  onFilterChange,
  onSortChange,
  popularTags = [],
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Refs para evitar loops
  const searchTimeoutRef = useRef(null)
  const lastFiltersRef = useRef(null)

  // Debounce da busca
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (onSearchChange && typeof onSearchChange === 'function') {
        onSearchChange(searchQuery)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Atualiza filtros quando mudam
  useEffect(() => {
    const newFilters = {
      tags: selectedTags,
      sortBy,
    }

    const filtersChanged =
      JSON.stringify(newFilters) !== JSON.stringify(lastFiltersRef.current)

    if (
      filtersChanged &&
      onFilterChange &&
      typeof onFilterChange === 'function'
    ) {
      lastFiltersRef.current = newFilters
      onFilterChange(newFilters)
    }
  }, [selectedTags, sortBy])

  // Muda ordenação
  const handleSortChange = (event, newSort) => {
    if (newSort !== null) {
      setSortBy(newSort)
      if (onSortChange && typeof onSortChange === 'function') {
        onSortChange(newSort)
      }
    }
  }

  // Adiciona/remove tag
  const handleTagToggle = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    )
  }

  // Limpa filtros
  const clearFilters = () => {
    setSelectedTags([])
    setSortBy('recent')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim() !== ''

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      {/* Busca principal */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar receitas"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procure por ingredientes, nome da receita ou modo de preparo..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Ordenação */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Ordenar por:
          </Typography>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSortChange}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            <ToggleButton value="recent">
              <Schedule sx={{ mr: 1 }} />
              Mais recentes
            </ToggleButton>
            <ToggleButton value="popular">
              <TrendingUp sx={{ mr: 1 }} />
              Mais curtidas
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filtros: mostrar/ocultar */}
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          endIcon={
            <ExpandMore
              sx={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          }
          onClick={() => setShowFilters(!showFilters)}
          color={hasActiveFilters ? 'primary' : 'inherit'}
        >
          Filtros {hasActiveFilters && `(${selectedTags.length})`}
        </Button>
      </Stack>

      {/* Filtros expandidos */}
      <Collapse in={showFilters}>
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {/* Tags populares */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <LocalOffer fontSize="small" />
              Tags populares:
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))}

              {popularTags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma tag popular ainda. Seja o primeiro a criar receitas
                  com tags!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Filtros ativos */}
          {hasActiveFilters && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">Filtros ativos:</Typography>

                {selectedTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagToggle(tag)}
                    color="primary"
                    size="small"
                  />
                ))}

                <Button size="small" onClick={clearFilters} sx={{ ml: 1 }}>
                  Limpar todos
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

export default SearchAndFilters
