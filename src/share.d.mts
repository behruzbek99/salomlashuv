export type GreetingTone = 'warm' | 'formal';
export type GreetingTheme = 'midnight' | 'sage';
export type RecipientRelation = 'friend' | 'parent' | 'partner' | 'colleague';
export type GreetingStyle = 'classic' | 'floral' | 'stars';

export function copyText(value: string): Promise<boolean>;
export function makeShareUrl(
  name: string,
  tone: GreetingTone,
  wishIndex: number,
  theme: GreetingTheme,
  customMessage: string,
  relation: RecipientRelation,
  baseUrl?: string,
  style?: GreetingStyle,
  openOnArrival?: boolean,
): string;
export function readShareData(urlString: string): {
  name: string;
  tone: GreetingTone;
  theme: GreetingTheme;
  relation: RecipientRelation;
  style: GreetingStyle;
  openOnArrival: boolean;
  wishIndex: number;
  customMessage: string;
};
