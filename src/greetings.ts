export type GreetingTone = 'warm' | 'formal';
export type RecipientRelation = 'friend' | 'parent' | 'partner' | 'colleague';

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

const relationWishes: Record<RecipientRelation, Partial<Record<GreetingTone, string[]>>> = {
  friend: {
    warm: [
      'Do\u02bbstligimiz hayotimdagi eng qadrli ne\u02bbmatlardan. Yangi yoshing senga kulgu, omad va esda qolarli sarguzashtlar olib kelsin!',
      'Bugun sening kuning! Ko\u02bbnglingdagi niyatlaring ushalib, oldingda faqat chiroyli imkoniyatlar ochilsin. Har doim shunday ajoyib bo\u02bblib yur!',
      'Yoningda seni qadrlaydigan insonlar, qalbingda katta orzular, hayotingda esa ularni amalga oshirishga kuch bo\u02bblsin. Tug\u02bbilgan kuning muborak, qadrdonim!'
    ],
    formal: [
      'Sizga yangi yoshingizda ko\u02bbplab quvonchli uchrashuvlar, unutilmas taassurotlar va barcha rejalaringizda omad tilayman.',
      'Do\u02bbstligimiz men uchun qadrli. Hayotingiz sog\u02bblik, xotirjamlik va ko\u02bbngildagidek yutuqlarga boy bo\u02bblsin.'
    ]
  },
  parent: {
    warm: [
      'Sizning mehringiz va duolaringiz hayotimizdagi eng katta boylik. Doimo sog‘-salomat va baxtimizga omon bo‘ling!',
      'Sizga uzoq umr, sihat-salomatlik va farzandlaringiz mehridan bahramand bo‘lib yurishingizni tilayman.'
    ],
    formal: [
      'Sizga mustahkam sog‘liq, uzoq umr va oilangiz davrasida fayzli, xotirjam yillar tilayman.',
      'Farzandlaringiz va yaqinlaringiz ardog‘ida, doimo sog‘-salomat bo‘lib yuring. Tavallud ayyomingiz muborak!'
    ],
  },
  partner: {
    warm: [
      'Hayotimni mehr va quvonchga to‘ldirganingiz uchun rahmat. Birgalikdagi har bir kunimiz baxtli o‘tsin!',
      'Eng go‘zal tilaklarim siz uchun. Qalbingizdagi orzular ushalib, yuzingizdan tabassum arimasin!'
    ],
    formal: [
      'Sizga qalb xotirjamligi, mustahkam sog‘liq va barcha ezgu niyatlaringiz ro‘yobini tilayman.',
      'Hayotingiz quvonchli lahzalar va yutuqlarga boy bo‘lsin. Siz bilan har bir kun qadrli.'
    ],
  },
  colleague: {
    warm: [
      'Sizga ishlaringizda omad, yangi marralar va hamisha yaxshi kayfiyat tilayman. Jamoamizda borligingiz quvonch!',
      'Yangi yoshingiz muvaffaqiyatli loyihalar, yaxshi hamkorlik va quvonchli kunlar olib kelsin!'
    ],
    formal: [
      'Kasbiy faoliyatingizda yuksak muvaffaqiyatlar, mustahkam sog‘liq va oilaviy farovonlik tilayman.',
      'Yangi yoshingiz yangi marralar, samarali hamkorlik va ulkan yutuqlar olib kelsin.'
    ],
  },
};

const wishEndings: Record<RecipientRelation, Record<GreetingTone, string>> = {
  friend: {
    warm: 'Birga kulgan kunlarimiz ko\u02bbpaysin, yangi yoshing esa eng chiroyli xotiralarga boy bo\u02bblsin. Doim yoningda seni tushunadigan va qadrlaydigan insonlar bo\u02bblsin.',
    formal: 'Yaqinlaringiz bilan quvonchli damlarni ko\u02bbp ko\u02bbring, oldingizga qo\u02bbygan ezgu maqsadlaringizga ishonch bilan yetib boring.'
  },
  parent: {
    warm: 'Bizga bergan mehringizni so\u02bbz bilan ifodalash qiyin. Sizni juda yaxshi ko\u02bbramiz; har doim yonimizda, sog\u02bblom va baxtli bo\u02bbling.',
    formal: 'Xonadoningizdan fayz, qalbingizdan xotirjamlik arimasin. Yaqinlaringiz mehridan bahramand bo\u02bblib, ko\u02bbp yillar e\u02bbzozda yuring.'
  },
  partner: {
    warm: 'Siz bilan baham ko\u02bbrilgan har bir lahza men uchun qadrli. Yangi yoshingizda qalbingiz istagan barcha go\u02bbzalliklar ro\u02bbyobga chiqsin; men esa quvonchingizga sherik bo\u02bblay.',
    formal: 'Sizga qalbingizga yaqin insonlar davrasida ko\u02bbplab baxtli kunlar tilayman. Birgalikdagi yo\u02bblimiz mehr, ishonch va go\u02bbzal xotiralarga boy bo\u02bblsin.'
  },
  colleague: {
    warm: 'Yangi g\u02bboyalar va yaxshi insonlar doimo hamrohingiz bo\u02bblsin. Mehnatingizning samarasini ko\u02bbring, har bir yutug\u02bbingizni mamnuniyat bilan nishonlang!',
    formal: 'Erishgan natijalaringiz yanada yuksak marralarga yo\u02bbl ochsin. Jamoangiz hurmati, oilangiz farovonligi va yangi imkoniyatlar hamisha sizga hamroh bo\u02bblsin.'
  }
};

function getWishes(tone: GreetingTone, relation: RecipientRelation): string[] {
  const wishes = relationWishes[relation][tone] ?? (tone === 'formal' ? formalWishes : warmWishes);
  return wishes.map((wish) => `${wish} ${wishEndings[relation][tone]}`);
}

export function getWish(tone: GreetingTone, previousIndex = -1, relation: RecipientRelation = 'friend'): { text: string; index: number } {
  const wishes = getWishes(tone, relation);
  let index = Math.floor(Math.random() * wishes.length);

  if (wishes.length > 1 && index === previousIndex) {
    index = (index + 1) % wishes.length;
  }

  return { text: wishes[index] ?? wishes[0] ?? '', index };
}

export function getWishAt(tone: GreetingTone, index: number, relation: RecipientRelation = 'friend'): string {
  const wishes = getWishes(tone, relation);
  return wishes[index] ?? wishes[0] ?? '';
}

export function getWishCount(tone: GreetingTone, relation: RecipientRelation = 'friend'): number {
  return getWishes(tone, relation).length;
}

export function makeGreeting(name: string, tone: GreetingTone, relation: RecipientRelation = 'friend'): string {
  const prefix: Record<RecipientRelation, string> = { friend: 'Aziz', parent: 'Qadrli', partner: 'Azizim', colleague: 'Hurmatli' };
  return tone === 'formal'
    ? `Hurmatli ${name}, tug‘ilgan kuningiz muborak bo‘lsin!`
    : `${prefix[relation]} ${name}, tug‘ilgan kuningiz muborak!`;
}
