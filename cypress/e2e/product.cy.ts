describe('Product List Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
    
    it('should display a list of products', () => {
      cy.visit('http://localhost:3000/products');
      // Wait for products to be fetched and rendered
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    });
  
    it('should display product details correctly', () => {
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('exist');
        cy.get('[data-testid="product-price"]').should('exist');
        cy.get('[data-testid="product-image"]').should('exist');
      });
    });
  });
  

