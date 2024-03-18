/* eslint-disable func-names */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import ListPage from '../pages/ListPage'

const data = [
  {
    column1: 'Eleven',
    column2: 12,
    column3: 'Thirteen',
    column4: '16/12/14',
  },
  {
    column1: 'One',
    column2: 2,
    column3: 'Three',
    column4: '06/05/04',
  },
]

const filterField = {
  name: 'column1',
  display: 'Column 1',
  filter: {
    type: 'Radio',
    staticOptions: [
      {
        name: 'one',
        display: 'One',
      },
      {
        name: 'nothing',
        display: 'No results',
      },
    ],
  },
  sortable: true,
  defaultsort: false,
  type: 'string',
  mandatory: false,
  visible: true,
}

let filterValue = filterField.filter.staticOptions[0]

When(/^I click the Show Filter button$/, function () {
  const page = new ListPage()
  page.showFilterButton().click(10, 30)
})

When('I select a filter', () => {
  const page = new ListPage()

  page.filter(filterField.name).click({ force: true })
  page.filter(filterField.name).then(selectedRadio => {
    filterValue = filterField.filter.staticOptions.find(value => value.name === selectedRadio.val())
  })
})

When('I apply the filters', function () {
  const page = new ListPage()

  page.applyFiltersButton().click()
})

When(/^I (click|clear) the (selected|default) filter$/, function () {
  const page = new ListPage()

  page.selectedFilterButton().click()
})

When('I click a the Reset filters button', function () {
  const page = new ListPage()

  page.resetFiltersButton().click()
})

When('I select a column to sort on', function (this: Mocha.Context) {
  const page = new ListPage()

  page
    .unsortedSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When('I select a previously selected column to sort on', function (this: Mocha.Context) {
  const page = new ListPage()

  page
    .currentSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When(/^I select a page size of (\d+)$/, function (this: Mocha.Context, pageSize: number) {
  const page = new ListPage()

  this.currentPageSize = pageSize
  page.pageSizeSelector().select(`${pageSize}`)
})

When('I click a paging link', function (this: Mocha.Context) {
  const page = new ListPage()

  page
    .pagingLink()
    .then(link => {
      this.currentPage = link.text().trim()
    })
    .click()
})

Then('the Show Filter button is displayed', function (this: Mocha.Context) {
  const page = new ListPage()

  page.showFilterButton().should('exist')
})

Then(/^the Filter panel is (open|closed)$/, function (panelStatus) {
  const panel = new ListPage().showFilterButton()

  if (panelStatus === 'open') {
    panel.should('have.attr', 'open')
  } else {
    panel.should('not.have.attr', 'open')
  }
})
Then('filters are displayed for filterable fields', () => {
  const page = new ListPage()

  page.filter(filterField.name).parentsUntil('.govuk-form-group').contains(filterField.display)
  filterField.filter.staticOptions.forEach(option => {
    page.filter(filterField.name).parentsUntil('.govuk-form-group').contains(option.display)
    page.filter(filterField.name).parentsUntil('.govuk-fieldset').find(`input[value='${option.name}']`).should('exist')
  })

  page.filter(`column4\\.start`).parent().contains('Start')
  page.filter(`column4\\.end`).parent().contains('End')
})

Then('the column headers are displayed correctly', () => {
  const page = new ListPage()

  const columnNames = ['Column 1', 'Column 2', 'Column 3', 'Date']

  columnNames.forEach(columnName => {
    page.dataTable().find('thead').contains(columnName)
  })
})

Then('the correct data is displayed on the page', () => {
  const page = new ListPage()

  data.forEach(record => {
    Object.keys(record).forEach(key => {
      page.dataTable().contains(record[key].toString())
    })
  })
})

Then('the selected filter value is displayed', () => {
  const page = new ListPage()

  page.selectedFilterButton().contains(`${filterField.display}: ${filterValue.display}`)
})

Then('no filters are selected', () => {
  const page = new ListPage()

  page.selectedFilterButtons().should('not.exist')
})

Then('only the default filter is selected', () => {
  const page = new ListPage()

  page.selectedFilterButton().next().should('not.exist')
})

Then('the selected filter value is shown in the URL', () => {
  cy.location().should(location => {
    expect(location.search).to.contain(`${filterField.name}=${filterValue.name}`)
  })
})

Then('the data is filtered correctly', () => {
  const page = new ListPage()
  const otherOptionValue = filterField.filter.staticOptions.find(option => option.name !== filterValue.name)

  page.dataTable().find('tbody').should('not.contain', otherOptionValue.display)
})

Then(
  /^the sorted column is shown as sorted (ascending|descending) in the header$/,
  function (this: Mocha.Context, direction: string) {
    const page = new ListPage()
    const { currentSortColumn } = this

    page.currentSortColumnLink().should(link => {
      expect(link).to.have.data('column', currentSortColumn)
      expect(link).to.have.class(`data-table-header-button-sort-${direction}`)
    })
  },
)

Then('the sorted column is shown in the URL', function (this: Mocha.Context) {
  const { currentSortColumn } = this
  cy.location().should(location => {
    expect(location.search).to.contain(`sortColumn=${currentSortColumn}`)
  })
})

Then(/^the (ascending|descending) sort direction is shown in the URL$/, function (direction: string) {
  const ascending = direction === 'ascending'

  cy.location().should(location => {
    expect(location.search).to.contain(`sortedAsc=${ascending}`)
  })
})

Then('the page size is shown in the URL', function (this: Mocha.Context) {
  cy.location().should(location => {
    expect(location.search).to.contain(`pageSize=${this.currentPageSize}`)
  })
})

Then('the displayed data is not larger than the page size', function () {
  const page = new ListPage()

  page.dataTable().find('tbody tr').should('have.length.at.most', this.currentPageSize)
})

Then('the current page is shown in the URL', function (this: Mocha.Context) {
  cy.location().should(location => {
    expect(location.search).to.contain(`selectedPage=${this.currentPage}`)
  })
})

Then('the default filter value is displayed', () => {
  const page = new ListPage()

  page.selectedFilterButton().contains('Date: 01/01/2004')
})
