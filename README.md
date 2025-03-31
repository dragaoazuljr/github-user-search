# GitHub User Search 🔍

## Sobre o Projeto

GitHub User Search é uma aplicação moderna para busca de perfis do GitHub, permitindo visualizar informações detalhadas de usuários e seus repositórios. Desenvolvida com Angular e seguindo as melhores práticas de desenvolvimento.

## Funcionalidades

- Busca de usuários do GitHub por username
- Visualização detalhada do perfil do usuário
- Listagem e ordenação de repositórios
  - Por nome
  - Por número de estrelas
  - Por data de atualização
- Design moderno com tema escuro
- Layout responsivo
- Links diretos para GitHub, Twitter e blog do usuário
- Ordenação dinâmica dos repositórios
- Alta cobertura de testes

## Tecnologias Utilizadas

- Angular 19.2
- TypeScript
- RxJS
- GitHub REST API
- SASS/SCSS
- Jasmine/Karma para testes

## Pré-requisitos

- Node.js (v18+)
- npm (v9+)
- Angular CLI

## Instalação
1. Instale as dependências
```bash
npm install
```

2. Execute a aplicação
```bash
ng serve
```

4. Acesse `http://localhost:4200` no seu navegador

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera versão de produção
- `npm test`: Executa testes unitários
- `npm run test:coverage`: Executa testes com relatório de cobertura
- `npm run e2e`: Executa testes end-to-end

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── search/             # Componente de busca
│   ├── user-details/       # Componente de detalhes do usuário
│   ├── repository-list/    # Componente de lista de repositórios
│   ├── services/           # Serviços da aplicação
│   ├── shared/             # Recursos compartilhados
│   └── interfaces/         # Interfaces das APIs
├── assets/                 # Recursos estáticos
└── styles/                 # Estilos globais
```

## Documentação

Para gerar a Documentação completa do projeto utilizando Compodoc, rode:

```bash
npm run compodoc:serve

```

Acessar a documentação do projeto em `http://localhost:8080`

## Funcionalidades Detalhadas

### Busca de Usuários
- Validação de formato de username
- Feedback de carregamento
- Tratamento de erros

### Detalhes do Usuário
- Informações básicas do perfil
- Estatísticas (seguidores, seguindo, repos)
- Links para redes sociais
- Localização
- Data de entrada no GitHub

### Lista de Repositórios
- Ordenação múltipla
- Informações detalhadas por repositório
  - Nome e descrição
  - Número de estrelas
  - Linguagem principal
  - Data da última atualização
- Links diretos para os repositórios

## Padrões de Código

- Componentes standalone
- Lazy loading
- Tratamento de erros consistente
- Tipagem forte com TypeScript
- Testes abrangentes
- SCSS com variáveis CSS
