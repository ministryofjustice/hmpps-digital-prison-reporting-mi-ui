/**
 * Post-process HTML returned by HMPPS / PDS frontend-components API.
 * Aligns with hmpps-manage-people-on-probation-ui (probationFEComponentsMiddleware).
 */

function escapeForRegexp(url: string): string {
  return url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * PDS header markup sometimes uses `href="#"` for controls; in embedded apps that can
 * break navigation / mega-menu behaviour. Rewrite to `href="/"` (same as MoP).
 */
export function replaceHashWithSlash(source: string | null | undefined): string {
  if (source == null) {
    return ''
  }
  const input = String(source)
  if (!input.includes('#')) {
    return input
  }
  return input.replace(/=(['"])#\1/g, '=$1/$1')
}

/**
 * Rewrites privacy / cookies links that point at the components API host to local routes.
 */
export function rewriteFrontendComponentFooterLinks(footerHtml: string, componentsApiBaseUrl: string): string {
  const base = componentsApiBaseUrl.replace(/\/$/, '')
  const escapedBase = escapeForRegexp(base)
  const policyRegex = new RegExp(`<a([^>]*?)href=["']${escapedBase}/privacy-policy["']([^>]*)>`, 'gi')
  const cookieRegex = new RegExp(`<a([^>]*?)href=["']${escapedBase}/cookies-policy["']([^>]*)>`, 'gi')
  return footerHtml
    .replace(policyRegex, `<a$1href="/privacy-policy" data-qa="privacyPolicyLink"$2>`)
    .replace(cookieRegex, `<a$1href="/cookies-policy" data-qa="cookiesPolicyLink"$2>`)
}
