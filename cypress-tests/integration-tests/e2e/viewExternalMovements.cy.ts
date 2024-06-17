// import IndexPage from '../../common/pages'
// import Page from '../../common/pages/page'
// import ReportsPage from '../../common/pages/ReportsPage'
// import ExternalMovementsPage from '../pages/ExternalMovementsPage'
// import ExternalMovementsLastMonthPage from '../pages/ExternalMovementsLastMonthPage'
//
// function goToExternalMovementsLastMonthPage() {
//   cy.signIn()
//   Page.verifyOnPage(IndexPage).reportsCard().click()
//   Page.verifyOnPage(ReportsPage).externalMovementsCard().click()
//   Page.verifyOnPage(ExternalMovementsPage).externalMovementsLastMonthCard().click()
//   return Page.verifyOnPage(ExternalMovementsLastMonthPage)
// }
//
// const columns = 8
//
// context('View external movements last month list', () => {
//   beforeEach(() => {
//     cy.task('reset')
//     cy.task('stubSignIn')
//     cy.task('stubAuthUser')
//     cy.task('stubExternalMovements')
//     cy.task('stubExternalMovementsCount')
//     cy.task('stubDefinitions')
//     cy.task('stubDefinition')
//     cy.task('stubUserCaseload')
//   })
//
//   it('Displays', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//     externalMovementsLastMonthPage
//       .dataTable()
//       .get('th')
//       .should('have.length', columns + 2) // Plus print header and total cell
//   })
//
//   it('Displays correctly mapped data', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//     const cells = externalMovementsLastMonthPage.dataTable().get('td')
//     cells.should('have.length', columns * 3 + 2)
//     cells.should('contain.text', 'N9980PJ')
//     cells.should('contain.text', '31/01/23')
//   })
//
//   it('Displays correct default paging options', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const paging = externalMovementsLastMonthPage.paging()
//
//     // 1, 2, ..., 5, Next
//     paging.get('.govuk-pagination__link').should('have.length', 4)
//   })
//
//   it('Next page link works as expected', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const paging = externalMovementsLastMonthPage.paging()
//
//     paging.get('.govuk-pagination__link[rel=Next]').click()
//
//     // Previous, 1, 2, 3, ..., 5, Next
//     paging.get('.govuk-pagination__link').should('have.length', 6)
//   })
//
//   it('Previous page link works as expected', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const paging = externalMovementsLastMonthPage.paging()
//
//     paging.get('.govuk-pagination__link[rel=Next]').click()
//     paging.get('.govuk-pagination__link[rel=Prev]').click()
//
//     // 1, 2, ..., 5, Next
//     paging.get('.govuk-pagination__link').should('have.length', 4)
//   })
//
//   it('Displays correct default sorting options', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const dataTable = externalMovementsLastMonthPage.dataTable()
//
//     dataTable
//       .get(`.data-table-header-button[data-column=prisonNumber]`)
//       .should('have.class', 'data-table-header-button-sort-none')
//
//     dataTable
//       .get(`.data-table-header-button[data-column=date]`)
//       .should('have.class', 'data-table-header-button-sort-ascending')
//   })
//
//   it('Reverses sorting when currently sorted column header clicked', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const dataTable = externalMovementsLastMonthPage.dataTable()
//
//     const defaultSortColumnSelector = `.data-table-header-button[data-column=date]`
//
//     dataTable.get(defaultSortColumnSelector).click()
//     dataTable.get(defaultSortColumnSelector).should('have.class', 'data-table-header-button-sort-descending')
//   })
//
//   it('Displays correct sorting when another column header is clicked', () => {
//     const externalMovementsLastMonthPage = goToExternalMovementsLastMonthPage()
//
//     const dataTable = externalMovementsLastMonthPage.dataTable()
//
//     const defaultSortColumnSelector = `.data-table-header-button[data-column=date]`
//     const anotherSortColumnSelector = `.data-table-header-button[data-column=prisonNumber]`
//
//     dataTable.get(anotherSortColumnSelector).click()
//
//     dataTable.get(defaultSortColumnSelector).should('have.class', 'data-table-header-button-sort-none')
//     dataTable.get(anotherSortColumnSelector).should('have.class', 'data-table-header-button-sort-ascending')
//   })
// })
