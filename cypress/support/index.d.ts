declare namespace Cypress {
  interface Chainable {
    assertLoggedIn(): Chainable<void>;
    assertLoggedOut(): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
  }
}
