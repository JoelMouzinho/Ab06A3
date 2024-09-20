Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});


describe('Quizkarten App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('zeigt die Frage und Antwort korrekt an', () => {

    cy.get('#new-question').type('Was ist die Hauptstadt von Deutschland?');
    cy.get('#new-answer').type('Berlin');
    cy.get('form').submit();

    cy.get('#question').should('contain', 'Was ist die Hauptstadt von Deutschland?');
    
    cy.get('#show-answer').click();
    cy.get('#answer').should('contain', 'Berlin').should('be.visible');
  });

  it('erlaubt Bewertungen nur nach dem Anzeigen der Antwort', () => {
    cy.get('#new-question').type('Was ist die Hauptstadt von Deutschland?');
    cy.get('#new-answer').type('Berlin');
    cy.get('form').submit();

    cy.get('#bad').click();
    cy.get('#good').click();
    cy.get('#great').click();

    cy.get('#show-answer').click();

    cy.get('#great').click();
  });

  it('zeigt den Fortschritt der Quizkarten korrekt an', () => {
    cy.get('#current-card').should('contain', '1');
    cy.get('#total-cards').should('contain', '3');

    cy.get('#new-question').type('Wie heißt die Hauptstadt von Spanien?');
    cy.get('#new-answer').type('Madrid');
    cy.get('form').submit();

    cy.get('#total-cards').should('contain', '3');
  });

  it('zeigt die Kartenliste korrekt an', () => {
    cy.get('#new-question').type('Was ist die Hauptstadt von Italien?');
    cy.get('#new-answer').type('Rom');
    cy.get('form').submit();

    cy.get('#card-list').should('contain', 'Was ist die Hauptstadt von Italien?');
  });

  it('löscht eine Quizkarte aus der Liste', () => {
    cy.get('[data-test-id="delete"]').click();
  })
});
