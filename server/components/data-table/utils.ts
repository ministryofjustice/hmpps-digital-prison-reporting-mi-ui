import Dict = NodeJS.Dict
import type { Cell, Header } from './types'
import type { FieldDefinition, ListRequest } from '../../types/reports'
import { FieldFormat } from '../../types/reports/enum'

const LOCALE = 'en-GB'

const mapDate = (isoDate: string) => new Date(isoDate).toLocaleDateString(LOCALE)

export default {
  mapHeader: (
    format: Array<FieldDefinition>,
    listRequest: ListRequest,
    createUrlForParameters: (updateQueryParams: Dict<string>) => string,
  ) => {
    return format.map(f => {
      let ariaSort = 'none'
      let url = createUrlForParameters({
        sortColumn: f.name,
        sortedAsc: 'true',
      })

      if (f.name === listRequest.sortColumn) {
        ariaSort = listRequest.sortedAsc ? 'ascending' : 'descending'

        if (listRequest.sortedAsc) {
          url = createUrlForParameters({
            sortColumn: f.name,
            sortedAsc: 'false',
          })
        }
      }

      const header: Header = {
        // TODO: This changes the header alignment, and looks very odd.
        // format: (f.format ?? FieldFormat.string) === FieldFormat.string ? null : 'numeric',
        html:
          `<a ` +
          `data-column="${f.name}" ` +
          `aria-sort="${ariaSort}" ` +
          `class="data-table-header-button data-table-header-button-sort-${ariaSort}" ` +
          `href="${url}"` +
          `>${f.header}</a>`,
      }

      return header
    })
  },

  mapData: (data: Array<Dict<string>>, format: Array<FieldDefinition>) =>
    data.map(d =>
      format.map(f => {
        let text: string

        if (f.data) {
          text = f.data(d)
        } else if (f.format === FieldFormat.date) {
          text = mapDate(d[f.name])
        } else {
          text = d[f.name]
        }

        let fieldFormat: FieldFormat = f.format ?? FieldFormat.string

        if (fieldFormat === FieldFormat.date) {
          fieldFormat = FieldFormat.numeric
        }

        const cell: Cell = {
          text,
          format: fieldFormat.toString(),
          classes: f.wrap ? `data-table-cell-wrap-${f.wrap}` : '',
        }

        return cell
      }),
    ),
}
