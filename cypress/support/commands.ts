// Comandos personalizados do Cypress
import { Interception } from 'cypress/types/net-stubbing';

// Adiciona um comando para limpar o input de busca
Cypress.Commands.add('clearSearchInput', () => {
  cy.get('input[placeholder="Buscar usuário do GitHub..."]').clear();
});

// Adiciona um comando para realizar uma busca de usuário
Cypress.Commands.add('searchUser', (username: string) => {
  cy.get('input[placeholder="Buscar usuário do GitHub..."]').type(username);
  cy.get('button.search-btn').click();
});

// Adiciona um comando para filtrar repositórios
Cypress.Commands.add('filterRepositories', (filterText: string) => {
  cy.get('#filterText').type(filterText);
});

// Adiciona um comando para ordenar repositórios
Cypress.Commands.add('sortRepositories', (sortBy: string, order: 'asc' | 'desc') => {
  cy.get('#sortBy').select(sortBy);
  cy.get('#sortOrder').select(order === 'asc' ? 'Crescente' : 'Decrescente');
});

// Adiciona um comando para interceptar requisições do GitHub
Cypress.Commands.add('interceptGitHubRequest', (alias: string, url: string) => {
  cy.intercept('GET', url, (req) => {
    // Opcional: adicionar cabeçalho de autorização se um token estiver disponível
    const token = Cypress.env('GITHUB_TOKEN');
    if (token) {
      req.headers['Authorization'] = `token ${token}`;
    }
  }).as(alias);
});

// Adiciona um comando para verificar se um elemento está visível
Cypress.Commands.add('isVisible', (selector: string) => {
  cy.get(selector).should('be.visible');
});

// Adiciona um comando para verificar o texto de um elemento
Cypress.Commands.add('checkElementText', (selector: string, expectedText: string) => {
  cy.get(selector).should('contain.text', expectedText);
});

// Declaração de tipos para os comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      clearSearchInput(): Chainable<void>
      searchUser(username: string): Chainable<void>
      filterRepositories(filterText: string): Chainable<void>
      sortRepositories(sortBy: string, order: 'asc' | 'desc'): Chainable<void>
      interceptGitHubRequest(alias: string, url: string): Chainable<Interception>
      isVisible(selector: string): Chainable<void>
      checkElementText(selector: string, expectedText: string): Chainable<void>
    }
  }
}

export {};
