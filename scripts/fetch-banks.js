// Tijorat banklarining valyuta kurslarini olib, www/banks.json ga yozadi (GitHub Actions içida)
// Manba: spot.uz sahifalari (maʼlumotni OnMap.uz xizmati beradi)
const fs = require('fs');
const PAGES = { USD: 'https://www.spot.uz/oz/currency/usd/', EUR: 'https://www.spot.uz/oz/currency/eur/', RUB: 'https://www.spot.uz/oz/currency/rub/' };
const UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36';

const ENT = { nbsp: ' ', amp: '&', quot: '"', laquo: '«', raquo: '»', ndash: '–', mdash: '—', apos: "'", lt: '<', gt: '>' };
const decode = s => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m));
const clean = s => decode(String(s).replace(/<[^>]+>/g, ' ')).replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
const num = s => { const m = String(s).replace(/[\s  ]/g, '').replace(',', '.').match(/^\d+(\.\d+)?$/); return m ? +m[0] : null; };

function tableRows(t) {
  const rows = [];
  for (const tr of t.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m => clean(m[1]));
    if (cells.length >= 2) { const n = cells[0], s = num(cells[1]), b = cells.length > 2 ? num(cells[2]) : null; if (n && !/^\d/.test(n) && !/^[A-Z]{3}$/.test(n) && (s || b)) rows.push({ n, s, b }); }
  }
  return rows;
}
const median = a => { const v = a.slice().sort((x, y) => x - y); return v.length ? v[v.length >> 1] : 0; };
function parse(html, ref) {
  // 1) sahifadagi har bir jadvalni alohida köriş va kursi şu valyutaga eng mosini tanlaş
  const tables = (html.match(/<table[\s\S]*?<\/table>/gi) || []).map(tableRows).filter(r => r.length >= 3 && r.filter(x => x.s && x.b).length >= 3);
  if (tables.length) {
    let best = null, bd = Infinity;
    for (const r of tables) { const m = median(r.map(x => x.s || x.b)); const d = ref ? Math.abs(m / ref - 1) : 0; if (d < bd) { bd = d; best = r; } }
    if (best && (!ref || bd < 0.25)) return { rows: best, how: 'table ' + tables.length };
  }
  // 2) boşqa tuzilma: matnni qatorlarga bölib, «Nom 12 010 11 920» ko'rinişidagilarni oliş
  const text = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<(br|\/div|\/li|\/p|\/tr|\/h\d|\/a|\/span|\/td)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ')).replace(/[   ]/g, ' ');
  const lines = text.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    let m = lines[i].match(/^(.{2,40}?)\s+(\d{1,3}(?: \d{3})*(?:[.,]\d+)?|\d+(?:[.,]\d+)?)\s+(\d{1,3}(?: \d{3})*(?:[.,]\d+)?|\d+(?:[.,]\d+)?)?$/);
    if (m && !/^\d/.test(m[1])) { out.push({ n: m[1], s: num(m[2]), b: m[3] ? num(m[3]) : null }); continue; }
    // nom alohida qatorda, raqamlar keyingi qatorlarda
    if (/^[^\d|]{2,40}$/.test(lines[i]) && num(lines[i + 1] || '') && (num(lines[i + 2] || '') || true)) {
      const s = num(lines[i + 1]), b = num(lines[i + 2] || '');
      if (s) { out.push({ n: lines[i], s, b }); i += b ? 2 : 1; }
    }
  }
  return { rows: out, how: 'text' };
}

(async () => {
  let cbu = {};
  try { const r = JSON.parse(fs.readFileSync('www/rates.json', 'utf8')); for (const x of r.data || []) cbu[x.Ccy] = +x.Rate / (+x.Nominal || 1); } catch (_) {}
  const res = { fetched: new Date().toISOString(), src: 'OnMap.uz', cur: {} };
  for (const [c, url] of Object.entries(PAGES)) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'uz,ru;q=0.8' } });
        const html = await r.text();
        const { rows, how } = parse(html, cbu[c]);
        const ref = cbu[c];
        const seen = new Set();
        const ok = rows.filter(x => {
          const k = x.n.toLowerCase(); if (seen.has(k) || /^(bank|банк|valyuta|sotish|sotib|kurs)/i.test(x.n)) return false;
          const vals = [x.s, x.b].filter(Boolean); if (!vals.length) return false;
          if (ref && vals.some(v => v < ref * 0.6 || v > ref * 1.5)) return false;
          seen.add(k); return true;
        });
        console.log(`${c}: ${ok.length} ta bank (${how}, jami qator ${rows.length}) — misol:`, JSON.stringify(ok.slice(0, 3)));
        if (ok.length >= 3) { res.cur[c] = ok; break; }
        if (attempt === 3) { const i = html.search(/Sotish|Sotib olish|Продажа/i); console.log('HTML parça:', html.slice(Math.max(0, i - 400), i + 1600).replace(/\s+/g, ' ')); }
      } catch (e) { console.log('Xato', c, attempt, e.message); }
      await new Promise(r => setTimeout(r, 2500));
    }
  }
  if (!Object.keys(res.cur).length) { console.log('Banklar kursini olib bölmadi'); process.exit(1); }
  fs.writeFileSync('www/banks.json', JSON.stringify(res));
  console.log('banks.json yozildi:', Object.keys(res.cur).join(', '));
})();
