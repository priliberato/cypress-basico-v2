/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => { 
        const longText = 'teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        cy.get('#firstName').type('priscilla') // o caracter # identifica que é um id
        cy.get('#lastName').type('braga')
        cy.get('#email').type('priscilla@exemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 }) // delay padrão é 10ms, a gente coloca um 2º argumento(delay) para ao digitar o texto longo não haver demora na execução do teste
        cy.contains('button', 'Enviar').click() // quando é uma classe coloca um ., ex .button, mas quando é pela propriedade faz como foi colocado
    
        cy.get('.success').should('be.visible') // .sucess é uma classe, da mensagem que aparece ao clicar o botão enviar.
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', ()=> {
        cy.get('#firstName').type('priscilla') 
        cy.get('#lastName').type('braga')
        cy.get('#email').type('priscilla-exemplo.com')
        cy.get('#open-text-area').type('teste') 
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Campo de telefone continua vazio quando preenchido com valor não numérico', ()=> {
        cy.get('#phone')
            .type('abcdef')
            .should('have.value', '') //deve(should), haver um valor vazio(string vazia'')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', ()=>{
        cy.get('#firstName').type('priscilla') 
        cy.get('#lastName').type('braga')
        cy.get('#email').type('priscilla@exemplo.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste') 
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', ()=> {
        cy.get('#firstName') //busca campo
            .type('priscilla') //escreve priscilla
            .should('have.value', 'priscilla') // verifica se contem o valor priscilla no campo
            .clear() // limpa o campo
            .should('have.value', '') // verifica se o campo ta limpo passando uma string vazia
        cy.get('#lastName') 
            .type('braga') 
            .should('have.value', 'braga') 
            .clear() 
            .should('have.value', '')
        cy.get('#email') 
            .type('priscilla@exemplo.com') 
            .should('have.value', 'priscilla@exemplo.com') 
            .clear() 
            .should('have.value', '')
        cy.get('#email') 
            .type('priscilla@exemplo.com') 
            .should('have.value', 'priscilla@exemplo.com') 
            .clear() 
            .should('have.value', '')
        cy.get('#phone') 
            .type('123456789') 
            .should('have.value', '123456789') 
            .clear() 
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', ()=>{
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado-2', ()=> { //igual ao primeiro teste, porém com código customizado
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto-3', ()=>{ 
        cy.get('#product')
            .select('YouTube') //selecionando produto pelo texto
            .should('have.value', 'youtube') //youtube com letra minúscula, pois sempre se refere ao value encontrado no codigo html.
        
    })

    it('seleciona um produto (Mentoria) por seu valor-3', ()=>{  
        cy.get('#product')
            .select('mentoria') //selecionando produto pelo value(ver código html)
            .should('have.value', 'mentoria')     
    })

    it('seleciona um produto (Blog) por seu indice-3', ()=>{  
        cy.get('#product')
            .select(1) //selecionando produto pelo índice(JS lista inicia pelo indice 0), blog é o segundo item da lista(indice 1)
            .should('have.value','blog') 
    }) 
    
    it('marca o tipo de atendimento "Feedback"-4', ()=>{
        cy.get('input[type="radio"][value="feedback"]') //busca pela opção específica de feecback do tipo radio
            .check() //entradas tipo radio e checkbox
            .should('have.value', 'feedback') //validação
    })

    it('marca cada tipo de atendimento-4', ()=>{
        cy.get('input[type="radio"]') //seleciona todos os tipos de atendimento(são 3 tipos)
            .should('have.length', 3) // comprimento(length) da lista , verifica que são 3 itens.
            .each(function($radio){ // pega cada(each) um dos elementos(função que recebe cada um dos elementos radio)
                cy.wrap($radio).check() //empacota cada um dos radio(wrap) e dá um check, marca todos
                cy.wrap($radio).should('be.checked') // verifica se todos forma marcados
            }) 
    })

    it('marca ambos checkboxes, depois desmarca o último-5', ()=>{
        cy.get('input[type="checkbox"]') //busca todas as opções do tipo checkbox
            .check() //marca as opções
            .should('be.checked') //verifica se está selecionada
            .last() //seleciona o ultimo elemento
            .uncheck() //desmarca
            .should('not.be.checked') //verifica se está desmarcado
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário-5',()=>{
        cy.get('#phone-checkbox').check()
       
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('seleciona um arquivo da pasta fixtures-6', ()=>{
        cy.get('#file-upload') //busca o botão 
            .should('not.have.value') // verifica que não há arquivos selecionados
            .selectFile('./cypress/fixtures/example.json') //seleciona um arquivo e faz o upload
            .should(function($input){ //verificando se foi realmente selecionado
                expect($input[0].files[0].name).to.equal('example.json') // indice 0 pq é o primeiro elemento
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop-6', ()=>{
        cy.get('#file-upload')
            .should('not.have.value') 
            .selectFile('./cypress/fixtures/example.json', {action:'drag-drop'}) //passando esse segundo argumento, está simulando que estamos arrastando o arquivo do desktop pra dentro do botao
            .should(function($input){ 
                expect($input[0].files[0].name).to.equal('example.json') 
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias-6',()=>{
        cy.fixture('example.json').as('sampleFile') //cy.fixture é uma propriedade para chamar o arquivo usando as, sem precisar escrever todo caminho no selectFile
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should(function($input){ 
            expect($input[0].files[0].name).to.equal('example.json') 
            })  
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique-7', ()=>{
        cy.get('#privacy a')//#privacy é a divo a é pra chamar o a dentro dessa div. se um elemento do tipo âncora(a) possui o atributo targetcom o valor _blank, quando clicado, obrigatoriamente o valor do atributo hrefserá aberto em uma nova aba(padrão do navegador)
            .should('have.attr', 'target', '_blank') // 3 atributos: verifica se tem o atributo(have.attr), do tipo target, com valor do target _blank.
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link-7', ()=>{
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //cypress não reconhece quando se abre em outra aba, então o target é removido para as informações abrirem na mesma aba e o cypress reconhecer e poder fazer a verificação
            .click()

        cy.contains('Talking About Testing').should('be.visible')
        })

  })
  