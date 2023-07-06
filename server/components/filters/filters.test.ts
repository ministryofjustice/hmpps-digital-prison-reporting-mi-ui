import { parse } from 'node-html-parser'
import nunjucks from 'nunjucks'
import path from 'path'

nunjucks.configure(
  [
    path.join(__dirname, '../../../node_modules/govuk-frontend'),
    path.join(__dirname, '../../../node_modules/@ministryofjustice/frontend'),
    path.join(__dirname, '.'),
  ],
  { autoescape: true },
)

const defaultOptions = {
  filters: [
    {
      text: 'Direction',
      name: 'direction',
      type: 'radio',
      options: [
        { value: 'in', text: 'In' },
        { value: 'out', text: 'Out' },
      ],
      value: 'in',
    },
    {
      text: 'Type',
      name: 'type',
      type: 'select',
      options: [
        { value: 'a', text: 'A' },
        { value: 'b', text: 'B' },
      ],
      value: 'b',
    },
  ],
  urlWithNoFilters: 'urlWithNoFiltersValue',
}

const testView = '{% from "view.njk" import appFilters %}{{ appFilters(filters, urlWithNoFilters) }}'

describe('Filters options render correctly', () => {
  it('Select filter renders successfully', () => {
    const rendered = parse(nunjucks.renderString(testView, defaultOptions))

    const typeFilterSelect = rendered.querySelectorAll('#filters\\.type')
    expect(typeFilterSelect.length).toEqual(1)
    expect(typeFilterSelect[0].tagName).toBe('SELECT')
    const selectedOption = typeFilterSelect[0].querySelector('option[selected]')
    expect(selectedOption.text).toEqual('B')
    expect(selectedOption.getAttribute('value')).toEqual('b')
  })

  it('Radio filter renders successfully', () => {
    const rendered = parse(nunjucks.renderString(testView, defaultOptions))

    const firstDirectionRadio = rendered.querySelectorAll('#filters\\.direction')
    expect(firstDirectionRadio.length).toEqual(1)
    expect(firstDirectionRadio[0].tagName).toBe('INPUT')
    expect(firstDirectionRadio[0].getAttribute('type')).toEqual('radio')
    expect(firstDirectionRadio[0].getAttribute('value')).toEqual('in')
    expect(firstDirectionRadio[0].getAttribute('checked')).toBeDefined()

    const secondDirectionRadio = rendered.querySelectorAll('#filters\\.direction-2')
    expect(secondDirectionRadio.length).toEqual(1)
    expect(secondDirectionRadio[0].tagName).toBe('INPUT')
    expect(secondDirectionRadio[0].getAttribute('type')).toEqual('radio')
    expect(secondDirectionRadio[0].getAttribute('value')).toEqual('out')
    expect(secondDirectionRadio[0].getAttribute('checked')).toBeUndefined()
  })
})
