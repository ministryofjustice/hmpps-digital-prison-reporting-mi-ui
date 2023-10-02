import Page, { PageElement } from './page'

export default class ListPage extends Page {
  constructor(title) {
    super(title)
  }

  showFilterButton = (): PageElement => cy.get(`.filter-summary-show-filter-button`)

  clearAllButton = (): PageElement => cy.get(`.moj-button-menu__wrapper .govuk-button--primary`)

  pageSizeSelector = (): PageElement => cy.get('#pageSize')

  filterPanel = (): PageElement => cy.get('.moj-filter')
}
