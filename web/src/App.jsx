import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import FatalErrorPage from 'src/pages/FatalErrorPage'

import './index.css'

// Criação do tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul padrão do MUI
    },
    secondary: {
      main: '#dc004e', // Rosa/vermelho
    },
    background: {
      default: '#f5f5f5', // Cor de fundo clara
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(','),
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase automático em botões
        },
      },
    },
  },
})

const App = ({ children }) => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <RedwoodApolloProvider>
        {/* Adicione o ThemeProvider e CssBaseline aqui */}
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Normaliza o CSS e aplica o fundo padrão */}
          {children}
        </ThemeProvider>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
