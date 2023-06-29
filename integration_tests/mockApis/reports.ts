import { stubFor } from './wiremock'

const stubExternalMovementsCount = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/external-movements/count',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{ "count": 100 }',
    },
  })

const stubExternalMovements = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/external-movements\\?.+',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        '[' +
        '    {\n' +
        '      "prisonNumber": "N9980PJ",\n' +
        '      "date": "2023-01-31",\n' +
        '      "time": "03:01",\n' +
        '      "from": "Cardiff",\n' +
        '      "to": "Kirkham",\n' +
        '      "direction": "In",\n' +
        '      "type": "Admission",\n' +
        '      "reason": "Unconvicted Remand"\n' +
        '    },\n' +
        '    {\n' +
        '      "prisonNumber": "Q9660WX",\n' +
        '      "date": "2023-04-25",\n' +
        '      "time": "12:19",\n' +
        '      "from": "Elmley",\n' +
        '      "to": "Pentonville",\n' +
        '      "direction": "In",\n' +
        '      "type": "Transfer",\n' +
        '      "reason": "Transfer In from Other Establishment"\n' +
        '    },\n' +
        '    {\n' +
        '      "prisonNumber": "L9600OY",\n' +
        '      "date": "2023-02-12",\n' +
        '      "time": "10:31",\n' +
        '      "from": "Ranby",\n' +
        '      "to": "Hatfield",\n' +
        '      "direction": "Out",\n' +
        '      "type": "Transfer",\n' +
        '      "reason": "Transfer Out to Other Establishment"\n' +
        '    }' +
        ']',
    },
  })

export default {
  stubExternalMovementsCount,
  stubExternalMovements,
}
