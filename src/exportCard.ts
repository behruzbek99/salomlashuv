import type { GreetingTheme } from './share.mjs';

type Palette = { background: string; card: string; accent: string; text: string; muted: string; border: string };

const palettes: Record<GreetingTheme, Palette> = {
  midnight: { background: '#121d2e', card: '#f7f3e8', accent: '#9b7b47', text: '#283449', muted: '#596477', border: '#d7c69f' },
  sage: { background: '#142722', card: '#f3f5ec', accent: '#5d7968', text: '#283a32', muted: '#5b6d64', border: '#bac8b8' },
};

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function wrapText(context: CanvasRenderingContext2D, value: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of value.split(/\n+/)) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG faylini tayyorlab bo‘lmadi.')), 'image/png');
  });
}

export async function renderGreetingPng(greeting: string, message: string, theme: GreetingTheme): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Rasm yaratish uchun canvas ochilmadi.');

  const palette = palettes[theme];
  const backdrop = context.createLinearGradient(0, 0, 1200, 1500);
  backdrop.addColorStop(0, palette.background);
  backdrop.addColorStop(1, theme === 'sage' ? '#253e35' : '#283950');
  context.fillStyle = backdrop;
  context.fillRect(0, 0, canvas.width, canvas.height);

  roundedRect(context, 80, 82, 1040, 1336, 34);
  context.fillStyle = palette.card;
  context.fill();
  roundedRect(context, 104, 106, 992, 1288, 24);
  context.strokeStyle = palette.border;
  context.lineWidth = 2;
  context.stroke();

  context.textAlign = 'center';
  context.fillStyle = palette.accent;
  context.font = '600 30px Georgia, serif';
  context.fillText('✦', 600, 225);
  context.font = '700 22px Arial, sans-serif';
  context.letterSpacing = '5px';
  context.fillText('MAXSUS SIZ UCHUN', 600, 286);
  context.letterSpacing = '0px';

  context.fillStyle = palette.text;
  context.font = '600 58px Georgia, serif';
  const titleLines = wrapText(context, greeting, 850);
  let y = 485;
  for (const line of titleLines) {
    context.fillText(line, 600, y, 880);
    y += 78;
  }

  y += 45;
  context.fillStyle = palette.muted;
  context.font = '34px Georgia, serif';
  const messageLines = wrapText(context, message, 850);
  for (const line of messageLines) {
    context.fillText(line, 600, y, 880);
    y += 54;
  }

  const dividerY = Math.min(Math.max(y + 80, 1080), 1210);
  context.strokeStyle = palette.border;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(260, dividerY);
  context.lineTo(940, dividerY);
  context.stroke();
  context.fillStyle = palette.accent;
  context.font = '600 27px Georgia, serif';
  context.fillText('✳', 600, dividerY + 52);
  context.fillStyle = palette.muted;
  context.font = 'italic 28px Georgia, serif';
  context.fillText('Eng ezgu tilaklar bilan', 600, dividerY + 108);
  context.fillStyle = palette.accent;
  context.font = '600 20px Arial, sans-serif';
  context.letterSpacing = '3px';
  context.fillText('TABRIKNOMA', 600, 1328);

  return canvasBlob(canvas);
}

export async function downloadGreetingPng(greeting: string, message: string, theme: GreetingTheme) {
  const blob = await renderGreetingPng(greeting, message, theme);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tugilgan-kun-tabrigi.png';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
