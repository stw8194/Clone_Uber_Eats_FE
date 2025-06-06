/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("assertDeactivatedButton", () => {
  cy.findByRole("button").should("have.class", "pointer-events-none");
});

Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.cuber-token").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.cuber-token").should("be.undefined");
});

Cypress.Commands.add("assertTitle", (title: string) => {
  cy.title().should("eq", `${title} | CUber Eats`);
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.assertLoggedOut();
  cy.url().should("match", /\/$/);
  cy.assertTitle("Login");
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);
  cy.findByRole("button")
    .click()
    .should("not.have.class", "pointer-events-none");
  cy.assertLoggedIn();
});
