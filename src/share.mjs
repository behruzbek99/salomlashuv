/**
 * @typedef {'warm' | 'formal'} GreetingTone
 * @typedef {'midnight' | 'sage'} GreetingTheme
 * @typedef {'friend' | 'parent' | 'partner' | 'colleague'} RecipientRelation
 * @typedef {'classic' | 'floral' | 'stars'} GreetingStyle
 */

/** @param {string} value @returns {Promise<boolean>} */
export async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Use the selection fallback when clipboard access is unavailable.
    }
  }

  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  return copied;
}

/**
 * @param {string} name
 * @param {GreetingTone} tone
 * @param {number} wishIndex
 * @param {GreetingTheme} theme
 * @param {string} customMessage
 * @param {RecipientRelation} relation
 * @param {string} [baseUrl]
 * @param {GreetingStyle} [style]
 * @param {boolean} [openOnArrival]
 * @returns {string}
 */
export function makeShareUrl(name, tone, wishIndex, theme, customMessage, relation, baseUrl = window.location.href, style = 'classic', openOnArrival = true) {
  const url = new URL(baseUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('name', name.trim().slice(0, 60));
  url.searchParams.set('tone', tone);
  url.searchParams.set('theme', theme);
  url.searchParams.set('for', relation);
  url.searchParams.set('style', style);
  url.searchParams.set('open', openOnArrival ? '1' : '0');
  if (wishIndex >= 0) url.searchParams.set('wish', String(wishIndex));
  if (customMessage.trim()) url.searchParams.set('message', customMessage.trim().slice(0, 360));
  return url.toString();
}

/** @param {string} urlString @returns {{ name: string, tone: GreetingTone, theme: GreetingTheme, relation: RecipientRelation, style: GreetingStyle, openOnArrival: boolean, wishIndex: number, customMessage: string }} */
export function readShareData(urlString) {
  const params = new URL(urlString).searchParams;
  const wishParam = params.get('wish');
  const rawWish = wishParam === null ? Number.NaN : Number(wishParam);
  return {
    name: (params.get('name') ?? '').trim().replace(/\s+/g, ' ').slice(0, 60),
    tone: params.get('tone') === 'formal' ? 'formal' : 'warm',
    theme: params.get('theme') === 'sage' ? 'sage' : 'midnight',
    relation: ['parent', 'partner', 'colleague'].includes(params.get('for') ?? '')
      ? params.get('for')
      : 'friend',
    style: ['floral', 'stars'].includes(params.get('style') ?? '') ? params.get('style') : 'classic',
    openOnArrival: params.get('open') !== '0',
    wishIndex: Number.isInteger(rawWish) && rawWish >= 0 ? rawWish : -1,
    customMessage: (params.get('message') ?? '').trim().slice(0, 360),
  };
}
