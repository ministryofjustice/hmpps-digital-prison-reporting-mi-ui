import type { ParsedQs } from 'qs'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const getQueryParamAsString = (query: ParsedQs, name: string) => (query[name] ? query[name].toString() : null)

export const getDefinitionsPath = (query: ParsedQs) => getQueryParamAsString(query, 'dataProductDefinitionsPath')

export const getDefinitionsParameters = (query: ParsedQs) => {
  const definitionsPath = getDefinitionsPath(query)

  if (definitionsPath) {
    return {
      dataProductDefinitionsPath: definitionsPath,
    }
  }

  return null
}
