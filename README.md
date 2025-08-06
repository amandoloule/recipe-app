# App de Receitas - Teste Técnico

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js 20.x
- Yarn 4.6.0+

### Instalação e execução

```bash
# 1. Clone o repositório
git clone [seu-repo]
cd recipe-app

# 2. Instale as dependências
yarn install

# 3. Configure o banco de dados
yarn rw prisma migrate dev

# 4. Execute o projeto
yarn rw dev
```

O projeto estará disponível em:

- **Web:** http://localhost:8910
- **API:** http://localhost:8911
- **GraphQL Playground:** http://localhost:8911/graphql

## 📋 Funcionalidades implementadas

### ✅ Requisitos obrigatórios

- [x] **RedwoodJS** com Prisma, GraphQL e React
- [x] **Material UI** para interface
- [x] **Tiptap** para edição rica (markdown-like)
- [x] **SQLite** como banco de dados
- [x] **Tempo real** via GraphQL subscriptions

### ✅ Funcionalidades principais

- [x] **Feed de receitas em tempo real**
- [x] **Editor rico com formatação** (listas, negrito, itálico, etc.)
- [x] **Sistema de likes** com atualização instantânea
- [x] **Busca avançada** por ingredientes, título, instruções
- [x] **Sistema de tags/categorização**
- [x] **Links únicos** para cada receita
- [x] **Interface responsiva** (mobile + desktop)
- [x] **Filtros e ordenação** (recentes/populares)
- [x] **Paginação** para performance

## 🏗️ Arquitetura e qualidade

### Schema do banco otimizado

- Índices para busca e ordenação
- Relacionamentos bem definidos
- Nomenclatura intuitiva

### GraphQL bem estruturado

- Queries eficientes (sem N+1)
- Subscriptions para tempo real
- Field resolvers otimizados

### Componentes organizados

- Reutilizáveis e modulares
- Separação de responsabilidades
- Clean code e padrões consistentes

### UI/UX destacada

- Design moderno com Material UI
- Animações e micro-interações
- Tipografia clara e espaçamentos harmoniosos
- Feedback visual completo

## 🛠️ Tecnologias utilizadas

- **Backend:** RedwoodJS, Prisma, GraphQL, SQLite
- **Frontend:** React, Material UI, Tiptap
- **Tempo real:** GraphQL Subscriptions + Apollo Cache
- **Busca:** Full-text search otimizada
- **Estado:** Apollo Client + React hooks

## 📱 Screenshots

[Adicione algumas screenshots do app funcionando]

## 🎯 Diferenciais implementados

- **Performance otimizada:** Queries com índices, paginação, debounce
- **UX superior:** Animações, loading states, toasts informativos
- **Busca inteligente:** Por múltiplos campos + filtros por tags
- **Editor avançado:** Tiptap com toolbar completa
- **Responsive design:** Funciona perfeitamente em mobile
- **Tempo real:** Receitas e likes atualizados instantaneamente

---

**Desenvolvido por [Seu Nome]**  
📧 [amandolourenco@hotmail.com]  
🔗 [[seu-linkedin](https://www.linkedin.com/in/amandoloule/)]
