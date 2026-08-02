/* Tiles the audit screenshots into contact sheets so a whole batch of
   stages can be eyeballed at once.
     node scripts/montage.mjs                 every screenshot in /tmp/fd-audit
     node scripts/montage.mjs wgl zr wd xterm just these  */
import { PNG } from 'pngjs';
import fs from 'fs';

const DIR = '/tmp/fd-audit';
const COLS = 4, ROWS = 3, TW = 380, TH = 240, PAD = 4, LABEL = 16;

const only = process.argv.slice(2);
const keys = (only.length ? only
  : fs.readdirSync(DIR).filter(f => f.endsWith('.png')).map(f => f.replace(/\.png$/, '')).sort());

/* 5x7 bitmap font, enough for a lowercase key. */
const GLYPHS = {
  a: '01100100101111010010', b: '11100101011100101110', c: '0110010001000100110',
  d: '11100101010101011100', e: '1111010001110010001111', f: '111101000111001000010',
  g: '011101000010110101110', h: '10001100011111010001', i: '111001000010000101110',
  j: '00111000010000101100', k: '10010101001100010100', l: '10000100001000010000',
  m: '10001110111010110001', n: '11001101011001110001', o: '011010010100101000110',
  p: '11100101011100100001', q: '011010010101001100010', r: '11100101011100101001',
  s: '01110100000110000111', t: '11111001000010000100', u: '10001100011000101110',
  v: '10001100010101000100', w: '10001100011010111011', x: '10001010100100101010',
  y: '10001010100010000100', z: '11111000100100011111',
  '0': '011010011001110010110', '1': '00100011000010000111', '2': '11100000101100011111',
  '3': '11100000101100011110', '4': '10010100101111000010', '5': '11111100001110011110',
  '6': '01110100001110010110', '7': '11111000100010001000', '8': '01101011001010100110',
  '9': '01101001101110000110', '.': '00000000000000000100', '-': '00000000011100000000',
  ' ': '00000000000000000000'
};

function drawChar(png, ch, ox, oy, rgb) {
  const bits = GLYPHS[ch] || GLYPHS[' '];
  for (let i = 0; i < 20; i++) {
    if (bits[i] !== '1') continue;
    const cx = ox + (i % 4), cy = oy + Math.floor(i / 4);
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
      const x = cx * 2 + dx, y = cy * 2 + dy;
      if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
      const o = (y * png.width + x) * 4;
      png.data[o] = rgb[0]; png.data[o + 1] = rgb[1]; png.data[o + 2] = rgb[2]; png.data[o + 3] = 255;
    }
  }
}
function drawText(png, text, x, y, rgb) {
  [...text.toLowerCase()].forEach((ch, i) => drawChar(png, ch, x + i * 5, y, rgb));
}

/* Nearest-neighbour downscale into the sheet. */
function blit(dst, src, dx, dy, tw, th) {
  for (let y = 0; y < th; y++) {
    const sy = Math.min(src.height - 1, Math.floor(y * src.height / th));
    for (let x = 0; x < tw; x++) {
      const sx = Math.min(src.width - 1, Math.floor(x * src.width / tw));
      const so = (sy * src.width + sx) * 4;
      const dox = dx + x, doy = dy + y;
      if (dox >= dst.width || doy >= dst.height) continue;
      const dof = (doy * dst.width + dox) * 4;
      dst.data[dof] = src.data[so];
      dst.data[dof + 1] = src.data[so + 1];
      dst.data[dof + 2] = src.data[so + 2];
      dst.data[dof + 3] = 255;
    }
  }
}

const perSheet = COLS * ROWS;
let sheet = 0;
for (let start = 0; start < keys.length; start += perSheet) {
  const batch = keys.slice(start, start + perSheet);
  const W = COLS * (TW + PAD) + PAD;
  const H = ROWS * (TH + LABEL + PAD) + PAD;
  const out = new PNG({ width: W, height: H });
  out.data.fill(24);

  batch.forEach((k, i) => {
    const file = `${DIR}/${k}.png`;
    if (!fs.existsSync(file)) return;
    const src = PNG.sync.read(fs.readFileSync(file));
    const cx = i % COLS, cy = Math.floor(i / COLS);
    const x = PAD + cx * (TW + PAD);
    const y = PAD + cy * (TH + LABEL + PAD);
    drawText(out, k, Math.floor(x / 2) + 1, Math.floor(y / 2) + 1, [150, 200, 255]);
    blit(out, src, x, y + LABEL, TW, TH);
  });

  const name = `/tmp/fd-audit/sheet-${++sheet}.png`;
  fs.writeFileSync(name, PNG.sync.write(out));
  console.log(name + '  ' + batch.join(' '));
}
