export type GreetingTone = 'warm' | 'formal';

const warmWishes = [
  'Yangi yoshingiz quvonchli lahzalar, samimiy insonlar va unutilmas yutuqlarga boy bo‘lsin. Har bir kuningiz fayzli o‘tsin!',
  'Ko‘nglingizdagi ezgu orzular birin-ketin amalga oshsin. Sizga baxt, baraka va ko‘ngil xotirjamligini tilayman.',
  'Yangi yoshingiz yangi imkoniyatlar va katta muvaffaqiyatlar olib kelsin. Doimo sog‘-salomat, yaqinlaringiz ardog‘ida bo‘ling!',
  'Bugungi quvonchingiz yil davomida hamrohingiz bo‘lsin. Yuzingizdan tabassum, qalbingizdan mehr arimasin!',
  'Hayotingiz mehr, omad va chiroyli xotiralarga to‘lsin. Eng yaxshi tilaklarim doimo siz bilan!'
];

const formalWishes = [
  'Sizga mustahkam sog‘liq, oilaviy farovonlik va barcha ezgu maqsadlaringizga erishishingizni tilayman.',
  'Yangi yoshingiz yangi imkoniyatlar, yuksak natijalar va xotirjamlik olib kelsin. Tug‘ilgan kuningiz muborak bo‘lsin!',
  'Faoliyatingizda muvaffaqiyat, xonadoningizga fayz-u baraka va hayotingizga quvonch tilayman.',
  'Barcha rejalaringiz amalga oshib, har bir kuningiz mazmunli va barakali o‘tsin. Sizga uzoq umr va sihat-salomatlik tilayman.'
];

export function getWish(tone: GreetingTone, previousIndex = -1): { text: string; index: number } {
  const wishes = tone === 'formal' ? formalWishes : warmWishes;
  let index = Math.floor(Math.random() * wishes.length);

  if (wishes.length > 1 && index === previousIndex) {
    index = (index + 1) % wishes.length;
  }

  return { text: wishes[index] ?? wishes[0] ?? '', index };
}

export function getWishAt(tone: GreetingTone, index: number): string {
  const wishes = tone === 'formal' ? formalWishes : warmWishes;
  return wishes[index] ?? wishes[0] ?? '';
}

export function getWishCount(tone: GreetingTone): number {
  return tone === 'formal' ? formalWishes.length : warmWishes.length;
}

export function makeGreeting(name: string, tone: GreetingTone): string {
  return tone === 'formal'
    ? `Hurmatli ${name}, tug‘ilgan kuningiz muborak bo‘lsin!`
    : `Aziz ${name}, tug‘ilgan kuningiz muborak!`;
}
