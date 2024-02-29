import { PageElement } from './page'

export default class ErrorPage {
  messageHeader = (): PageElement => cy.get('h2')

  statusCodeHeader = (): PageElement => cy.get('h3')
}
