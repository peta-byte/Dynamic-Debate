describe('Debate app should', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/');
        cy.get('#submit').click();
    });

    it('allow a user to submit debate options', () => {     
      cy.get('.motion > h1').should('contain', 'Coffee vs Tea');
      cy.get('.motion > p').should('contain', 'Which is better for breakfast?');
    });
    
    it('allow a user to start the timer', () => {
      cy.get('.timer-container').scrollIntoView();
      cy.get('.timer-container > .timer-card > .timer').should('contain', '3:00');
      cy.get('.timer-container > .timer-card > .timer-buttons').find('button').as('btns');
      cy.get('@btns').eq(0).should('contain', 'Start').click();
      cy.get('@btns').eq(0).should('contain', 'Pause');
    });

    it('allow a user to pause the timer', () => {
      cy.get('.timer-container').scrollIntoView();
      cy.get('.timer-container > .timer-card > .timer').should('contain', '3:00');
      cy.get('.timer-container > .timer-card > .timer-buttons').find('button').as('btns');
      cy.get('@btns').eq(0).should('contain', 'Start').click();
      cy.get('@btns').eq(0).should('contain', 'Pause').click();
      cy.get('@btns').eq(0).should('contain', 'Start');
    });

    it('allow a user to stop the timer', () => {
      cy.get('.timer-container').scrollIntoView();
      cy.get('.timer-container > .timer-card > .timer').should('contain', '3:00');
      cy.get('.timer-container > .timer-card > .timer-buttons').find('button').as('btns');
      cy.get('@btns').eq(0).should('contain', 'Start').click();
      cy.wait(2000);
      cy.get('@btns').eq(1).should('contain', 'Stop').click();
      cy.get('.timer-container > .timer-card > .timer').should('contain', '3:00');
    });

    it('allow a user to add to the proposition tally', () => {
      cy.get('.panel-container').scrollIntoView();
      cy.get('.panel-container').find('.tally-panel').as('panels');
      cy.get('@panels').eq(0).then(() => {
        cy.get('h2').should('contain', 'Proposition Tally');
        cy.get('.tally-buttons').find('button').as('btns');
        cy.get('@btns').eq(0).should('contain', 'Add').click();
        cy.get('.tally').should('contain', '10');
      });
    });

    it('allow a user to deduct from the proposition tally', () => {
      cy.get('.panel-container').scrollIntoView();
      cy.get('.panel-container').find('.tally-panel').as('panels');
      cy.get('@panels').eq(0).then(() => {
        cy.get('h2').should('contain', 'Proposition Tally');
        cy.get('.tally-buttons').find('button').as('btns');
        cy.get('@btns').eq(0).should('contain', 'Add').click();
        cy.get('.tally').should('contain', '10');
        cy.get('@btns').eq(1).should('contain', 'Deduct').click();
        cy.get('.tally').should('contain', '0');
      });
    });

    it('allow a user to add to the opposition tally', () => {
      cy.get('.panel-container').scrollIntoView();
      cy.get('.panel-container').find('.tally-panel').as('panels');
      cy.get('@panels').eq(1).then(() => {
        cy.get('h2').should('contain', 'Opposition Tally');
        cy.get('.tally-buttons').find('button').as('btns');
        cy.get('@btns').eq(0).should('contain', 'Add').click();
        cy.get('.tally').should('contain', '10');
      });
    });

    it('allow a user to deduct from the opposition tally', () => {
      cy.get('.panel-container').scrollIntoView();
      cy.get('.panel-container').find('.tally-panel').as('panels');
      cy.get('@panels').eq(1).then(() => {
        cy.get('h2').should('contain', 'Opposition Tally');
        cy.get('.tally-buttons').find('button').as('btns');
        cy.get('@btns').eq(0).should('contain', 'Add').click();
        cy.get('.tally').should('contain', '10');
        cy.get('@btns').eq(1).should('contain', 'Deduct').click();
        cy.get('.tally').should('contain', '0');
      });
    });
});
