import Page, { PageElement } from './page'

export default class AuthSignInPage extends Page {
  constructor() {
    super('Sign in')
  }

  usernameInput = (): PageElement => cy.get('#username')

  passwordInput = (): PageElement => cy.get('#password')

  signInButton = (): PageElement => cy.get('#submit')
}
