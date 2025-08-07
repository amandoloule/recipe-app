// Renderiza HTML de Markdown com estilos
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

// Estilos para conteúdo Markdown
const StyledMarkdownContent = styled(Box)(({ theme }) => ({
  '& h1': {
    fontSize: '2rem',
    fontWeight: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  '& h2': {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  '& h3': {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  '& p': {
    marginBottom: theme.spacing(1),
    lineHeight: '1.6',
  },
  '& ul': {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),

    '& li': {
      marginBottom: theme.spacing(0.5),
      lineHeight: '1.6',
    },
  },
  '& ol': {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),

    '& li': {
      marginBottom: theme.spacing(0.5),
      lineHeight: '1.6',
    },
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(2),
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,

    '& p': {
      marginBottom: theme.spacing(0.5),
    },
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '0.9em',
    color: theme.palette.primary.dark,
  },
  '& pre': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    marginBottom: theme.spacing(2),

    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
  // Remove margens do primeiro e último elemento
  '& > *:first-of-type': {
    marginTop: 0,
  },
  '& > *:last-child': {
    marginBottom: 0,
  },
}))

const MarkdownRenderer = ({ content, ...props }) => {
  // Não renderiza se não há conteúdo
  if (!content) return null

  return (
    <StyledMarkdownContent
      {...props}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default MarkdownRenderer
