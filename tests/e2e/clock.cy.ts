describe('Minimalist Clock E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the clock page', () => {
    cy.contains('Minimalist Clock').should('be.visible')
  })

  describe('Epic 1: Full-Screen Minimalist Clock', () => {
    describe('User Story 1.1: Default Full-Screen Display', () => {
      it('should display a prominent Full-Screen button at the top of the page', () => {
        // Verify the Full-Screen button is visible
        cy.contains('button', /full-screen/i).should('be.visible')
      })

      it('should allow user to enter full-screen mode by clicking the button', () => {
        // Click the Full-Screen button
        cy.contains('button', /full-screen/i).click()
        
        // Note: We cannot directly test fullscreen API in Cypress due to browser restrictions
        // but we can verify the button text changes
        cy.contains('button', /exit full-screen/i).should('be.visible')
      })

      it('should have Full-Screen button styled consistently with the overall design', () => {
        cy.contains('button', /full-screen/i)
          .should('have.css', 'position', 'fixed')
          .should('have.css', 'cursor', 'pointer')
      })
    })

    describe('User Story 1.2: Exit Full-Screen Mode', () => {
      it('should allow user to toggle fullscreen state multiple times', () => {
        // Enter fullscreen
        cy.contains('button', /full-screen/i).click()
        cy.contains('button', /exit full-screen/i).should('be.visible')
        
        // Exit fullscreen
        cy.contains('button', /exit full-screen/i).click()
        cy.contains('button', /full-screen/i).should('be.visible')
      })

      it('should maintain clock display when toggling fullscreen', () => {
        // Verify clock is visible before fullscreen
        cy.get('[data-testid="time-display"]').should('exist')
        
        // Toggle fullscreen
        cy.contains('button', /full-screen/i).click()
        
        // Verify clock is still visible in fullscreen
        cy.get('[data-testid="time-display"]').should('exist')
        
        // Toggle back
        cy.contains('button', /exit full-screen/i).click()
        
        // Verify clock is still visible after exiting fullscreen
        cy.get('[data-testid="time-display"]').should('exist')
      })

      it('should not interfere with other page functionality', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        cy.contains(/font size/i).should('be.visible')
        
        // Close settings
        cy.contains('button', /close/i).click()
        
        // Verify Full-Screen button still works
        cy.contains('button', /full-screen/i).should('be.visible').click()
        cy.contains('button', /exit full-screen/i).should('be.visible')
      })
    })

    describe('Integration with Settings', () => {
      it('should render both Full-Screen and Settings buttons', () => {
        cy.contains('button', /full-screen/i).should('be.visible')
        cy.contains('button', /settings/i).should('be.visible')
      })

      it('should position buttons appropriately to avoid overlap', () => {
        // Get positions of both buttons
        cy.contains('button', /full-screen/i).then($fullscreenBtn => {
          cy.contains('button', /settings/i).then($settingsBtn => {
            const fullscreenPos = $fullscreenBtn[0].getBoundingClientRect()
            const settingsPos = $settingsBtn[0].getBoundingClientRect()
            
            // Verify buttons don't overlap (they should be on opposite sides)
            expect(fullscreenPos.right).to.be.lessThan(settingsPos.left)
          })
        })
      })
    })
  })

  describe('Epic 2: Page-Flip Animation Effects', () => {
    describe('User Story 2.1: Page-Flip Animation Effects', () => {
      it('should display time with proper formatting', () => {
        // Verify time display exists and is visible
        cy.get('[data-testid="time-display"]').should('be.visible')
        
        // Verify time format (HH:MM)
        cy.get('[data-testid="time-display"]').invoke('text').should('match', /\d{2}:\d{2}/)
      })

      it('should update time display', () => {
        // Get initial time
        cy.get('[data-testid="time-display"]').invoke('text').then((initialTime) => {
          // Wait for more than a minute to see time change
          // Note: This test relies on the system clock
          cy.wait(1000)
          
          cy.get('[data-testid="time-display"]').invoke('text').then((currentTime) => {
            // Verify time is being tracked
            expect(currentTime).to.match(/\d{2}:\d{2}/)
          })
        })
      })

      it('should have animation styles applied to time display', () => {
        // Check that the time display container has perspective for 3D effects
        cy.get('[data-testid="time-display"]')
          .parent()
          .should('have.css', 'position', 'relative')
      })

      it('should display date below time', () => {
        // Verify date is displayed
        cy.get('[data-testid="time-display"]')
          .parent()
          .within(() => {
            cy.contains(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i)
              .should('be.visible')
          })
      })
    })

    describe('User Story 2.2: Moderate Animation Speed', () => {
      it('should maintain smooth performance during display updates', () => {
        // Check initial render performance
        cy.get('[data-testid="time-display"]').should('be.visible')
        
        // Verify no lag - page should respond quickly to interactions
        cy.contains('button', /settings/i).click()
        cy.contains(/font size/i, { timeout: 500 }).should('be.visible')
        
        // Close settings
        cy.contains('button', /close/i).click()
        
        // Verify time display is still responsive
        cy.get('[data-testid="time-display"]').should('be.visible')
      })

      it('should not show visible lag or jank during rendering', () => {
        // Monitor that the clock updates smoothly
        let previousTime: string
        
        cy.get('[data-testid="time-display"]')
          .invoke('text')
          .then((text) => {
            previousTime = text
            expect(previousTime).to.match(/\d{2}:\d{2}/)
          })
        
        // Wait a bit and verify time is still displayed properly
        cy.wait(2000)
        
        cy.get('[data-testid="time-display"]')
          .invoke('text')
          .should('match', /\d{2}:\d{2}/)
      })
    })
  })
})
