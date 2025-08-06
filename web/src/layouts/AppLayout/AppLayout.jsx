import { Box, CssBaseline, Toolbar } from '@mui/material'
import AppBar from 'src/components/AppBar'

// Layout principal da aplicação
const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Barra de navegação */}
      <AppBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        {/* Espaço para barra de navegação */}
        <Toolbar />
        {/* Conteúdo da página */}
        {children}
      </Box>
    </Box>
  )
}

export default AppLayout
