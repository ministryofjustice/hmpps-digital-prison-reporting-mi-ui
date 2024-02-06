/* eslint-disable func-names */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { components } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/types/api'
import ListPage from '../../common/pages/ListPage'

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

When(/^I click the Show Filter button$/, function () {
  const page = new ListPage(this.fullDefinition)
  page.showFilterButton().click(10, 30)
})

When('I select a filter', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  const filterField = page.fullDefinition.variant.specification.fields.find(
    field => field.filter && field.filter.type !== 'daterange',
  )

  let filterValue = filterField.filter.staticOptions[0]

  switch (filterField.filter.type) {
    case 'Select':
      page.filter(filterField.name).select(filterValue.name)
      break
    case 'Radio':
      page.filter(filterField.name).click()
      page.filter(filterField.name).then(selectedRadio => {
        filterValue = filterField.filter.staticOptions.find(value => value.name === selectedRadio.val())
      })
      break
    default:
  }

  this.selectedFilter = {
    field: filterField,
    value: filterValue,
  }
})

When('I apply the filters', function () {
  const page = new ListPage(this.fullDefinition)

  page.applyFiltersButton().click()
})

When(/^I (click|clear) the (selected|default) filter$/, function () {
  const page = new ListPage(this.fullDefinition)

  page.selectedFilterButton().click()
})

When('I click a the Reset filters button', function () {
  const page = new ListPage(this.fullDefinition)

  page.resetFiltersButton().click()
})

When('I select a column to sort on', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page
    .unsortedSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When('I select a previously selected column to sort on', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page
    .currentSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When(/^I select a page size of (\d+)$/, function (this: Mocha.Context, pageSize: number) {
  const page = new ListPage(this.fullDefinition)

  this.currentPageSize = pageSize
  page.pageSizeSelector().select(`${pageSize}`)
})

When('I click a paging link', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page
    .pagingLink()
    .then(link => {
      this.currentPage = link.text().trim()
    })
    .click()
})

Then('the Show Filter button is displayed', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page.showFilterButton().should('exist')
})

Then(/^the Filter panel is (open|closed)$/, function (panelStatus) {
  const panel = new ListPage(this.fullDefinition).showFilterButton()

  if (panelStatus === 'open') {
    panel.should('have.attr', 'open')
  } else {
    panel.should('not.have.attr', 'open')
  }
})
Then('filters are displayed for filterable fields', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page.fullDefinition.variant.specification.fields
    .filter(field => field.filter)
    .forEach(field => {
      switch (field.filter.type) {
        case 'daterange':
          page.filter(`${field.name}\\.start`).parent().contains('Start')
          page.filter(`${field.name}\\.end`).parent().contains('End')
          break

        case 'Radio':
          page.filter(field.name).parentsUntil('.govuk-form-group').contains(field.display)
          field.filter.staticOptions.forEach(option => {
            page.filter(field.name).parentsUntil('.govuk-form-group').contains(option.display)
            page
              .filter(field.name)
              .parentsUntil('.govuk-fieldset')
              .find(`input[value='${option.name}']`)
              .should('exist')
          })
          break

        case 'Select':
        default:
          page.filter(field.name).parentsUntil('.govuk-fieldset').contains(field.display)
      }
    })
})

Then('the column headers are displayed correctly', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  const columnNames = ['Column 1', 'Column 2', 'Column 3', 'Date']

  columnNames.forEach(columnName => {
    page.dataTable().find('thead').contains(columnName)
  })
})

Then('the correct data is displayed on the page', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  data.forEach(record => {
    Object.keys(record).forEach(key => {
      page.dataTable().contains(record[key].toString())
    })
  })
})

Then('the selected filter value is displayed', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  page.selectedFilterButton().contains(`${selectedField.display}: ${selectedValue.display}`)
})

Then('no filters are selected', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page.selectedFilterButtons().should('not.exist')
})

Then('only the default filter is selected', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page.selectedFilterButton().next().should('not.exist')
})

Then('the selected filter value is shown in the URL', function (this: Mocha.Context) {
  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  cy.location().should(location => {
    expect(location.search).to.contain(`${selectedField.name}=${selectedValue.name}`)
  })
})

Then('the data is filtered correctly', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)
  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  const otherOptionValue = selectedField.filter.staticOptions.find(option => option.name !== selectedValue.name)

  page.dataTable().find('tbody').should('not.contain', otherOptionValue.display)
})

Then(
  /^the sorted column is shown as sorted (ascending|descending) in the header$/,
  function (this: Mocha.Context, direction: string) {
    const page = new ListPage(this.fullDefinition)
    const { currentSortColumn } = this

    page.currentSortColumnLink().should(link => {
      expect(link).to.have.data('column', currentSortColumn)
      expect(link).to.have.attr('aria-sort', direction)
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
  const page = new ListPage(this.fullDefinition)

  page.dataTable().find('tbody tr').should('have.length.at.most', this.currentPageSize)
})

Then('the current page is shown in the URL', function (this: Mocha.Context) {
  cy.location().should(location => {
    expect(location.search).to.contain(`selectedPage=${this.currentPage}`)
  })
})

Then('the default filter value is displayed', function (this: Mocha.Context) {
  const page = new ListPage(this.fullDefinition)

  page.selectedFilterButton().contains('Date: 01/01/2004')
})
