it('testa a página da política de privacidade de forma independente-7', ()=>{
    cy.visit('./src/privacy.html')

    cy.contains('Talking About Testing').should('be.visible')
        
})
