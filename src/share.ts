export async function copyText(value: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the selection based fallback for non-secure contexts.
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

export function makeShareUrl(name: string, tone: string, wishIndex: number): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('name', name);
  url.searchParams.set('tone', tone);
  url.searchParams.set('wish', String(wishIndex));
  return url.toString();
}
