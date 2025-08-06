import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link, routes } from '@redwoodjs/router'

// Barra de navegação fixa no topo
const AppBar = () => {
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        {/* Título e link para página inicial */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            to={routes.home()}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Receitas Compartilhadas
          </Link>
        </Typography>
        {/* Botão para página inicial */}
        <Button color="inherit" component={Link} to={routes.home()}>
          Início
        </Button>
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar
