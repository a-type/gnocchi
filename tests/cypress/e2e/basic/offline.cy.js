/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('aglio offline', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
		cy.clearIndexedDB();
		cy.get('[data-test=get-started]').click();
	});

	it('loads the page', () => {
		cy.get('[data-test="grocery-list-add-input"]').should('have.length', 1);
	});

	it('can add new grocery items', () => {
		const newItem = 'garlic';
		cy.get('[data-test=grocery-list-add-input]').type(`${newItem}{enter}`);
		cy.get('[data-test=grocery-list-item]')
			.should('have.length', 1)
			.last()
			.should('have.text', newItem);
	});

	it('can check off an item as purchased', () => {
		const newItem = 'garlic';
		cy.get('[data-test=grocery-list-add-input]').type(`${newItem}{enter}`);
		cy.contains(newItem)
			.parent()
			.find('[data-test=grocery-list-item-checkbox]')
			.click();
		cy.contains(newItem).should('not.exist');
	});
});
