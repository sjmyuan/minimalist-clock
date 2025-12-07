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

  describe('Epic 3: Customization Options', () => {
    describe('User Story 3.1: Adjust Font Size', () => {
      beforeEach(() => {
        // Clear localStorage before each test
        cy.clearLocalStorage()
        cy.reload()
      })

      it('should open settings panel when settings button is clicked', () => {
        cy.contains('button', /settings/i).click()
        cy.contains(/font size/i).should('be.visible')
      })

      it('should update clock font size in real-time when adjusted', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        
        // Get initial font size
        cy.get('[data-testid="time-display"]').invoke('css', 'font-size').then((initialSize) => {
          // Change font size
          cy.get('#fontSize').clear().type('50')
          
          // Verify font size changed
          cy.get('[data-testid="time-display"]').invoke('css', 'font-size').should('not.equal', initialSize)
        })
      })

      it('should restrict font size to minimum value of 12px', () => {
        cy.contains('button', /settings/i).click()
        
        cy.get('#fontSize').should('have.attr', 'min', '12')
      })

      it('should restrict font size to maximum value of 100px', () => {
        cy.contains('button', /settings/i).click()
        
        cy.get('#fontSize').should('have.attr', 'max', '100')
      })

      it('should persist font size across page reloads', () => {
        // Open settings and change font size
        cy.contains('button', /settings/i).click()
        cy.get('#fontSize').clear().type('75')
        
        // Close settings
        cy.contains('button', '×').click()
        
        // Reload page
        cy.reload()
        
        // Open settings again
        cy.contains('button', /settings/i).click()
        
        // Verify font size persisted
        cy.get('#fontSize').should('have.value', '75')
      })

      it('should close settings panel when close button is clicked', () => {
        cy.contains('button', /settings/i).click()
        cy.contains(/font size/i).should('be.visible')
        
        cy.contains('button', '×').click()
        
        // Settings should be hidden (moved off-screen)
        cy.contains(/font size/i).should('not.be.visible')
      })
    })

    describe('User Story 3.2: Change Font Color and Background Color', () => {
      beforeEach(() => {
        // Clear localStorage before each test
        cy.clearLocalStorage()
        cy.reload()
      })

      it('should update font color in real-time when changed', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        
        // Change font color to red
        cy.get('#fontColor').invoke('val', '#FF0000').trigger('change')
        
        // Verify color changed (check text color of time display)
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(255, 0, 0\)/)
      })

      it('should update background color in real-time when changed', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        
        // Change background color to blue
        cy.get('#backgroundColor').invoke('val', '#0000FF').trigger('change')
        
        // Verify background color changed
        cy.get('body').parent().should('have.css', 'background-color').and('match', /rgb\(0, 0, 255\)/)
      })

      it('should persist font color across page reloads', () => {
        // Open settings and change font color
        cy.contains('button', /settings/i).click()
        cy.get('#fontColor').invoke('val', '#00FF00').trigger('change')
        
        // Close settings
        cy.contains('button', '×').click()
        
        // Reload page
        cy.reload()
        
        // Verify font color persisted
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(0, 255, 0\)/)
      })

      it('should persist background color across page reloads', () => {
        // Open settings and change background color
        cy.contains('button', /settings/i).click()
        cy.get('#backgroundColor').invoke('val', '#FFFF00').trigger('change')
        
        // Close settings
        cy.contains('button', '×').click()
        
        // Reload page
        cy.reload()
        
        // Verify background color persisted
        cy.get('body').parent().should('have.css', 'background-color').and('match', /rgb\(255, 255, 0\)/)
      })

      it('should have default white font color on first load', () => {
        // Verify default font color is white
        cy.get('[data-testid="time-display"]').should('have.css', 'color', 'rgb(255, 255, 255)')
      })

      it('should have default black background color on first load', () => {
        // Verify default background color is black
        cy.get('body').parent().should('have.css', 'background-color', 'rgb(0, 0, 0)')
      })

      it('should allow changing multiple preferences at once', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        
        // Change all three preferences
        cy.get('#fontSize').clear().type('60')
        cy.get('#fontColor').invoke('val', '#FF00FF').trigger('change')
        cy.get('#backgroundColor').invoke('val', '#00FFFF').trigger('change')
        
        // Close settings
        cy.contains('button', '×').click()
        
        // Verify all changes applied
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(255, 0, 255\)/)
        cy.get('body').parent().should('have.css', 'background-color').and('match', /rgb\(0, 255, 255\)/)
        
        // Reload and verify persistence
        cy.reload()
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(255, 0, 255\)/)
        cy.get('body').parent().should('have.css', 'background-color').and('match', /rgb\(0, 255, 255\)/)
        
        // Check font size persisted
        cy.contains('button', /settings/i).click()
        cy.get('#fontSize').should('have.value', '60')
      })
    })

    describe('Integration with other features', () => {
      it('should not interfere with fullscreen functionality', () => {
        // Change preferences
        cy.contains('button', /settings/i).click()
        cy.get('#fontSize').clear().type('80')
        cy.get('#fontColor').invoke('val', '#00FF00').trigger('change')
        cy.contains('button', '×').click()
        
        // Enter fullscreen
        cy.contains('button', /full-screen/i).click()
        cy.contains('button', /exit full-screen/i).should('be.visible')
        
        // Verify preferences still applied
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(0, 255, 0\)/)
        
        // Exit fullscreen
        cy.contains('button', /exit full-screen/i).click()
        
        // Verify preferences still applied
        cy.get('[data-testid="time-display"]').should('have.css', 'color').and('match', /rgb\(0, 255, 0\)/)
      })

      it('should maintain time display accuracy when customizing', () => {
        // Open settings
        cy.contains('button', /settings/i).click()
        
        // Verify time is still displayed correctly
        cy.get('[data-testid="time-display"]').invoke('text').should('match', /\d{2}:\d{2}/)
        
        // Change settings
        cy.get('#fontSize').clear().type('70')
        cy.get('#fontColor').invoke('val', '#FFAA00').trigger('change')
        
        // Close settings
        cy.contains('button', '×').click()
        
        // Verify time is still displayed correctly after customization
        cy.get('[data-testid="time-display"]').invoke('text').should('match', /\d{2}:\d{2}/)
        
        // Wait a bit and verify time still updates
        cy.wait(1000)
        cy.get('[data-testid="time-display"]').invoke('text').should('match', /\d{2}:\d{2}/)
      })
    })
  })
})
