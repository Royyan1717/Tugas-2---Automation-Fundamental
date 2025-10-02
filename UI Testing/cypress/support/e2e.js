// cypress/support/e2e.js
// This is processed automatically before your test files.
// You can put global configuration or hooks here.

beforeEach(() => {
  // contoh: reset localStorage kalau mau
  cy.clearLocalStorage();
});
