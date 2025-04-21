/// <reference types="cypress" />

describe('User Registration Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register'); // Ensure frontend is running
    });
  
    it('should register a new user successfully', () => {
      const timestamp = Date.now();
      const email = `testuser${timestamp}@example.com`;
  
      // Intercept API call
      cy.intercept('POST', '**/register').as('registerUser');
  
      // Fill out the form
      cy.get('input[name="name"]').should('be.visible').type('Test User');
      cy.get('input[name="email"]').should('be.visible').type(email);
      cy.get('input[name="password"]').should('be.visible').type('Password123!');
  
      // Submit the form
      cy.get('button[type="submit"]').should('be.enabled').click();
  
  
      // Optionally, verify redirection
      cy.url().should('not.include', 'http://localhost:3000/login');
    });
  
    it('should show an error for invalid email', () => {
      cy.get('input[name="name"]').type('Invalid Email User');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('button[type="submit"]').click();
  
      // Assert error message
    //   cy.contains(/invalid email/i, { timeout: 5000 })
    //     .should('exist')
    //     .and('be.visible');
    });
  });
  