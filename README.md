# Tabriknoma V2

O‘zbekcha tug‘ilgan kun tabriknomasi. Ilova React va TypeScript’da yozilgan, Vite orqali ishga tushadi.

## Talablar

- Node.js 20.19+ yoki 22.12+
- npm

## Ishga tushirish

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

## Imkoniyatlar

- Samimiy yoki rasmiy tabrik ohangini tanlash
- Do‘st, ota-ona, juft yoki hamkasb uchun mos tabrik
- Yopiq holatda turadigan shaxsiy tilak yozish maydoni
- Ikki rang mavzusini tanlash va PNG rasmini oldindan ko‘rish
- Ismga mos shaxsiy tabrik va bir nechta tilak
- Tabrikni nusxalash yoki qurilma ulashish menyusi orqali yuborish
- Ism, ohang, rang va tilakni saqlaydigan, boshqa qurilmada ham ochiladigan havola
- PNG tabriknoma yuklab olish
- Foydalanuvchi boshqaradigan Web Audio kuy va ovoz balandligi
- Mobilga mos ko‘rinish, klaviatura boshqaruvi va harakatni kamaytirish sozlamasi

`npm run test:share` shaxsiy havoladagi ma’lumotlar boshqa qurilmada ochilganda saqlanishini tekshiradi.

Ilova tabrik matnini serverga yubormaydi. Shaxsiy havola ism va tanlangan tabrik ma’lumotlarini URL ichida saqlaydi.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` `main` tarmog‘iga push qilinganda production build’ni GitHub Pages’ga chiqaradi. Birinchi deploydan oldin repozitoriy sozlamalarida **Settings → Pages → Build and deployment → Source → GitHub Actions** ni tanlang.
