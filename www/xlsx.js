/* ==========================================================
   Excel (.xlsx / .csv) — brauzer içida öqiş va yoziş
   (excel.py ning JavaScript nusxasi, kutubxonasiz)
   ========================================================== */
const XLSX = (() => {
  const EPOCH = Date.UTC(1899, 11, 30);

  /* ---------- ZIP öqiş ---------- */
  async function inflateRaw(bytes) {
    const ds = new DecompressionStream('deflate-raw');
    const buf = await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
    return new Uint8Array(buf);
  }
  async function unzip(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let eocd = -1;
    for (let i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('zip');
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const files = {}, dec = new TextDecoder();
    for (let n = 0; n < count; n++) {
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
      const nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true);
      const name = dec.decode(u8.subarray(p + 46, p + 46 + nlen));
      p += 46 + nlen + elen + clen;
      const lstart = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
      files[name] = { method, data: u8.subarray(lstart, lstart + csize) };
    }
    return {
      names: Object.keys(files),
      async text(name) {
        const f = files[name]; if (!f) return null;
        const raw = f.method === 8 ? await inflateRaw(f.data) : f.data;
        return dec.decode(raw);
      }
    };
  }

  /* ---------- XLSX öqiş ---------- */
  const colIndex = ref => { let n = 0; for (const ch of ref) { if (/[A-Za-z]/.test(ch)) n = n * 26 + ch.toUpperCase().charCodeAt(0) - 64; else break; } return n - 1; };
  const xml = s => new DOMParser().parseFromString(s, 'application/xml');
  const byTag = (el, tag) => Array.from(el.getElementsByTagNameNS('*', tag));

  async function readXlsx(buf) {
    const z = await unzip(buf);
    const shared = [];
    const ss = await z.text('xl/sharedStrings.xml');
    if (ss) for (const si of byTag(xml(ss), 'si')) shared.push(byTag(si, 't').map(t => t.textContent).join(''));
    let sheet = 'xl/worksheets/sheet1.xml';
    try {
      const wb = xml(await z.text('xl/workbook.xml'));
      const first = byTag(wb, 'sheet')[0];
      const rid = first.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') || first.getAttribute('r:id');
      const rels = xml(await z.text('xl/_rels/workbook.xml.rels'));
      for (const r of byTag(rels, 'Relationship')) if (r.getAttribute('Id') === rid) {
        const tg = r.getAttribute('Target').replace(/^\//, '');
        sheet = tg.startsWith('xl/') ? tg : 'xl/' + tg;
      }
    } catch (_) {}
    if (!z.names.includes(sheet)) sheet = z.names.filter(n => n.startsWith('xl/worksheets/sheet')).sort()[0];
    const doc = xml(await z.text(sheet));
    const rows = [];
    for (const row of byTag(doc, 'row')) {
      const r = [];
      byTag(row, 'c').forEach((c, i) => {
        const ref = c.getAttribute('r'); const col = ref ? colIndex(ref) : i;
        const t = c.getAttribute('t'); const v = byTag(c, 'v')[0];
        let val = null;
        if (t === 's' && v) val = shared[+v.textContent];
        else if (t === 'inlineStr') val = byTag(c, 't').map(x => x.textContent).join('');
        else if (t === 'str' || t === 'e') val = v ? v.textContent : '';
        else if (v) { const f = parseFloat(v.textContent); val = isNaN(f) ? v.textContent : f; }
        r[col] = val;
      });
      if (r.length) rows.push(Array.from(r, x => x === undefined ? null : x));
    }
    return rows;
  }

  async function readCsv(buf) {
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); }
    catch (_) { text = new TextDecoder('windows-1251').decode(buf); }
    text = text.replace(/^﻿/, '');
    const first = text.split(/\r?\n/)[0] || '';
    const delim = [';', ',', '\t'].sort((a, b) => first.split(b).length - first.split(a).length)[0];
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === delim) { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  async function readTable(buf, name) {
    const n = (name || '').toLowerCase();
    if (n.endsWith('.csv') || n.endsWith('.txt')) return readCsv(buf);
    if (n.endsWith('.xls')) throw new Error('xls');
    return readXlsx(buf);
  }

  /* ---------- sanani taniş ---------- */
  const MW = {1:['yan','янв','jan'],2:['fev','фев','feb'],3:['mar','мар'],4:['apr','апр'],5:['may','мая','май'],6:['iyun','июн','jun'],7:['iyul','июл','jul'],8:['avg','авг','aug'],9:['sen','сен','sep'],10:['okt','окт','oct'],11:['noy','ноя','nov'],12:['dek','дек','dec']};
  const monthWord = w => { w = w.toLowerCase().replace(/[ .,]/g, ''); for (const m in MW) if (MW[m].some(k => w.startsWith(k))) return +m; return null; };
  const thisYear = new Date().getFullYear();
  function valid(kun, oy, yil) {
    const d = new Date(Date.UTC(yil || 2000, oy - 1, kun));
    if (d.getUTCMonth() !== oy - 1 || d.getUTCDate() !== kun) return null;
    if (yil && (yil < 1900 || yil > thisYear)) yil = null;
    return [kun, oy, yil || null];
  }
  const year = y => { if (y == null || y === '') return null; y = +y; if (y < 100) y += y <= thisYear % 100 ? 2000 : 1900; return y; };
  function parseDate(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number') {
      if (v >= 1 && v < 80000) { const d = new Date(EPOCH + Math.floor(v) * 864e5); return valid(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear()); }
      return null;
    }
    const s = String(v).trim(); let m;
    if ((m = s.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/))) return valid(+m[3], +m[2], +m[1]);
    if ((m = s.match(/^(\d{1,2})[./\-\s](\d{1,2})(?:[./\-\s](\d{2,4}))?\b/))) return valid(+m[1], +m[2], year(m[3]));
    if ((m = s.match(/^(\d{1,2})[\s\-]*([^\d\s,.\-]+)[\s,.\-]*(\d{4})?/))) { const oy = monthWord(m[2]); if (oy) return valid(+m[1], oy, year(m[3])); }
    if (/^\d+(\.0)?$/.test(s)) return parseDate(parseFloat(s));
    return null;
  }

  /* ---------- ustunlarni taniş ---------- */
  const norm = h => String(h ?? '').toLowerCase().replace(/[ʻʼ‘’'`]/g, '').trim();
  const KW = {
    date: ['sana','tug','tuğ','туғ','дата','рожд','birth','dob','date'],
    note: ['izoh','изоҳ','изох','примеч','коммент','note','comment'],
    extra: ['lavozim','лавозим','должн','position','bolim','бўлим','отдел','department','unvon','унвон','звание','rank','boshqarma','бошқарма','управлен'],
    patr: ['otasining','отасининг','отчество','sharif','шариф','patronym','middle'],
    fio: ['f.i.o','fio','ф.и.о','фио','ф.и.ш','fish','full name','fullname','xodim','ходим','сотрудник','employee','familiyasi, ismi','фамилия, имя','фамилия имя'],
    fam: ['familiya','фамилия','surname','last name','lastname'],
    first: ['ism','исм','имя','first name','firstname','name'],
  };
  function classify(h) {
    h = norm(h); if (!h) return null;
    for (const c of ['date','note','extra','patr','fio']) if (KW[c].some(k => h.includes(k))) return c;
    if (KW.fam.some(k => h.includes(k))) return KW.first.some(k => h.includes(k)) ? 'fio' : 'fam';
    if (KW.first.some(k => h.includes(k))) return 'first';
    return null;
  }
  function detect(rows) {
    for (let ri = 0; ri < Math.min(15, rows.length); ri++) {
      const cols = {};
      (rows[ri] || []).forEach((h, ci) => {
        const c = classify(h);
        if (c === 'note' || c === 'extra') (cols[c] = cols[c] || []).push(ci);
        else if (c && !(c in cols)) cols[c] = ci;
      });
      if ('date' in cols && ('fio' in cols || 'fam' in cols || 'first' in cols)) return [ri + 1, cols];
    }
    const sample = rows.slice(0, 20).filter(r => r && r.length);
    if (!sample.length) return [null, null];
    const width = Math.max(...sample.map(r => r.length));
    let bd = null, bn = null;
    for (let ci = 0; ci < width; ci++) {
      const vals = sample.map(r => r[ci]);
      const dates = vals.filter(v => parseDate(v)).length;
      const texts = vals.filter(v => typeof v === 'string' && v.trim() && !parseDate(v)).length;
      if (bd === null && dates >= Math.max(1, sample.length >> 1)) bd = ci;
      if (bn === null && texts >= Math.max(1, sample.length >> 1)) bn = ci;
    }
    return bd === null || bn === null ? [null, null] : [0, { fio: bn, date: bd }];
  }
  const cell = (row, i) => { if (i == null || row[i] == null) return ''; let v = row[i]; if (typeof v === 'number' && Number.isInteger(v)) v = String(v); return String(v).trim(); };

  async function parsePeople(buf, name) {
    const rows = await readTable(buf, name);
    const [start, cols] = detect(rows);
    if (!cols) throw new Error('columns');
    const people = []; let skipped = 0;
    for (const row of rows.slice(start)) {
      if (!row || !row.some(v => v !== null && v !== '')) continue;
      let nm = 'fio' in cols ? cell(row, cols.fio) : [cell(row, cols.fam), cell(row, cols.first), cell(row, cols.patr)].filter(Boolean).join(' ');
      nm = nm.replace(/\s+/g, ' ');
      const d = parseDate(row[cols.date]);
      if (!nm || !d) { skipped++; continue; }
      const notes = [...(cols.extra || []), ...(cols.note || [])].map(i => cell(row, i)).filter(Boolean);
      people.push({ ism: nm.slice(0, 80), kun: d[0], oy: d[1], yil: d[2], izoh: notes.join(' · ').slice(0, 300) });
    }
    return { people, skipped };
  }

  /* ---------- ZIP yoziş (store) ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function zip(files) {
    const enc = new TextEncoder(); const parts = [], central = []; let off = 0;
    for (const [name, content] of Object.entries(files)) {
      const nb = enc.encode(name), data = typeof content === 'string' ? enc.encode(content) : content, crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, nb.length, true);
      parts.push(new Uint8Array(lh.buffer), nb, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, nb.length, true); ch.setUint32(42, off, true);
      central.push(new Uint8Array(ch.buffer), nb);
      off += 30 + nb.length + data.length;
    }
    const csize = central.reduce((a, b) => a + b.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, Object.keys(files).length, true); end.setUint16(10, Object.keys(files).length, true);
    end.setUint32(12, csize, true); end.setUint32(16, off, true);
    const all = [...parts, ...central, new Uint8Array(end.buffer)];
    const out = new Uint8Array(all.reduce((a, b) => a + b.length, 0)); let p = 0;
    for (const a of all) { out.set(a, p); p += a.length; }
    return out;
  }

  /* ---------- XLSX yoziş ---------- */
  const esc = s => String(s).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ref = (ci, ri) => { let s = ''; ci++; while (ci) { const r = (ci - 1) % 26; s = String.fromCharCode(65 + r) + s; ci = Math.floor((ci - 1) / 26); } return s + ri; };
  const STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="dd.mm.yyyy"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF2F5BEA"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD2D9E6"/></left><right style="thin"><color rgb="FFD2D9E6"/></right><top style="thin"><color rgb="FFD2D9E6"/></top><bottom style="thin"><color rgb="FFD2D9E6"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  function writeXlsx(sheetName, headers, rows, widths) {
    const out = [`<row r="1" ht="24" customHeight="1">${headers.map((h, ci) => `<c r="${ref(ci, 1)}" t="inlineStr" s="1"><is><t>${esc(h)}</t></is></c>`).join('')}</row>`];
    rows.forEach((row, i) => {
      const ri = i + 2;
      out.push(`<row r="${ri}">${row.map((v, ci) => {
        const r = ref(ci, ri);
        if (v == null || v === '') return `<c r="${r}" s="0"/>`;
        if (v instanceof Date) return `<c r="${r}" s="2"><v>${Math.round((Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()) - EPOCH) / 864e5)}</v></c>`;
        if (typeof v === 'number') return `<c r="${r}" s="3"><v>${v}</v></c>`;
        return `<c r="${r}" t="inlineStr" s="0"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
      }).join('')}</row>`);
    });
    const last = ref(headers.length - 1, Math.max(1, rows.length + 1));
    const sn = esc(sheetName.slice(0, 31));
    const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${out.join('')}</sheetData><autoFilter ref="A1:${last}"/></worksheet>`;
    return zip({
      '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${sn}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'xl/styles.xml': STYLES,
      'xl/worksheets/sheet1.xml': sheet,
    });
  }

  return { parsePeople, writeXlsx, parseDate };
})();
