// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import AppLayout from 'src/layouts/AppLayout'

// Define as rotas principais da aplicação
const Routes = () => {
  return (
    <Router>
      {/* Usa AppLayout para todas as páginas */}
      <Set wrap={AppLayout}>
        {/* Página inicial */}
        <Route path="/" page={HomePage} name="home" />
        {/* Página de detalhes da receita */}
        <Route path="/recipe/{id:String}" page={RecipePage} name="recipe" />
      </Set>
    </Router>
  )
}

export default Routes
