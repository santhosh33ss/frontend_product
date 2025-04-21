/// <reference types="cypress" />

// / <reference types="cypress" />

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Adjust if your login path is different
    });
  
    it('should allow a user to log in', () => {
        const email = 'test@example.com';
        const password = 'password123';
    
        cy.visit('http://localhost:3000/login');
    
        // Use data-testid to select inputs
        cy.get('[data-testid="email-input"]').type(email);
        cy.get('[data-testid="password-input"]').type(password);
    
        // Click the login button
        cy.get('button[type="submit"]').click();
    
        // Expect to be redirected to /products
        cy.url().should('not.include', '/products');
      });
  
    it('should show error message on invalid login', () => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';
  
      // Fill in the invalid credentials
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="password-input"]').type(password);
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that an error alert appears
      cy.get('.MuiAlert-root', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Invalid'); // Update this based on your actual error message
    });
  });
  