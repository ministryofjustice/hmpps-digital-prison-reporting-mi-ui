import IndexPage from '../pages/index'
import Page from '../pages/page'
import ReportsPage from '../pages/reports'
import ExternalMovementsPage from '../pages/ExternalMovementsPage'

function goToExternalMovementsPage() {
  cy.signIn()
  const indexPage = Page.verifyOnPage(IndexPage)
  indexPage.reportsCard().click()
  const reportsPage = Page.verifyOnPage(ReportsPage)
  reportsPage.externalMovementsCard().click()
  return Page.verifyOnPage(ExternalMovementsPage)
}

const columns = 9

context('View external movements report', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubExternalMovements')
    cy.task('stubExternalMovementsCount')
  })

  it('Displays', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    externalMovementsPage.dataTable().get('th').should('have.length', columns)
  })

  it('Displays correctly mapped data', () => {
    const externalMovementsPage = goToExternalMovementsPage()
    const cells = externalMovementsPage.dataTable().get('td')
    cells.should('have.length', columns * 3)
    cells.should('contain.text', 'N9980PJ')
    cells.should('contain.text', '31/01/2023')
  })

  it('Displays correct default paging options', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const paging = externalMovementsPage.paging()

    // 1, 2, ..., 5, Next
    paging.get('.govuk-pagination__link').should('have.length', 4)
  })

  it('Next page link works as expected', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const paging = externalMovementsPage.paging()

    paging.get('.govuk-pagination__link[rel=Next]').click()

    // Previous, 1, 2, 3, ..., 5, Next
    paging.get('.govuk-pagination__link').should('have.length', 6)
  })

  it('Previous page link works as expected', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const paging = externalMovementsPage.paging()

    paging.get('.govuk-pagination__link[rel=Next]').click()
    paging.get('.govuk-pagination__link[rel=Prev]').click()

    // 1, 2, ..., 5, Next
    paging.get('.govuk-pagination__link').should('have.length', 4)
  })

  it('Displays correct default sorting options', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const dataTable = externalMovementsPage.dataTable()

    dataTable
      .get(`.data-table-header-button[data-column=prisonNumber]`)
      .should('have.class', 'data-table-header-button-sort-ascending')
  })

  it('Reverses sorting when currently sorted column header clicked', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const dataTable = externalMovementsPage.dataTable()

    const defaultSortColumnSelector = `.data-table-header-button[data-column=prisonNumber]`

    dataTable.get(defaultSortColumnSelector).click()
    dataTable.get(defaultSortColumnSelector).should('have.class', 'data-table-header-button-sort-descending')
  })

  it('Displays correct sorting when another column header is clicked', () => {
    const externalMovementsPage = goToExternalMovementsPage()

    const dataTable = externalMovementsPage.dataTable()

    const defaultSortColumnSelector = `.data-table-header-button[data-column=prisonNumber]`
    const anotherSortColumnSelector = `.data-table-header-button[data-column=date]`

    dataTable.get(anotherSortColumnSelector).click()

    dataTable.get(defaultSortColumnSelector).should('have.class', 'data-table-header-button-sort-none')
    dataTable.get(anotherSortColumnSelector).should('have.class', 'data-table-header-button-sort-ascending')
  })
})
