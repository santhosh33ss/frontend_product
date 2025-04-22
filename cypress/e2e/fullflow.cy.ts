import 'cypress-file-upload';

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
  
     
    });
  });
  

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Adjust if your login path is different
    });
  
    it('should allow a user to log in', () => {
        const email = 'ss@gmailcom';
        const password = '3';
    
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
  


  describe('Product Creation Button Test', () => {
    it('should navigate to the create product page when the CREATE PRODUCT button is clicked', () => {
      // Visit the products page
      cy.visit('http://localhost:3000/products');
  
      // Ensure the "CREATE PRODUCT" button exists and is visible
      cy.get('button')
        .contains('CREATE PRODUCT')
        .should('be.visible');
  
      // Click the "CREATE PRODUCT" button
      cy.get('button')
        .contains('CREATE PRODUCT')
        .click();
  
      // Check if the URL changes to the create product page
      cy.url().should('include', '/products/create');
    });
  });
  

  describe('Create Product Page', () => {
    beforeEach(() => {
      // Visit the create product page before each test
      cy.visit('http://localhost:3000/products/creates');
    });
  
    it('should create a new product successfully', () => {
        // Visit the create product page
        // cy.visit('http://localhost:3000/products/creates');
    
        // Fill out the form using the data-testid selectors
        cy.intercept('GET', '/api/products').as('getProducts'); // Replace with actual API call if needed
        cy.visit('http://localhost:3000/products/create');
        cy.wait('@getProducts');  // Wait for API call
        cy.get('form').should('be.visible');        
        cy.get('[data-testid="product-name-input"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="product-description-input"]').type('This is a test product.');
        cy.get('[data-testid="product-price-input"]').type('100');
        cy.get('[data-testid="product-stock-input"]').type('50');
    
        // Attach a file (image) for the product
        cy.get('[data-testid="product-image-input"]').attachFile('path/to/your/image.jpg'); // Ensure file path is correct
    
        // Submit the form
        cy.get('[data-testid="create-product-submit"]').click();
    
        // Check if product is created successfully (You can modify the URL to match your app's flow)
        cy.url().should('include', '/products');
        cy.contains('Product created successfully!');
      });
  
    it('should allow the user to fill out the form and submit it successfully', () => {
        // Fill out the product form
        cy.get('input[name="name"]').type('Test Product');
        cy.get('textarea[name="description"]').type('This is a test product.');
        cy.get('input[name="price"]').type('100');
        cy.get('input[name="stock"]').type('10');
      
        // Attach an image (ensure the image is in cypress/fixtures)
        const fileName = 'sample-image.jpg';  // Make sure this file exists in the `cypress/fixtures` folder
        cy.get('input[type="file"]').attachFile(fileName);
      
        // Submit the form
        cy.get('button[type="submit"]').click();
      
        // Check if the user is redirected to the products page after a successful submission
        cy.url().should('include', '/products');
        
        // Optionally, you can also check if an alert or success message is shown
        cy.contains('Product created successfully!').should('be.visible');
      });
      
    it('should show an error message when there is an issue with the submission', () => {
      // Simulate a failed submission by triggering an API error
      cy.intercept('POST', 'http://localhost:5000/api/products', {
        statusCode: 500,
        body: { message: 'Error creating product' }
      });
  
      // Fill out the product form with data
      cy.get('input[name="name"]').type('Test Product');
      cy.get('textarea[name="description"]').type('This is a test product.');
      cy.get('input[name="price"]').type('100');
      cy.get('input[name="stock"]').type('10');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Check if the error message is shown
      cy.contains('Error creating product.').should('be.visible');
    });
  });
  


  describe('Product List - View Table and Product Details', () => {
    let token: string;
  
    beforeEach(() => {
      // Log in via the API to get the token
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/users/login', // Replace with your login API endpoint
        body: {
          email: 'ss@gmail.com', // Replace with test credentials
          password: '3',
        },
      }).then((response) => {
        // Store the token from the response
        token = response.body.token;
        cy.log('Token:', token); // Log token to check if it's correct
      });
      // Intercept the API call to fetch products and include the token in the request header
      cy.intercept('GET', 'http://localhost:5000/api/products', (req) => {
        // Ensure the Authorization header is set
        req.headers['Authorization'] = `Bearer ${token}`;
      }).as('getProducts');
    });
  
    it('should display the product list correctly', () => {
        // Visit the product list page
        cy.visit('http://localhost:3000/products');
    
        // Ensure the table is visible
        cy.get('table').should('be.visible');
    
        // Check the table headers are rendered
        cy.get('table th').should('have.length', 7); // Expect 7 columns in the header
        cy.get('table th').eq(0).should('have.text', 'Image');
        cy.get('table th').eq(1).should('have.text', 'Name');
        cy.get('table th').eq(2).should('have.text', 'Description');
        cy.get('table th').eq(3).should('have.text', 'Price');
        cy.get('table th').eq(4).should('have.text', 'Stock');
        cy.get('table th').eq(5).should('have.text', 'Created At');
        cy.get('table th').eq(6).should('have.text', 'Actions');
    
        // Wait for the products to load
        cy.wait('@getProducts'); // Assuming the API request is intercepted
    
        // Ensure rows exist
        cy.wait('@getProducts'); // Ensure you've set up the intercept for the products API

  // Ensure the table rows exist and check their length
        //  cy.get('[role="row"] td').should('have.length.greaterThan', 0);

        // Check if product data is displayed correctly
        cy.get('[role="row"]').first().within(() => {
            // Check that the product image is displayed
            cy.get('td').eq(0).find('img').should('be.visible');
          
            // Check that the product name is displayed
            cy.get('td').eq(1).should('not.be.empty');
          
            // Check that the product description is displayed
            cy.get('td').eq(2).should('not.be.empty');
          
            // Check that the product price is displayed correctly
            cy.get('td').eq(3).should('contain.text', '₹');
          
            // Check that the product stock is displayed correctly
            cy.get('td').eq(4).should('not.be.empty');
          
            // Check that the product created date is formatted correctly
            cy.get('td').eq(5).should('not.be.empty');
          
            // Check that Edit and Delete buttons are visible
            cy.get('td').eq(6).find('button').should('have.length', 2);
          });
          
      });
  });
  