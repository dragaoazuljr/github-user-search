describe('User Details Page', () => {
  beforeEach(() => {
    // Navega para a página de detalhes de um usuário específico
    cy.visit('/user/octocat');
  });

  it('should display user details correctly', () => {
    // Verifica elementos básicos do perfil
    cy.get('.user-card h2').should('be.visible');
    cy.get('.user-avatar').should('be.visible');

    // Verifica estatísticas do usuário
    cy.get('.user-stats .stat-item').should('have.length', 3);
    cy.get('.user-stats .stat-label').then(($labels) => {
      const labels = $labels.map((i, el) => Cypress.$(el).text().trim()).get();
      expect(labels).to.deep.equal(['Repositories', 'Followers', 'Following']);
    });
  });

  it('should display repositories list', () => {
    // Verifica a lista de repositórios
    cy.get('.repositories').should('exist');
    cy.get('.repo-list .repo-item').should('have.length.gt', 0);
  });

  it('should filter repositories', () => {
    // Encontra o input de filtro
    cy.get('#filterText').as('filterInput');

    // Digita parte do nome de um repositório
    cy.get('@filterInput').type('hello');

    // Verifica se a lista de repositórios foi filtrada
    cy.get('.repo-list .repo-item').should('have.length.gt', 0);
  });

  it('should sort repositories', () => {
    // Encontra os selects de ordenação
    cy.get('#sortBy').as('sortBySelect');
    cy.get('#sortOrder').as('sortOrderSelect');

    // Testa ordenação por estrelas em ordem decrescente
    cy.get('@sortBySelect').select('Estrelas');
    cy.get('@sortOrderSelect').select('Decrescente');

    // Verifica se a primeira entrada tem o maior número de estrelas
    cy.get('.repo-list .repo-item').first().find('.repo-stats span:first-child')
      .invoke('text')
      .then((text) => {
        const stars = parseInt(text.replace('⭐ ', ''));
        cy.get('.repo-list .repo-item').each(($el) => {
          const currentStars = parseInt($el.find('.repo-stats span:first-child').text().replace('⭐ ', ''));
          expect(currentStars).to.be.lte(stars);
        });
      });
  });

  it('should handle empty repository list', () => {
    // Simula uma lista vazia de repositórios
    cy.get('#filterText').type('nonexistent-repo');

    // Verifica a mensagem de nenhum repositório encontrado
    cy.contains('Nenhum repositório encontrado').should('be.visible');
  });

  it('should show repository details', () => {
    // Verifica os detalhes de um repositório
    cy.get('.repo-list .repo-item').first().within(() => {
      cy.get('h4').should('be.visible');
      cy.get('p').should('be.visible');
      cy.get('.repo-stats').should('be.visible');
      cy.get('.repo-stats .language').should('be.visible');
      cy.get('.repo-stats .update-date').should('be.visible');
    });
  });

  it('should display user bio', () => {
    // Verifica a seção de biografia
    cy.get('.user-bio').should('be.visible');
  });

  it('should display user links', () => {
    // Verifica a seção de links
    cy.get('.user-links').should('be.visible');
    cy.get('.user-links .link-item').should('have.length.gte', 1);
  });
});
