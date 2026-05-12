import { replaceHashWithSlash, rewriteFrontendComponentFooterLinks } from './probationFrontendComponentsHtml'

describe('replaceHashWithSlash', () => {
  it('rewrites attribute values that are exactly # to /', () => {
    expect(replaceHashWithSlash('<a href="#">Menu</a>')).toBe('<a href="/">Menu</a>')
    expect(replaceHashWithSlash("<a href='#'>Menu</a>")).toBe("<a href='/'>Menu</a>")
  })

  it('leaves markup without hash-only attributes unchanged', () => {
    expect(replaceHashWithSlash('<a href="/reports">x</a>')).toBe('<a href="/reports">x</a>')
  })

  it('handles nullish input', () => {
    expect(replaceHashWithSlash(null)).toBe('')
    expect(replaceHashWithSlash(undefined)).toBe('')
  })
})

describe('rewriteFrontendComponentFooterLinks', () => {
  const base = 'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk'

  it('rewrites privacy and cookies links on the components host to local paths', () => {
    const html = `<footer><a href="${base}/privacy-policy">Privacy</a><a href="${base}/cookies-policy">Cookies</a></footer>`
    const out = rewriteFrontendComponentFooterLinks(html, `${base}/`)
    expect(out).toContain('href="/privacy-policy"')
    expect(out).toContain('data-qa="privacyPolicyLink"')
    expect(out).toContain('href="/cookies-policy"')
    expect(out).toContain('data-qa="cookiesPolicyLink"')
  })

  it('accepts base URL with or without trailing slash', () => {
    const html = `<a href="${base}/privacy-policy">p</a>`
    expect(rewriteFrontendComponentFooterLinks(html, base)).toContain('href="/privacy-policy"')
    expect(rewriteFrontendComponentFooterLinks(html, `${base}/`)).toContain('href="/privacy-policy"')
  })
})
