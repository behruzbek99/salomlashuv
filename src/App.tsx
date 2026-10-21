import { useMemo, useState, type FormEvent, type CSSProperties } from 'react';
import { getWish, getWishAt, getWishCount, makeGreeting, type GreetingTone } from './greetings';
import { copyText, makeShareUrl } from './share';
import { useBirthdayMusic } from './useBirthdayMusic';

type Notice = { kind: 'success' | 'error'; text: string } | null;

function readSharedGreeting() {
  const params = new URLSearchParams(window.location.search);
  const name = (params.get('name') ?? '').trim().slice(0, 60);
  const tone: GreetingTone = params.get('tone') === 'formal' ? 'formal' : 'warm';
  const wishIndex = Number(params.get('wish'));
  const validWish = Number.isInteger(wishIndex) && wishIndex >= 0 && wishIndex < getWishCount(tone);
  return {
    name,
    tone,
    wishIndex: validWish ? wishIndex : name ? 0 : -1,
    wish: name ? getWishAt(tone, validWish ? wishIndex : 0) : '',
  };
}

function ConfettiBurst() {
  const pieces = useMemo(() => Array.from({ length: 34 }, (_, index) => ({
    id: index,
    x: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.45}s`,
    drift: `${Math.random() * 140 - 70}px`,
    hue: `${Math.floor(Math.random() * 42 + 28)}deg`,
  })), []);

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          className="confetti-piece"
          key={piece.id}
          style={{ '--x': piece.x, '--delay': piece.delay, '--drift': piece.drift, '--hue': piece.hue } as CSSProperties}
        />
      ))}
    </div>
  );
}

function CakeMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 56 56" fill="none" className="cake-mark">
      <path d="M12 30.5h32v15H12z" fill="currentColor" opacity=".16" />
      <path d="M12 30.5c0-3.3 3.6-5.7 8-5.7s8 2.4 8 5.7c0-3.3 3.6-5.7 8-5.7s8 2.4 8 5.7v15H12v-15Z" fill="currentColor" />
      <path d="M17 19c0-2.4 2.4-2.8 2.4-5.5M27.8 19c0-2.4 2.4-2.8 2.4-5.5M38.6 19c0-2.4 2.4-2.8 2.4-5.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17 36h22M17 41h22" stroke="white" strokeOpacity=".8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function App() {
  const shared = useMemo(readSharedGreeting, []);
  const [name, setName] = useState(shared.name);
  const [tone, setTone] = useState<GreetingTone>(shared.tone);
  const [greeting, setGreeting] = useState(shared.name ? makeGreeting(shared.name, shared.tone) : '');
  const [wish, setWish] = useState(shared.wish);
  const [wishIndex, setWishIndex] = useState(shared.wishIndex);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const [celebration, setCelebration] = useState(0);
  const { isPlaying, toggle: toggleMusic, stop: stopMusic } = useBirthdayMusic();

  const createGreeting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (!cleanName) {
      setError('Ismni kiriting, shunda tabrikni tayyorlaymiz.');
      document.getElementById('recipient-name')?.focus();
      return;
    }

    const nextWish = getWish(tone, wishIndex);
    setName(cleanName);
    setGreeting(makeGreeting(cleanName, tone));
    setWish(nextWish.text);
    setWishIndex(nextWish.index);
    setError('');
    setNotice(null);
    setCelebration((value) => value + 1);
  };

  const refreshWish = () => {
    const nextWish = getWish(tone, wishIndex);
    setWish(nextWish.text);
    setWishIndex(nextWish.index);
    setNotice(null);
  };

  const shareLink = makeShareUrl(name, tone, wishIndex);
  const cardText = `${greeting}\n\n${wish}`;

  const copyGreeting = async () => {
    const copied = await copyText(cardText);
    setNotice(copied
      ? { kind: 'success', text: 'Tabrik nusxalandi.' }
      : { kind: 'error', text: 'Nusxalab bo‘lmadi. Matnni belgilab ko‘chiring.' });
  };

  const shareGreeting = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tug‘ilgan kun tabrigi', text: cardText, url: shareLink });
        setNotice({ kind: 'success', text: 'Tabrik ulashishga tayyor.' });
      } else {
        const copied = await copyText(`${cardText}\n\n${shareLink}`);
        setNotice(copied
          ? { kind: 'success', text: 'Tabrik havolasi nusxalandi.' }
          : { kind: 'error', text: 'Havolani nusxalab bo‘lmadi.' });
      }
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
        setNotice({ kind: 'error', text: 'Ulashib bo‘lmadi. Tabrikni nusxalab yuboring.' });
      }
    }
  };

  const handleMusic = async () => {
    try {
      await toggleMusic();
      setNotice(isPlaying ? null : { kind: 'success', text: 'Mayin kuy yoqildi.' });
    } catch {
      setNotice({ kind: 'error', text: 'Bu brauzerda kuy ijro etilmadi.' });
    }
  };

  const startOver = () => {
    void stopMusic();
    setName('');
    setGreeting('');
    setWish('');
    setWishIndex(-1);
    setNotice(null);
    setError('');
    window.history.replaceState({}, '', window.location.pathname);
    document.getElementById('recipient-name')?.focus();
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href={window.location.pathname} aria-label="Tabriknoma bosh sahifasi">
          <span className="brand-icon"><CakeMark /></span>
          <span>Tabriknoma</span>
        </a>
        <span className="version-tag">YANGI TALQIN <b>02</b></span>
      </header>

      <main className="main-layout">
        <section className="intro-panel" aria-labelledby="page-title">
          <p className="eyebrow"><span /> TUG‘ILGAN KUN UCHUN</p>
          <h1 id="page-title">Samimiy so‘zlar,<br /><em>unutilmas lahza.</em></h1>
          <p className="intro-copy">Yaqin insoningizga atalgan chiroyli tabrik yarating. Ismini kiriting, ohangni tanlang va tayyor tabrikni ulashing.</p>
          <div className="intro-rule" />
          <p className="intro-note"><span aria-hidden="true">✳</span> Har bir tabrik alohida tayyorlanadi</p>
        </section>

        <section className="composer" aria-label="Tug‘ilgan kun tabrigini yaratish">
          <div className="composer-heading">
            <div className="cake-emblem"><CakeMark /></div>
            <div>
              <p className="section-kicker">SIZ UCHUN</p>
              <h2>Tabriknoma</h2>
            </div>
          </div>

          <form onSubmit={createGreeting} noValidate>
            <label htmlFor="recipient-name">Kimni tabriklaymiz?</label>
            <input
              autoComplete="name"
              id="recipient-name"
              type="text"
              maxLength={60}
              onChange={(event) => { setName(event.target.value); if (event.target.value.trim()) setError(''); }}
              placeholder="Ismini yozing"
              value={name}
              aria-describedby={error ? 'name-error' : undefined}
              aria-invalid={Boolean(error)}
            />
            {error && <p className="field-error" id="name-error" role="alert">{error}</p>}

            <fieldset className="tone-picker">
              <legend>Tabrik ohangi</legend>
              <label className={`tone-option ${tone === 'warm' ? 'selected' : ''}`}>
                <input checked={tone === 'warm'} name="tone" onChange={() => setTone('warm')} type="radio" />
                <span className="tone-symbol" aria-hidden="true">♡</span>
                <span><strong>Samimiy</strong><small>Yaqin inson uchun</small></span>
              </label>
              <label className={`tone-option ${tone === 'formal' ? 'selected' : ''}`}>
                <input checked={tone === 'formal'} name="tone" onChange={() => setTone('formal')} type="radio" />
                <span className="tone-symbol formal-symbol" aria-hidden="true">✦</span>
                <span><strong>Rasmiy</strong><small>Hurmat bilan</small></span>
              </label>
            </fieldset>

            <button className="primary-button" type="submit">
              <span>Tabrikni yaratish</span><span className="button-arrow" aria-hidden="true">↗</span>
            </button>
          </form>

          {greeting && (
            <section className="greeting-card" aria-live="polite" aria-atomic="true" key={celebration}>
              <ConfettiBurst />
              <div className="greeting-topline"><span>MAXSUS SIZ UCHUN</span><span className="mini-spark" aria-hidden="true">✦</span></div>
              <h3>{greeting}</h3>
              <p className="wish-copy">{wish}</p>
              <div className="greeting-divider"><span>✳</span></div>
              <p className="closing-line">Eng ezgu tilaklar bilan</p>
              <div className="action-grid">
                <button className="action-button" onClick={refreshWish} type="button"><span aria-hidden="true">⟳</span> Boshqa tilak</button>
                <button className="action-button" onClick={() => void copyGreeting()} type="button"><span aria-hidden="true">▢</span> Nusxalash</button>
                <button className="action-button action-share" onClick={() => void shareGreeting()} type="button"><span aria-hidden="true">↗</span> Ulashish</button>
                <button className={`action-button ${isPlaying ? 'is-playing' : ''}`} onClick={() => void handleMusic()} type="button" aria-pressed={isPlaying}><span aria-hidden="true">♫</span> {isPlaying ? 'Kuy chalmoqda' : 'Mayin kuy'}</button>
              </div>
              {notice && <p className={`notice ${notice.kind}`} role="status">{notice.text}</p>}
              <button className="reset-button" onClick={startOver} type="button">Boshqa tabrik yaratish</button>
            </section>
          )}

          {!greeting && <p className="privacy-note"><span aria-hidden="true">◇</span> Shaxsiy ma’lumot saqlanmaydi</p>}
        </section>
      </main>

      <footer className="site-footer"><span>Mehr bilan tayyorlandi</span><span className="footer-dot">·</span><span>Tabriknoma <b>V2</b></span></footer>
    </div>
  );
}

export default App;
