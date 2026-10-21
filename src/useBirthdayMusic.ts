import { useCallback, useEffect, useRef, useState } from 'react';

const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];

export function useBirthdayMusic() {
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(async () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (contextRef.current?.state === 'running') {
      await contextRef.current.suspend();
    }
    setIsPlaying(false);
  }, []);

  const playNote = useCallback(() => {
    const context = contextRef.current;
    if (!context || context.state !== 'running') return;

    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = melody[stepRef.current % melody.length] ?? 523.25;
    stepRef.current += 1;
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.48);
    oscillator.addEventListener('ended', () => {
      oscillator.disconnect();
      volume.disconnect();
    }, { once: true });
  }, []);

  const toggle = useCallback(async () => {
    if (timerRef.current !== null) {
      await stop();
      return false;
    }

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) {
      throw new Error('Bu brauzer audio ijrosini qo‘llab-quvvatlamaydi.');
    }

    contextRef.current ??= new AudioContextConstructor();
    await contextRef.current.resume();
    playNote();
    timerRef.current = window.setInterval(playNote, 560);
    setIsPlaying(true);
    return true;
  }, [playNote, stop]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    void contextRef.current?.close();
  }, []);

  return { isPlaying, toggle, stop };
}
