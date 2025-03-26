describe('GitHub User Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should search for a valid GitHub user', () => {
    // Realiza a busca
    cy.get('input[placeholder="Buscar usuário do GitHub..."]').type('octocat');
    cy.get('.search-btn').click();

    // Aguarda o clique
    cy.wait(100);

    // Verifica se foi redirecionado para a página de detalhes do usuário
    cy.url().should('include', '/user/octocat');
  });

  it('should show error for empty username', () => {
    // Clica no botão de busca com um nome inválido
    cy.get('.search-btn').click();

    cy.get('.error-message').should('exist');
    cy.get('.error-message').contains('Por favor, insira um nome de usuário');
  });
});
