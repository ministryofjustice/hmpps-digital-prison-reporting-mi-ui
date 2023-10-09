/* eslint-disable func-names */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'
import { components } from '../../../server/types/api'
import ListPage from '../../common/pages/ListPage'

const getData = (resourceName: string) => {
  return cy.getCookie('jwtSession', { domain: Cypress.env('SIGN_IN_URL') }).then(tokenCookie => {
    return cy
      .request({
        url: `${Cypress.env('API_BASE_URL')}/${resourceName}`,
        auth: {
          bearer: tokenCookie.value,
        },
      })
      .then(response => {
        return response.body as Array<Record<string, string>>
      })
  })
}

When(/^I click the Show Filter button$/, function () {
  const page = new ListPage(this.currentVariantDefinition)
  page.showFilterButton().click()
})

When('I select a filter', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  const filterField = page.variantDefinition.specification.fields.find(
    field => field.filter && field.filter.type !== 'DateRange',
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
  const page = new ListPage(this.currentVariantDefinition)

  page.applyFiltersButton().click()
})

When('I click the selected filter', function () {
  const page = new ListPage(this.currentVariantDefinition)

  page.selectedFilterButton().click()
})

When('I click a the Clear all button', function () {
  const page = new ListPage(this.currentVariantDefinition)

  page.clearAllButton().click()
})

When('I select a column to sort on', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page
    .unsortedSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When('I select a previously selected column to sort on', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page
    .currentSortColumnLink()
    .then(column => {
      this.currentSortColumn = column.data('column')
    })
    .click()
})

When(/^I select a page size of (\d+)$/, function (this: Mocha.Context, pageSize: number) {
  const page = new ListPage(this.currentVariantDefinition)

  this.currentPageSize = pageSize
  page.pageSizeSelector().select(`${pageSize}`)
})

When('I click a paging link', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page
    .pagingLink()
    .then(link => {
      this.currentPage = link.text().trim()
    })
    .click()
})

Then('the Show Filter button is displayed', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page.showFilterButton().should('exist')
})

Then(/^the Filter panel is (open|closed)$/, function (panelStatus) {
  const panel = new ListPage(this.currentVariantDefinition).filterPanel()

  if (panelStatus === 'open') {
    panel.should('not.have.class', 'moj-js-hidden')
  } else {
    panel.should('have.class', 'moj-js-hidden')
  }
})
Then('filters are displayed for filterable fields', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page.variantDefinition.specification.fields
    .filter(field => field.filter)
    .forEach(field => {
      switch (field.filter.type) {
        case 'DateRange':
          page.filter(`${field.name}\\.start`).parent().contains('Start')
          page.filter(`${field.name}\\.end`).parent().contains('End')
          break

        case 'Radio':
          page.filter(field.name).parentsUntil('.govuk-form-group').contains(field.displayName)
          field.filter.staticOptions.forEach(option => {
            page.filter(field.name).parentsUntil('.govuk-form-group').contains(option.displayName)
            page
              .filter(field.name)
              .parentsUntil('.govuk-fieldset')
              .find(`input[value='${option.name}']`)
              .should('exist')
          })
          break

        case 'Select':
        default:
          page.filter(field.name).parentsUntil('.govuk-fieldset').contains(field.displayName)
      }
    })
})

Then('the column headers are displayed correctly', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page.variantDefinition.specification.fields.forEach(field => {
    page.dataTable().find('thead').contains(field.displayName)
  })
})

Then('date times are displayed in the correct format', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page.variantDefinition.specification.fields.forEach((field, index) => {
    if (field.type === 'Date') {
      page
        .dataTable()
        .get(`tbody tr:first-child td:nth-child(${index + 1})`)
        .contains(/\d\d\/\d\d\/\d\d \d\d:\d\d/)
    }
  })
})
Then('the correct data is displayed on the page', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)
  getData(page.variantDefinition.resourceName).then(data => {
    page.dataTable().find('tbody tr').should('have.length', data.length)
    const record = data.pop()
    Object.keys(record).forEach(key => {
      if (page.variantDefinition.specification.fields.find(f => f.name === key).type !== 'Date') {
        page.dataTable().find('tbody tr').first().contains(record[key])
      }
    })
  })
})

Then('the selected filter value is displayed', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  page.selectedFilterButton().contains(`${selectedField.displayName}: ${selectedValue.displayName}`)
})

Then('no filters are selected', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)

  page.selectedFilterButton().should('not.exist')
})

Then('the selected filter value is shown in the URL', function (this: Mocha.Context) {
  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  cy.location().should(location => {
    expect(location.search).to.contain(`${selectedField.name}=${selectedValue.name}`)
  })
})

Then('the data is filtered correctly', function (this: Mocha.Context) {
  const page = new ListPage(this.currentVariantDefinition)
  const selectedField: components['schemas']['FieldDefinition'] = this.selectedFilter.field
  const selectedValue: components['schemas']['FilterOption'] = this.selectedFilter.value

  const otherOptionValue = selectedField.filter.staticOptions.find(option => option.name !== selectedValue.name)

  page.dataTable().find('tbody').should('not.contain', otherOptionValue.displayName)
})

Then(
  /^the sorted column is shown as sorted (ascending|descending) in the header$/,
  function (this: Mocha.Context, direction: string) {
    const page = new ListPage(this.currentVariantDefinition)
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
  const page = new ListPage(this.currentVariantDefinition)

  page.dataTable().find('tbody tr').should('have.length.at.most', this.currentPageSize)
})

Then('the current page is shown in the URL', function (this: Mocha.Context) {
  cy.location().should(location => {
    expect(location.search).to.contain(`selectedPage=${this.currentPage}`)
  })
})
