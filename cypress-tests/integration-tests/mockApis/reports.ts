import { stubFor } from './wiremock'

const stubExternalMovementsCount = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/external-movements/count\\?.+',
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
        '      "firstName": "Todd",\n' +
        '      "lastName": "Toddington",\n' +
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
        '      "firstName": "Bob",\n' +
        '      "lastName": "Bobbington",\n' +
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
        '      "firstName": "Steph",\n' +
        '      "lastName": "Stephsworth",\n' +
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

const stubDefinitions = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/reports/definitions\\?renderMethod=HTML',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        '[\n' +
        '  {\n' +
        '    "id": "external-movements",\n' +
        '    "name": "External Movements",\n' +
        '    "description": "Reports about prisoner external movements",\n' +
        '    "variants": [\n' +
        '      {\n' +
        '        "id": "last-month",\n' +
        '        "name": "Last month",\n' +
        '        "resourceName": "external-movements",\n' +
        '        "description": "All movements in the past month",\n' +
        '        "specification": {\n' +
        '          "template": "list",\n' +
        '          "fields": [\n' +
        '            {\n' +
        '              "name": "prisonNumber",\n' +
        '              "displayName": "Prison Number",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "name",\n' +
        '              "displayName": "Name",\n' +
        '              "wordWrap": "None",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "date",\n' +
        '              "displayName": "Date",\n' +
        '              "filter": {\n' +
        '                "type": "DateRange",\n' +
        '                "defaultValue": "2023-08-08 - 2023-09-08"\n' +
        '              },\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": true,\n' +
        '              "type": "Date"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "origin",\n' +
        '              "displayName": "From",\n' +
        '              "wordWrap": "None",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "destination",\n' +
        '              "displayName": "To",\n' +
        '              "wordWrap": "None",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "direction",\n' +
        '              "displayName": "Direction",\n' +
        '              "filter": {\n' +
        '                "type": "Radio",\n' +
        '                "staticOptions": [\n' +
        '                  {\n' +
        '                    "name": "in",\n' +
        '                    "displayName": "In"\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "name": "out",\n' +
        '                    "displayName": "Out"\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "type",\n' +
        '              "displayName": "Type",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "reason",\n' +
        '              "displayName": "Reason",\n' +
        '              "sortable": true,\n' +
        '              "defaultSortColumn": false,\n' +
        '              "type": "String"\n' +
        '            }\n' +
        '          ]\n' +
        '        }\n' +
        '      }\n' +
        '    ]\n' +
        '  }\n' +
        ']',
    },
  })

export default {
  stubExternalMovementsCount,
  stubExternalMovements,
  stubDefinitions,
}