import * as axe from 'axe-core'
import IndexPage from '../../common/pages'
import Page from '../../common/pages/page'
import RequestPage from '../../common/pages/requestPage'

context('Passes a11y checks', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProductCollections')
    cy.task('stubExternalMovements')
    cy.task('stubDefinitionExternalMovements')
    cy.task('stubExternalMovementsCount')
    cy.task('stubDefinitions')
    cy.task('stubDefinition')
    cy.task('stubUserCaseload')
  })

  function terminalLog(violations: axe.Result[]) {
    const violationData = violations.map(({ id, impact, help, helpUrl, nodes }) => ({
      id,
      impact,
      help,
      helpUrl,
      nodes: nodes.length,
    }))

    if (violationData.length > 0) {
      cy.task('log', 'Violation summary')
      cy.task('table', violationData)

      cy.task('log', 'Violation detail')
      cy.task('log', '----------------')

      violations.forEach(v => {
        v.nodes.forEach(node => {
          cy.task('log', node.failureSummary)
          cy.task('log', `Impact: ${node.impact}`)
          cy.task('log', `Target: ${node.target}`)
          cy.task('log', `HTML: ${node.html}`)
          cy.task('log', '----------------')
        })
      })
    }
  }

  it('Index page', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)

    cy.injectAxe()
    cy.configureAxe({
      rules: [
        {
          id: 'heading-order',
          enabled: false,
        },
      ],
    })
    cy.checkA11y(null, null, terminalLog)
  })

  it('Report request', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage).reportLinks().first().click()
    Page.verifyOnPage(RequestPage)

    cy.injectAxe()
    cy.configureAxe({
      rules: [
        {
          id: 'heading-order',
          enabled: false,
        },
      ],
    })
    cy.checkA11y(null, null, terminalLog)
  })
})
