import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Typography as MuiTypography,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Undo,
  Redo,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Estilização customizada do conteúdo do editor
const StyledEditorContent = styled(Box)(({ theme }) => ({
  '& .ProseMirror': {
    outline: 'none',
    padding: theme.spacing(2),
    minHeight: '150px',
    fontSize: '16px',
    lineHeight: '1.6',
    fontFamily: theme.typography.fontFamily,

    // Estilização dos elementos markdown
    '& h1': {
      fontSize: '2rem',
      fontWeight: 600,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& h2': {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& h3': {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(0.5),
    },
    '& ul': {
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& ol': {
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& li': {
      marginBottom: theme.spacing(0.5),
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      paddingLeft: theme.spacing(2),
      marginLeft: 0,
      marginRight: 0,
      fontStyle: 'italic',
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(1, 2),
      borderRadius: theme.shape.borderRadius,
    },
    '& code': {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius,
      fontFamily: 'monospace',
      fontSize: '0.9em',
    },
    '& pre': {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
    '& p.is-editor-empty:first-child::before': {
      color: theme.palette.text.secondary,
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none',
    },
  },
}))

const TiptapEditor = ({
  content = '',
  onChange,
  placeholder = 'Digite aqui...',
  label,
  minHeight = '150px',
}) => {
  // Inicializa o editor com extensões e placeholder
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      onChange?.(html, text)
    },
  })

  if (!editor) {
    return null
  }

  // Botão customizado para a toolbar do editor
  const MenuButton = ({ onClick, isActive, children, title }) => (
    <IconButton
      onClick={onClick}
      color={isActive ? 'primary' : 'default'}
      size="small"
      title={title}
      sx={{
        borderRadius: 1,
        backgroundColor: isActive ? 'primary.light' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'primary.main' : 'action.hover',
        },
      }}
    >
      {children}
    </IconButton>
  )

  return (
    <Box>
      {/* Label opcional */}
      {label && (
        <MuiTypography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </MuiTypography>
      )}

      <Paper variant="outlined">
        {/* Toolbar de formatação */}
        <Toolbar variant="dense" sx={{ minHeight: '48px', gap: 0.5 }}>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Negrito (Ctrl+B)"
          >
            <FormatBold />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Itálico (Ctrl+I)"
          >
            <FormatItalic />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Código inline"
          >
            <Code />
          </MenuButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Lista com marcadores"
          >
            <FormatListBulleted />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Lista numerada"
          >
            <FormatListNumbered />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Citação"
          >
            <FormatQuote />
          </MenuButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Refazer (Ctrl+Y)"
          >
            <Redo />
          </MenuButton>
        </Toolbar>

        <Divider />

        {/* Área do editor */}
        <StyledEditorContent sx={{ minHeight }}>
          <EditorContent editor={editor} />
        </StyledEditorContent>
      </Paper>
    </Box>
  )
}

export default TiptapEditor
