import Dict = NodeJS.Dict
import type { Cell, Header } from './types'
import type { ListRequest } from '../../types/reports'
import { components } from '../../types/api'

const mapDate = (isoDate: string, format: string) => {
  const date = new Date(isoDate)
  const add0 = (t: number) => {
    return t < 10 ? `0${t}` : t
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 0 indexed
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const replacement = {
    yyyy: year,
    MM: add0(month),
    m: month,
    dd: add0(day),
    d: day,
    hh: add0(hours),
    h: hours,
    mm: add0(minutes),
    M: minutes,
    ss: add0(seconds),
    s: seconds,
  }

  let result = format
  Object.keys(replacement).forEach(key => {
    result = result.replace(key, replacement[key])
  })
  return result
}

export default {
  mapHeader: (
    format: Array<components['schemas']['FieldDefinition']>,
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
          `>${f.displayName}</a>`,
      }

      return header
    })
  },

  mapData: (data: Array<Dict<string>>, format: Array<components['schemas']['FieldDefinition']>) =>
    data.map(d =>
      format.map(f => {
        let text: string

        if (f.dateFormat) {
          text = mapDate(d[f.name], f.dateFormat)
        } else {
          text = d[f.name]
        }

        let fieldFormat: string

        switch (f.type) {
          case 'long':
          case 'datetime':
            fieldFormat = 'numeric'
            break

          default:
            fieldFormat = 'string'
        }

        const cell: Cell = {
          text,
          format: fieldFormat,
          classes: f.wordWrap ? `data-table-cell-wrap-${f.wordWrap.toLowerCase()}` : '',
        }

        return cell
      }),
    ),
}
