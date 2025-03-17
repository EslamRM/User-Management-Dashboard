/// <reference types="cypress" />
describe('User Management', () => {
    beforeEach(() => {
      // Mock API responses
      cy.intercept('GET', '**/api/users*', {
        statusCode: 200,
        body: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-02-01' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', dateJoined: '2023-03-01' }
          ],
          total: 3
        }
      }).as('getUsers');
  
      cy.intercept('GET', '**/api/roles', {
        statusCode: 200,
        body: ['Admin', 'Manager', 'Viewer']
      }).as('getRoles');
  
      // Mock auth user (as admin to have full access)
      cy.window().then((win) => {
        win.localStorage.setItem('auth', JSON.stringify({ 
          user: { id: 1, name: 'Test Admin', role: 'Admin' },
          isAdmin: true,
          isManager: false,
          isViewer: false
        }));
      });
  
      // Visit the users page
      cy.visit('/users', { failOnStatusCode: false });
      cy.wait('@getUsers', { timeout: 10000 });
    });
  
    describe('User List', () => {
      it('displays the user list correctly', () => {
        cy.get('h2').should('contain', 'User Management');
        cy.get('.user-list').should('exist');
        
        // Check if table has correct number of rows
        cy.get('table tbody tr').should('have.length', 3);
        
        // Verify first user data
        cy.get('table tbody tr').first().within(() => {
          cy.contains('John Doe');
          cy.contains('john@example.com');
          cy.contains('Admin');
          cy.contains('Active');
        });
      });
  
      it('filters users by search query', () => {
        // Mock filtered API response
        cy.intercept('GET', '**/api/users*', {
          statusCode: 200,
          body: {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
            ],
            total: 1
          }
        }).as('filteredUsers');
  
        // Type in search query
        cy.get('input[type="search"]').type('John');
        cy.wait('@filteredUsers');
        
        // Verify filtered results
        cy.get('table tbody tr').should('have.length', 1);
        cy.contains('John Doe');
      });
  
      it('filters users by role', () => {
        // Mock filtered API response
        cy.intercept('GET', '**/api/users*', {
          statusCode: 200,
          body: {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
            ],
            total: 1
          }
        }).as('filteredUsers');
  
        // Select role filter
        cy.get('select').first().select('Admin');
        cy.wait('@filteredUsers');
        
        // Verify filtered results
        cy.get('table tbody tr').should('have.length', 1);
        cy.contains('Admin');
      });
  
      it('filters users by status', () => {
        // Mock filtered API response
        cy.intercept('GET', '**/api/users*', {
          statusCode: 200,
          body: {
            users: [
              { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', dateJoined: '2023-03-01' }
            ],
            total: 1
          }
        }).as('filteredUsers');
  
        // Select status filter
        cy.get('select').eq(1).select('Inactive');
        cy.wait('@filteredUsers');
        
        // Verify filtered results
        cy.get('table tbody tr').should('have.length', 1);
        cy.contains('Inactive');
      });
  
      it('sorts users by clicking column headers', () => {
        // Mock sorted API response for ascending
        const mockSortedAsc = {
          statusCode: 200,
          body: {
            users: [
              { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', dateJoined: '2023-03-01' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-02-01' },
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
            ],
            total: 3
          }
        };
  
        // Mock sorted API response for descending
        const mockSortedDesc = {
          statusCode: 200,
          body: {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-02-01' },
              { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', dateJoined: '2023-03-01' }
            ],
            total: 3
          }
        };
  
        // Mock API for sort requests
        cy.intercept('GET', '**/api/users*', (req) => {
          if (req.url.includes('sortBy=name') && req.url.includes('sortOrder=asc')) {
            req.reply(mockSortedAsc);
          } else if (req.url.includes('sortBy=name') && req.url.includes('sortOrder=desc')) {
            req.reply(mockSortedDesc);
          }
        }).as('sortUsers');
  
        // Click on name column header for ascending sort
        cy.contains('th', 'Name').click();
        cy.wait('@sortUsers');
        
        // Verify first row is Bob after sorting
        cy.get('table tbody tr').first().should('contain', 'Bob Johnson');
        
        // Click on name column header again for descending sort
        cy.contains('th', 'Name').click();
        cy.wait('@sortUsers');
        
        // Verify first row is John after reverse sorting
        cy.get('table tbody tr').first().should('contain', 'John Doe');
      });
  
      it('navigates through pagination', () => {
        // Mock second page API response
        cy.intercept('GET', '**/api/users*', {
          statusCode: 200,
          body: {
            users: [
              { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-04-01' },
              { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'Viewer', status: 'Active', dateJoined: '2023-05-01' }
            ],
            total: 5
          }
        }).as('getPage2');
  
        // Update total for pagination
        cy.window().then((win) => {
          win.document.querySelector('.pagination')?.setAttribute('data-total-pages', '2');
        });
  
        // Click on "Next" page button
        cy.contains('button', 'Next').click();
        cy.wait('@getPage2');
        
        // Verify page 2 content
        cy.get('table tbody tr').should('have.length', 2);
        cy.contains('Sarah Williams');
      });
  
      it('shows error message when API fails', () => {
        // Mock API failure
        cy.intercept('GET', '**/api/users*', {
          statusCode: 500,
          body: { error: 'Internal Server Error' }
        }).as('apiError');
        
        // Reload page to trigger API error
        cy.reload();
        cy.wait('@apiError');
        
        // Check error message
        cy.get('.error').should('contain', 'Failed to load users');
      });
  
      it('navigates to user details page when edit button is clicked', () => {
        // Mock user details API response
        cy.intercept('GET', '**/api/users/1', {
          statusCode: 200,
          body: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
        }).as('getUserDetails');
        
        // Click edit button on first row
        cy.get('table tbody tr').first().find('button').contains('Edit').click();
        
        // Verify navigation to details page
        cy.url().should('include', '/users/1');
      });
  
      it('removes user when delete button is clicked', () => {
        // Mock delete API response
        cy.intercept('DELETE', '**/api/users/3', {
          statusCode: 200,
          body: { success: true }
        }).as('deleteUser');
        
        // Mock updated users list after deletion
        cy.intercept('GET', '**/api/users*', {
          statusCode: 200,
          body: {
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-02-01' }
            ],
            total: 2
          }
        }).as('getUsersAfterDelete');
        
        // Find row with Bob Johnson and click delete
        cy.contains('tr', 'Bob Johnson').find('button').contains('Delete').click();
        cy.wait('@deleteUser');
        cy.wait('@getUsersAfterDelete');
        
        // Verify user was removed
        cy.get('table tbody tr').should('have.length', 2);
        cy.contains('Bob Johnson').should('not.exist');
      });
    });
  });
  
  // cypress/e2e/user-details.cy.ts
  
  describe('User Details', () => {
    beforeEach(() => {
      // Mock user details API response
      cy.intercept('GET', '**/api/users/1', {
        statusCode: 200,
        body: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
      }).as('getUserDetails');
  
      cy.intercept('GET', '**/api/roles', {
        statusCode: 200,
        body: ['Admin', 'Manager', 'Viewer']
      }).as('getRoles');
  
      // Mock auth user (as admin to have full access)
      cy.window().then((win) => {
        win.localStorage.setItem('auth', JSON.stringify({ 
          user: { id: 1, name: 'Test Admin', role: 'Admin' },
          isAdmin: true,
          isManager: false,
          isViewer: false
        }));
      });
  
      // Visit the user details page
      cy.visit('/users/1', { failOnStatusCode: false });
      cy.wait('@getUserDetails', { timeout: 10000 });
    });
  
    it('displays user details correctly', () => {
      cy.get('h2').should('contain', 'User Details');
      
      // Verify user info
      cy.contains('John Doe');
      cy.contains('john@example.com');
      cy.contains('Admin');
      cy.contains('Active');
      cy.contains('Date Joined:');
      cy.contains('1/1/2023');
    });
  
    it('allows editing user details', () => {
      // Mock update API response
      cy.intercept('PUT', '**/api/users/1', {
        statusCode: 200,
        body: { id: 1, name: 'John Updated', email: 'john.updated@example.com', role: 'Manager', status: 'Active', dateJoined: '2023-01-01' }
      }).as('updateUser');
  
      // Click edit button
      cy.contains('button', 'Edit').click();
      
      // Verify form appears
      cy.get('input[label="Name"]').should('exist');
      cy.get('input[label="Email"]').should('exist');
      cy.get('select').should('have.length', 2);
      
      // Update form fields
      cy.get('input[label="Name"]').clear().type('John Updated');
      cy.get('input[label="Email"]').clear().type('john.updated@example.com');
      cy.get('select').first().select('Manager');
      
      // Save changes
      cy.contains('button', 'Save').click();
      cy.wait('@updateUser');
      
      // Verify updated info is displayed
      cy.contains('John Updated');
      cy.contains('john.updated@example.com');
      cy.contains('Manager');
    });
  
    it('validates required fields during edit', () => {
      // Click edit button
      cy.contains('button', 'Edit').click();
      
      // Clear required fields
      cy.get('input[label="Name"]').clear();
      cy.get('input[label="Email"]').clear();
      
      // Try to save
      cy.contains('button', 'Save').click();
      
      // Check error message
      cy.contains('Name and email cannot be empty');
      
      // Verify we're still in edit mode
      cy.get('input[label="Name"]').should('exist');
    });
  
    it('cancels edit mode without saving changes', () => {
      // Click edit button
      cy.contains('button', 'Edit').click();
      
      // Change some fields
      cy.get('input[label="Name"]').clear().type('Temp Name');
      cy.get('input[label="Email"]').clear().type('temp@example.com');
      
      // Click cancel
      cy.contains('button', 'Cancel').click();
      
      // Verify original values are still displayed
      cy.contains('John Doe');
      cy.contains('john@example.com');
    });
  
    it('deletes user and redirects to user list', () => {
      // Mock delete API response
      cy.intercept('DELETE', '**/api/users/1', {
        statusCode: 200,
        body: { success: true }
      }).as('deleteUser');
      
      // Click delete button
      cy.contains('button', 'Delete').click();
      
      // Confirm deletion in dialog
      cy.get('.dialog').should('exist');
      cy.contains('Are you sure you want to delete this user?');
      cy.contains('button', 'Confirm').click();
      cy.wait('@deleteUser');
      
      // Verify redirection to users list
      cy.url().should('include', '/users');
      cy.url().should('not.include', '/users/1');
    });
  
    it('shows loading state while fetching user details', () => {
      // Mock loading state
      cy.intercept('GET', '**/api/users/1', {
        statusCode: 200,
        body: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-01' }
      }).as('getUserDetails');
      
      // Visit the user details page
      cy.visit('/users/1', { failOnStatusCode: false });
      
      // Check loading state
      cy.get('.loading').should('exist');
      cy.wait('@getUserDetails', { timeout: 10000 });
      cy.get('.loading').should('not.exist');
    });
  });
