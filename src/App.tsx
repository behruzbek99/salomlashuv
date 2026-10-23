import { useEffect, useMemo, useState, type FormEvent, type CSSProperties } from 'react';
import { getWish, getWishAt, getWishCount, makeGreeting, type GreetingTone, type RecipientRelation } from './greetings';
import { copyText, makeShareUrl, readShareData, type GreetingStyle, type GreetingTheme } from './share.mjs';
import { downloadGreetingPng, renderGreetingPng } from './exportCard';
import { useBirthdayMusic } from './useBirthdayMusic';

type Notice = { kind: 'success' | 'error'; text: string } | null;
type DesignName = 'classic' | 'sage' | 'floral' | 'stars';

function ConfettiBurst() {
  const pieces = useMemo(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return [];
    return Array.from({ length: 36 }, (_, index) => ({
    id: index,
    x: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.65}s`,
    drift: `${Math.random() * 190 - 95}px`,
    hue: `${Math.floor(Math.random() * 48 + 24)}deg`,
    round: index % 3 === 0,
    }));
  }, []);

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          className={`confetti-piece ${piece.round ? 'confetti-round' : ''}`}
          key={piece.id}
          style={{ '--x': piece.x, '--delay': piece.delay, '--drift': piece.drift, '--hue': piece.hue } as CSSProperties}
        />
      ))}
    </div>
  );
}

type IconName = 'refresh' | 'copy' | 'share' | 'download' | 'image' | 'music';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    refresh: 'M20 7v5h-5M4 17v-5h5M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2',
    copy: 'M8 8V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3M5 8h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z',
    share: 'M12 16V4m-5 5 5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
    download: 'M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3',
    image: 'M4 5h16v14H4zM4 15l5-5 4 4 2-2 5 5M15 9h.01',
    music: 'M9 18V5l12-2v13M9 18a3 2 0 1 1-3-2.8c1.7-.4 3 .5 3 2.8Zm12-2a3 2 0 1 1-3-2.8c1.7-.4 3 .5 3 2.8Z',
  };
  return <svg className="action-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
  const shared = useMemo(() => {
    const data = readShareData(window.location.href);
    const validWish = data.wishIndex >= 0 && data.wishIndex < getWishCount(data.tone, data.relation);
    return {
      ...data,
      wishIndex: validWish ? data.wishIndex : data.name && !data.customMessage ? 0 : -1,
      wish: data.customMessage || (data.name ? getWishAt(data.tone, validWish ? data.wishIndex : 0, data.relation) : ''),
    };
  }, []);
  const [name, setName] = useState(shared.name);
  const [tone, setTone] = useState<GreetingTone>(shared.tone);
  const [relation, setRelation] = useState<RecipientRelation>(shared.relation);
  const [customMessage, setCustomMessage] = useState(shared.customMessage);
  const [theme, setTheme] = useState<GreetingTheme>(shared.theme);
  const [cardStyle, setCardStyle] = useState<GreetingStyle>(shared.style);
  const [shareOpens, setShareOpens] = useState(shared.openOnArrival);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [editingGreeting, setEditingGreeting] = useState(false);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [greeting, setGreeting] = useState(shared.name ? makeGreeting(shared.name, shared.tone, shared.relation) : '');
  const [wish, setWish] = useState(shared.wish);
  const [wishIndex, setWishIndex] = useState(shared.wishIndex);
  const [cardName, setCardName] = useState(shared.name);
  const [cardTone, setCardTone] = useState<GreetingTone>(shared.tone);
  const [cardRelation, setCardRelation] = useState<RecipientRelation>(shared.relation);
  const [activeCustomMessage, setActiveCustomMessage] = useState(shared.customMessage);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const [celebration, setCelebration] = useState(0);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [letterOpened, setLetterOpened] = useState(Boolean(shared.name) && shared.openOnArrival);
  const [customOpen, setCustomOpen] = useState(Boolean(shared.customMessage));
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewBusy, setPreviewBusy] = useState(false);
  const { isPlaying, volume, setVolume, toggle: toggleMusic, stop: stopMusic } = useBirthdayMusic();

  const playCelebrationSound = async () => {
    if (!soundEnabled || !('AudioContext' in window)) return;
    const audio = new window.AudioContext();
    try {
      await audio.resume();
      const now = audio.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) => {
        const start = now + index * 0.12;
        const oscillator = audio.createOscillator();
        const volume = audio.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        volume.gain.setValueAtTime(0.0001, start);
        volume.gain.exponentialRampToValueAtTime(0.11, start + 0.025);
        volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.65);
        oscillator.connect(volume);
        volume.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.68);
      });
      window.setTimeout(() => void audio.close(), 1100);
    } catch {
      await audio.close();
    }
  };

  const openLetter = () => {
    if (letterOpened) return;
    setLetterOpened(true);
    setConfettiBurst((value) => value + 1);
    void playCelebrationSound();
    if ('vibrate' in navigator) {
      (navigator as Navigator & { vibrate: (pattern: number) => boolean }).vibrate(35);
    }
  };

  const activeDesign: DesignName = theme === 'sage' && cardStyle === 'classic' ? 'sage' : cardStyle;
  const selectDesign = (design: DesignName) => {
    setTheme(design === 'sage' ? 'sage' : 'midnight');
    setCardStyle(design === 'floral' || design === 'stars' ? design : 'classic');
  };

  const createGreeting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (!cleanName) {
      setError('Ismni kiriting, shunda tabrikni tayyorlaymiz.');
      document.getElementById('recipient-name')?.focus();
      return;
    }

    const nextWish = getWish(tone, wishIndex, relation);
    setName(cleanName);
    setCardName(cleanName);
    setCardTone(tone);
    setCardRelation(relation);
    setGreeting(makeGreeting(cleanName, tone, relation));
    const personalMessage = customMessage.trim().slice(0, 360);
    setActiveCustomMessage(personalMessage);
    setWish(personalMessage || nextWish.text);
    setWishIndex(personalMessage ? -1 : nextWish.index);
    setLetterOpened(false);
    setShareOpens(true);
    setEditingGreeting(false);
    setError('');
    setNotice(null);
    setCelebration((value) => value + 1);
  };

  const refreshWish = () => {
    const nextWish = getWish(cardTone, wishIndex, cardRelation);
    setCustomMessage('');
    setActiveCustomMessage('');
    setWish(nextWish.text);
    setWishIndex(nextWish.index);
    setNotice(null);
  };

  const shareLink = makeShareUrl(cardName, cardTone, wishIndex, theme, activeCustomMessage, cardRelation, undefined, cardStyle, shareOpens);
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
      const started = await toggleMusic();
      setNotice(started ? { kind: 'success', text: 'Mayin kuy yoqildi.' } : null);
    } catch {
      setNotice({ kind: 'error', text: 'Bu brauzerda kuy ijro etilmadi.' });
    }
  };

  const handleDownload = async () => {
    try {
      await downloadGreetingPng(greeting, wish, theme);
      setNotice({ kind: 'success', text: 'Tabrik rasmi yuklab olindi.' });
    } catch {
      setNotice({ kind: 'error', text: 'Rasmni tayyorlab bo‘lmadi.' });
    }
  };

  const handlePreview = async () => {
    setPreviewBusy(true);
    try {
      const blob = await renderGreetingPng(greeting, wish, theme);
      setPreviewUrl(URL.createObjectURL(blob));
      setNotice(null);
    } catch {
      setNotice({ kind: 'error', text: 'Tabrik rasmini tayyorlab bo‘lmadi.' });
    } finally {
      setPreviewBusy(false);
    }
  };

  useEffect(() => {
    if (!previewUrl) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewUrl('');
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!sharePreviewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSharePreviewOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [sharePreviewOpen]);

  const startOver = () => {
    void stopMusic();
    setName('');
    setCardName('');
    setCardTone('warm');
    setCardRelation('friend');
    setGreeting('');
    setLetterOpened(false);
    setEditingGreeting(false);
    setWish('');
    setWishIndex(-1);
    setCustomMessage('');
    setCustomOpen(false);
    setActiveCustomMessage('');
    setNotice(null);
    setPreviewUrl('');
    setError('');
    window.history.replaceState({}, '', window.location.pathname);
    document.getElementById('recipient-name')?.focus();
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <a className="brand" href={window.location.pathname} aria-label="Tabriknoma bosh sahifasi">
          <span className="brand-icon"><CakeMark /></span>
          <span>Tabriknoma</span>
        </a>
      </header>

      <main className={`main-layout ${greeting && !editingGreeting ? 'has-greeting' : ''}`}>
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

            <details className="custom-message" open={customOpen} onToggle={(event) => setCustomOpen(event.currentTarget.open)}>
              <summary>O‘z tilagingiz <span>Ixtiyoriy</span></summary>
              <textarea
                id="custom-message"
                maxLength={360}
                onChange={(event) => setCustomMessage(event.target.value)}
                placeholder="Yurakdan chiqqan so‘zlaringizni yozing..."
                rows={3}
                value={customMessage}
              />
              <p className="character-count">{customMessage.length}/360</p>
            </details>

            <fieldset className="relationship-picker">
              <legend>Kim uchun?</legend>
              {([
                ['friend', 'Do‘st', '♡'],
                ['parent', 'Ota-ona', '⌂'],
                ['partner', 'Juftim', '♥'],
                ['colleague', 'Hamkasb', '✧'],
              ] as const).map(([value, label, mark]) => (
                <label className={`relationship-option ${relation === value ? 'selected' : ''}`} key={value}>
                  <input checked={relation === value} name="relation" onChange={() => setRelation(value)} type="radio" />
                  <span className="relationship-mark" aria-hidden="true">{mark}</span>
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

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
            <section className={`greeting-card ${letterOpened ? 'letter-opened' : ''}`} data-theme={theme} data-style={cardStyle} aria-live="polite" aria-atomic="true" key={celebration}>
              <ConfettiBurst key={confettiBurst} />
              <div className="envelope-scene" aria-hidden={!letterOpened}>
                <div className="envelope-back" />
                <div className="envelope-address"><span>Kimga</span><strong>{cardName}</strong></div>
                <article className="letter-sheet">
              <div className="greeting-topline"><span>MAXSUS SIZ UCHUN</span><span className="mini-spark" aria-hidden="true">✦</span></div>
              <h3>{greeting}</h3>
              <p className="wish-copy" key={wishIndex}>{wish}</p>
              <div className="greeting-divider"><span>✳</span></div>
              <p className="closing-line">Eng ezgu tilaklar bilan</p>
                </article>
                <div className="envelope-front"><span className="envelope-seal">✦</span></div>
                  <div className="envelope-flap" />
              </div>
              <button aria-expanded={letterOpened} className={`open-letter-button ${letterOpened ? 'is-open' : ''}`} onClick={openLetter} type="button">
                {letterOpened ? 'Xat ochildi' : 'Konvertni ochish'} <span aria-hidden="true">{letterOpened ? '✓' : '→'}</span>
              </button>
              <div className="greeting-tools">
                <button className="edit-greeting-button" onClick={() => setEditingGreeting((editing) => !editing)} type="button">{editingGreeting ? 'Tahrirlashni yopish' : 'Tabrikni tahrirlash'}</button>
                <button className="recipient-preview-button" onClick={() => setSharePreviewOpen(true)} type="button">Ulashishdan oldin ko‘rish</button>
              </div>
              <details className="extra-settings">
                <summary>Qo‘shimcha sozlamalar</summary>
              <div className="reveal-options">
                <fieldset className="share-opening">
                  <legend>Havola ochilganda</legend>
                  <label className={shareOpens ? 'selected' : ''}><input checked={shareOpens} name="share-opening" onChange={() => setShareOpens(true)} type="radio" /> Xat ochiq</label>
                  <label className={!shareOpens ? 'selected' : ''}><input checked={!shareOpens} name="share-opening" onChange={() => setShareOpens(false)} type="radio" /> Avval konvert</label>
                </fieldset>
                <fieldset className="design-picker">
                  <legend>Ko‘rinish</legend>
                  {([['classic', 'Oltin'], ['sage', 'Yashil'], ['floral', 'Gul'], ['stars', 'Yulduz']] as const).map(([value, label]) => (
                    <label className={activeDesign === value ? 'selected' : ''} key={value}><input checked={activeDesign === value} name="card-design" onChange={() => selectDesign(value)} type="radio" /> {label}</label>
                  ))}
                </fieldset>
                <button aria-pressed={soundEnabled} className="sound-toggle" onClick={() => setSoundEnabled((enabled) => !enabled)} type="button">
                  <Icon name="music" /> Bayram ovozi {soundEnabled ? 'yoqilgan' : 'o\u02bbchirilgan'}
                </button>
                <button className="sound-preview" disabled={!soundEnabled} onClick={() => void playCelebrationSound()} type="button">Ohangni tinglash</button>
                <div className="sound-control">
                  <button className={`sound-button ${isPlaying ? 'is-playing' : ''}`} onClick={() => void handleMusic()} type="button" aria-pressed={isPlaying}>
                    <Icon name="music" /> {isPlaying ? 'Mayin kuy chalmoqda' : 'Mayin kuy'}
                  </button>
                  {isPlaying && (
                    <label className="volume-control" htmlFor="music-volume">
                      <span className="volume-label">Ovoz</span>
                      <input className="volume-slider" id="music-volume" aria-label="Kuy ovoz balandligi" max="100" min="0" onChange={(event) => setVolume(Number(event.target.value))} type="range" value={volume} />
                      <output htmlFor="music-volume">{volume}%</output>
                    </label>
                  )}
                </div>
              </div>
              </details>
              <div className="action-grid">
                <button className="action-button" onClick={refreshWish} type="button"><Icon name="refresh" /> Boshqa tilak</button>
                <button className="action-button" onClick={() => void copyGreeting()} type="button"><Icon name="copy" /> Nusxalash</button>
                <button className="action-button action-share" onClick={() => void shareGreeting()} type="button"><Icon name="share" /> Ulashish</button>
                <button className="action-button" disabled={previewBusy} onClick={() => void handlePreview()} type="button"><Icon name="image" /> {previewBusy ? 'Tayyorlanmoqda' : 'Rasmni ko‘rish'}</button>
                <button className="action-button" onClick={() => void handleDownload()} type="button"><Icon name="download" /> PNG yuklab olish</button>
              </div>
              {notice && <p className={`notice ${notice.kind}`} role="status">{notice.text}</p>}
              <button className="reset-button" onClick={startOver} type="button">Boshqa tabrik yaratish</button>
            </section>
          )}

          {!greeting && <p className="privacy-note"><span aria-hidden="true">◇</span> Ma’lumotlar serverga yuborilmaydi</p>}
        </section>
      </main>

      <footer className="site-footer"><span>Mehr bilan tayyorlandi</span><span className="footer-dot">·</span><span>Tabriknoma</span></footer>
      {previewUrl && (
        <div className="preview-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setPreviewUrl(''); }}>
          <section className="preview-dialog" aria-labelledby="preview-title" aria-modal="true" role="dialog">
            <div className="preview-heading">
              <h2 id="preview-title">Tabrik rasmi</h2>
              <button autoFocus className="preview-close" aria-label="Yopish" onClick={() => setPreviewUrl('')} type="button">×</button>
            </div>
            <img alt={`${greeting} — tabrik rasmi`} className="preview-image" src={previewUrl} />
            <button className="primary-button preview-download" onClick={() => void handleDownload()} type="button"><Icon name="download" /> PNG yuklab olish</button>
          </section>
        </div>
      )}
      {sharePreviewOpen && (
        <div className="preview-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSharePreviewOpen(false); }}>
          <section className="preview-dialog share-preview-dialog" aria-labelledby="share-preview-title" aria-modal="true" role="dialog">
            <div className="preview-heading">
              <h2 id="share-preview-title">Ulashishdan oldingi ko‘rinish</h2>
              <button autoFocus className="preview-close" aria-label="Yopish" onClick={() => setSharePreviewOpen(false)} type="button">×</button>
            </div>
            <article className="recipient-card" data-theme={theme} data-style={cardStyle}>
              {shareOpens ? (
                <div className="recipient-open-letter">
                  <p className="greeting-topline">MAXSUS SIZ UCHUN</p>
                  <h3>{greeting}</h3>
                  <p>{wish}</p>
                  <p className="recipient-signoff">Eng ezgu tilaklar bilan</p>
                </div>
              ) : (
                <div className="recipient-envelope">
                  <span>Kimga</span><strong>{cardName}</strong>
                  <p>Siz uchun ichida samimiy tabrik bor</p>
                  <span className="recipient-seal">✦</span>
                </div>
              )}
            </article>
            <p className="recipient-preview-note">Havolani olgan inson shu holatni ko‘radi.</p>
            <button className="primary-button preview-download" onClick={() => { setSharePreviewOpen(false); void shareGreeting(); }} type="button">Havolani ulashish</button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
