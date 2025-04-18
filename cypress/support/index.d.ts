declare namespace Cypress {
  interface Chainable {
    assertDeactivatedButton(): Chainable<void>;
    assertLoggedIn(): Chainable<void>;
    assertLoggedOut(): Chainable<void>;
    assertTitle(title: string): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
  }
}
