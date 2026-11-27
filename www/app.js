/* ==========================================================
   Oila byudjeti — asosiy mantiq va ekranlar
   ========================================================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const now = () => Date.now();
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const pd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const weekStart = d => addDays(d, -((d.getDay() + 6) % 7));
const live = a => (a || []).filter(x => !x.d);

/* =================== Ikonkalar =================== */
const IC = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  left: '<path d="M15 18l-6-6 6-6"/>', right: '<path d="M9 18l6-6-6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', send: '<path d="M21 3 3 10.5l7 2.5 2.5 7z"/><path d="M10 13l11-10"/>',
  famx: '<circle cx="8" cy="8" r="3"/><path d="M2.5 19c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"/><path d="M15 6h6M18 3l3 3-3 3"/><path d="M21 15h-6M18 12l-3 3 3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  import: '<path d="M12 3v12M7 10l5 5 5-5M5 15v5h14v-5"/>', export: '<path d="M12 15V3M7 8l5-5 5 5M5 15v5h14v-5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  bell: '<path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16z"/><path d="M10 21h4"/>', swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
};
const ic = (k, st = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${st ? `style="${st}"` : ''}>${IC[k] || ''}</svg>`;

/* =================== Boşlangiç maʼlumotlar =================== */
const DEF_CATS = [
  ['food', '🛒', 'x', 'z'], ['transport', '🚕', 'x', 'z'], ['utility', '💡', 'x', 'z'], ['home', '🏠', 'x', 'z'], ['phone', '📱', 'x', 'z'],
  ['health', '💊', 'x', 'z'], ['kids', '🧸', 'x', 'z'], ['edu', '📚', 'x', 'z'], ['credit', '🏦', 'x', 'z'], ['household', '🧺', 'x', 'z'],
  ['clothes', '👕', 'x', 'h'], ['cafe', '☕', 'x', 'h'], ['fun', '🎬', 'x', 'h'], ['gifts', '🎁', 'x', 'h'], ['relatives', '🤝', 'x', 'h'], ['beauty', '💇', 'x', 'h'], ['other', '📦', 'x', 'h'],
  ['savings', '💰', 'x', 'j'],
  ['salary', '💼', 'd', ''], ['side', '💻', 'd', ''], ['gift_in', '🎁', 'd', ''], ['other_in', '➕', 'd', ''],
];
const PALETTE = ['#2f5bea', '#12a37a', '#e0901a', '#7b5ce6', '#e2475a', '#12a59f', '#c2477e', '#5b7cff', '#f3b54d', '#4fd1a5', '#8d70f0', '#ef7e89', '#3aa0d8', '#9ccc65', '#ff8a65', '#78909c'];
const EMOJIS = ['🛒', '🍞', '🥩', '🍎', '🚕', '⛽', '🚌', '💡', '🔥', '💧', '🏠', '🔑', '📱', '🌐', '💊', '🏥', '🧸', '👶', '📚', '🎓', '🏦', '💳', '🧺', '🧴', '👕', '👟', '☕', '🍽️', '🎬', '🎮', '🎁', '💇', '✈️', '🕌', '🐾', '🚗', '🔧', '💰', '💼', '💻', '📦', '➕', '💵', '💲', '🪙', '🏡', '🎯', '❤️'];
const COLORS = [['green', '#12a37a', '#0f9a94'], ['blue', '#2f5bea', '#13b6a8'], ['teal', '#0f9a94', '#2f5bea'], ['violet', '#7b5ce6', '#c2477e'], ['pink', '#c2477e', '#e0901a']];
const LANGS = [['uz', 'Özbekça'], ['ru', 'Русский'], ['en', 'English']];

function newDB() {
  const u = now();
  return {
    v: 1,
    settings: { ogoh: 80, splash: true, til: 'uz', mavzu: 'light', rang: 'green', ism: '', kurs: 12800, pin: '', eslat: true, eslat_vaqt: '21:00',
      tg_token: '', tg_bot: '', tg_chat_id: null, tg_chat_nomi: '', tg_haftalik: true, tg_oxirgi: '', sync_oxirgi: '' },
    /* hamyonlar har bir telefonda alohida (id takrorlanmaydi); standart kategoriyalar u:0 —
       şunda sinxronizatsiyada boşqa telefonning standart nusxasi sizning özgarişlaringizni bosib ketmaydi */
    wallets: [['cash', '💵', 'UZS'], ['card', '💳', 'UZS'], ['usd', '💲', 'USD']].map(([k, e, cur]) => ({ id: 'w_' + k + '_' + uid(), k, e, cur, start: 0, u: 0 })),
    cats: DEF_CATS.map(([k, e, tur, g]) => ({ id: 'c_' + k, k, e, tur, g, limit: 0, u: 0 })),
    tx: [], rec: [], debts: [], goals: [], lists: [],
  };
}

/* =================== Holat =================== */
let DB = null;
let UI = { page: 'home', per: 'month', off: 0, txType: '', q: '', who: '', plan: 'budget', homeOff: 0 };
const L = () => DB.settings.til || 'uz';
function t(k, v) { let s = (I18N[L()] || I18N.uz)[k] ?? I18N.uz[k] ?? k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; }
const catName = c => c ? (c.nom || t('cat_' + c.k)) : '—';
const walName = w => w ? (w.nom || t('w_' + w.k)) + (w.egasi && DB.settings.ism && w.egasi !== DB.settings.ism ? ` (${w.egasi})` : '') : '—';
const catById = id => DB.cats.find(c => c.id === id);
const walById = id => DB.wallets.find(w => w.id === id);
const catColor = c => c && c.rang ? c.rang : PALETTE[Math.abs([...String(c ? c.id : '')].reduce((h, ch) => h * 31 + ch.charCodeAt(0) | 0, 7)) % PALETTE.length];
const me = () => DB.settings.ism || t('me');
const W = () => live(DB.wallets).sort((a, b) => (a.tartib ?? 99) - (b.tartib ?? 99));

async function persist() { await Platform.save(DB); scheduleNotifications(); }
function touch(o) { o.u = now(); return o; }
function upsert(col, rec) { touch(rec); const i = DB[col].findIndex(x => x.id === rec.id); if (i >= 0) DB[col][i] = rec; else DB[col].push(rec); }
function remove(col, id) { const r = DB[col].find(x => x.id === id); if (r) { r.d = true; touch(r); } }

/* =================== Pul =================== */
/* kurslar: Markaziy bank (DB.rates), bölmasa qölda kiritilgan $ kursi */
const SYM = { USD: '$', EUR: '€', RUB: '₽', GBP: '£', CNY: '¥', JPY: '¥', KZT: '₸', TRY: '₺', KRW: '₩', AED: 'AED', KGS: 'KGS', TJS: 'TJS' };
const PRE = ['USD', 'EUR', 'GBP'];
const rateItem = c => DB.rates && DB.rates.list ? DB.rates.list.find(x => x.c === c) : null;
function rateOf(c) { if (!c || c === 'UZS') return 1; const it = rateItem(c); if (it) return it.r; if (c === 'USD') return +DB.settings.kurs || 0; return 0; }
const rate = () => rateOf('USD');
const toUZS = (n, cur) => cur && cur !== 'UZS' ? n * rateOf(cur) : n;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const unit = cur => !cur || cur === 'UZS' ? t('sum') : (SYM[cur] || cur);
function fmt(n, cur = 'UZS', sign = false) {
  const neg = n < 0; n = Math.abs(n); let s;
  if (!cur || cur === 'UZS') s = sp(Math.round(n)) + ' ' + t('sum');
  else { const v = (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' '); s = PRE.includes(cur) ? SYM[cur] + v : v + ' ' + (SYM[cur] || cur); }
  return (neg ? '−' : sign ? '+' : '') + s;
}
/* bosh sahifada summalarni yaşiriş (👁) */
const money = (n, cur = 'UZS', sign = false) => DB.settings.yashir ? '••••• ' + unit(cur) : fmt(n, cur, sign);
const CURS = () => { const top = ['UZS', 'USD', 'EUR', 'RUB']; const rest = DB.rates && DB.rates.list ? DB.rates.list.map(x => x.c).filter(c => !top.includes(c)) : []; return [...top, ...rest]; };
const curName = c => { if (c === 'UZS') return t('sum_name'); const it = rateItem(c); return it ? (it.n[L()] || it.n.uz || c) : c; };
function short(n) {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace('.0', '') + ' ' + t('bln');
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + ' ' + t('mln');
  if (a >= 1e3) return Math.round(n / 1e3) + ' ' + t('ming');
  return String(Math.round(n));
}
const parseAmt = s => { const v = parseFloat(String(s).replace(/\s/g, '').replace(',', '.')); return isNaN(v) ? 0 : v; };
const txUZS = x => toUZS(x.s, (walById(x.w) || {}).cur);

/* =================== Sana =================== */
const MON = () => I18N[L()].months;
const monName = (i, gen) => { const m = gen && I18N[L()].monthsG ? I18N[L()].monthsG : MON(); return m[i]; };
function fmtDay(d) { const l = L(); if (l === 'en') return `${MON()[d.getMonth()]} ${d.getDate()}`; if (l === 'ru') return `${d.getDate()} ${monName(d.getMonth(), true)}`; return `${d.getDate()}-${MON()[d.getMonth()].toLowerCase()}`; }
const SD = () => Math.min(28, Math.max(1, +DB.settings.oy_boshi || 1));
const dm = d => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
function range(per, off) {
  const d = today(), sd = SD(); let a, b, label;
  if (sd > 1 && per !== 'week') {
    const base = d.getDate() >= sd ? d.getMonth() : d.getMonth() - 1, by = d.getFullYear();
    if (per === 'month') { a = new Date(by, base + off, sd); b = new Date(a.getFullYear(), a.getMonth() + 1, sd); label = `${monName(a.getMonth())} ${a.getFullYear()}`; }
    else if (per === 'quarter') { const q0 = Math.floor(((base % 12) + 12) % 12 / 3), y0 = new Date(by, base, 1).getFullYear(); a = new Date(y0, q0 * 3 + off * 3, sd); b = new Date(a.getFullYear(), a.getMonth() + 3, sd); label = t('quarter_lbl', { q: Math.floor(a.getMonth() / 3) + 1, y: a.getFullYear() }); }
    else { const y0 = new Date(by, base, 1).getFullYear(); a = new Date(y0 + off, 0, sd); b = new Date(a.getFullYear() + 1, 0, sd); label = String(a.getFullYear()); }
    return { a, b, label, per, off, span: `${dm(a)} – ${dm(addDays(b, -1))}` };
  }
  if (per === 'week') { a = addDays(weekStart(d), 7 * off); b = addDays(a, 7); label = `${fmtDay(a)} – ${fmtDay(addDays(b, -1))}`; }
  else if (per === 'month') { a = new Date(d.getFullYear(), d.getMonth() + off, 1); b = new Date(a.getFullYear(), a.getMonth() + 1, 1); label = `${monName(a.getMonth())} ${a.getFullYear()}`; }
  else if (per === 'quarter') { const q = Math.floor(d.getMonth() / 3) + off; a = new Date(d.getFullYear(), q * 3, 1); b = new Date(a.getFullYear(), a.getMonth() + 3, 1); label = t('quarter_lbl', { q: Math.floor(a.getMonth() / 3) + 1, y: a.getFullYear() }); }
  else { a = new Date(d.getFullYear() + off, 0, 1); b = new Date(a.getFullYear() + 1, 0, 1); label = String(a.getFullYear()); }
  return { a, b, label, per, off };
}
const inR = (x, r) => { const d = pd(x.dt); return d >= r.a && d < r.b; };

/* =================== Hisob-kitob =================== */
function balance(w) {
  let b = +w.start || 0;
  for (const x of live(DB.tx)) {
    if (x.tur === 'd' && x.w === w.id) b += x.s;
    else if (x.tur === 'x' && x.w === w.id) b -= x.s;
    else if (x.tur === 'o') { if (x.w === w.id) b -= x.s; if (x.w2 === w.id) b += (x.s2 ?? x.s); }
  }
  return b;
}
const totalBalance = () => W().reduce((s, w) => s + toUZS(balance(w), w.cur), 0);
function stats(r, who) {
  const S = { inc: 0, exp: 0, byCat: {}, byInc: {}, byGroup: { z: 0, h: 0, j: 0 }, byWho: {}, list: [] };
  for (const x of live(DB.tx)) {
    if (x.tur === 'o' || !inR(x, r) || (who && x.kim !== who)) continue;
    const v = txUZS(x); S.list.push(x);
    if (x.tur === 'd') { S.inc += v; S.byInc[x.c] = (S.byInc[x.c] || 0) + v; }
    else { S.exp += v; S.byCat[x.c] = (S.byCat[x.c] || 0) + v; const c = catById(x.c); S.byGroup[(c && c.g) || 'h'] += v; S.byWho[x.kim || '?'] = (S.byWho[x.kim || '?'] || 0) + v; }
  }
  return S;
}
const monthRange = (off = 0) => range('month', off);
function catSpentMonth(cid) { const r = monthRange(0); return live(DB.tx).filter(x => x.tur === 'x' && x.c === cid && inR(x, r)).reduce((s, x) => s + txUZS(x), 0); }
const walOwner = w => (w && (w.egasi || DB.settings.ism)) || '';
function famFlow(r, who) {
  const F = { got: 0, gave: 0, n: 0, list: [] };
  for (const x of live(DB.tx)) { if (x.tur !== 'o' || !inR(x, r)) continue;
    const o1 = walOwner(walById(x.w)), o2 = walOwner(walById(x.w2)); if (!o1 || !o2 || o1 === o2) continue;
    const v = txUZS(x);
    if (o2 === who) { F.got += v; F.n++; F.list.push({ ...x, dir: 1, who: o1, v }); }
    else if (o1 === who) { F.gave += v; F.n++; F.list.push({ ...x, dir: -1, who: o2, v }); } }
  F.list.sort((a, b) => b.dt.localeCompare(a.dt)); F.list = F.list.slice(0, 20); return F;
}
const members = () => [...new Set(live(DB.tx).map(x => x.kim).filter(Boolean))];

/* doimiy tölovlar */
function recDue(r, monthDate) { const y = monthDate.getFullYear(), m = monthDate.getMonth(); const last = new Date(y, m + 1, 0).getDate(); return new Date(y, m, Math.min(r.kun, last)); }
const recKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const recPaid = (r, d) => (r.paid || []).includes(recKey(d));
function recUnpaidThisMonth() { const d = today(); return live(DB.rec).filter(r => r.faol !== false && !recPaid(r, d)); }

/* tejaş rejasi: oylik jamğariş maqsadi (daromadning p %) */
function savePlan() {
  const r = monthRange(0), S = stats(r), d = today(), p = +DB.settings.tejash_foiz || 20;
  const daysLeft = Math.round((r.b - d) / 864e5);
  const recLeft = recUnpaidThisMonth().reduce((s, x) => s + toUZS(x.s, (walById(x.w) || {}).cur), 0);
  const target = S.inc * p / 100, spent = S.exp - S.byGroup.j, allowed = S.inc - target - recLeft, remaining = allowed - spent;
  return { p, target, spent, allowed, remaining, daysLeft, recLeft, inc: S.inc, perDay: daysLeft > 0 ? Math.max(0, remaining) / daysLeft : 0 };
}

/* moliyaviy salomatlik */
function health() {
  const S = stats(monthRange(0));
  if (S.inc <= 0) return null;
  const save = (S.inc - S.exp + S.byGroup.j) / S.inc * 100;
  const needs = S.byGroup.z / S.inc * 100, wants = S.byGroup.h / S.inc * 100;
  const lim = live(DB.cats).filter(c => c.tur === 'x' && c.limit > 0);
  const ok = lim.length ? lim.filter(c => catSpentMonth(c.id) <= c.limit).length / lim.length : 1;
  let score = Math.max(0, Math.min(40, save * 2)) + (needs <= 50 ? 30 : Math.max(0, 30 - (needs - 50))) + 30 * ok;
  score = Math.round(Math.max(0, Math.min(100, score)));
  const lvl = score >= 80 ? 'h_a' : score >= 60 ? 'h_b' : score >= 40 ? 'h_c' : 'h_d';
  const col = score >= 80 ? 'var(--good)' : score >= 60 ? 'var(--acc)' : score >= 40 ? 'var(--warn)' : 'var(--bad)';
  let tip;
  if (save < 0) tip = t('tip_over'); else if (save < 10) tip = t('tip_save'); else if (needs > 60) tip = t('tip_needs'); else if (wants > 35) tip = t('tip_wants'); else if (ok < 1) tip = t('tip_limits'); else tip = t('tip_good');
  return { score, lvl, col, tip, save, needs, wants };
}

/* =================== Mavzu =================== */
const mq = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const s = DB.settings; const th = s.mavzu === 'auto' ? (mq.matches ? 'dark' : 'light') : s.mavzu;
  document.documentElement.dataset.theme = th; document.documentElement.dataset.acc = s.rang || 'green'; document.documentElement.lang = L(); document.title = t('app');
}
mq.addEventListener && mq.addEventListener('change', () => { if (DB) { applyTheme(); render(); } });

/* =================== Umumiy chiziş =================== */
let toastT;
function toast(m, kind = '') { const e = $('#toast'); e.className = 'toast on ' + kind; e.textContent = m; clearTimeout(toastT); toastT = setTimeout(() => e.className = 'toast', 2600); }
function modal(h) { $('#modal').innerHTML = `<div class="ovl" data-close="1"><div class="mdl" role="dialog">${h}</div></div>`; }
const closeModal = () => { $('#modal').innerHTML = ''; M = null; };
const mhead = title => `<div class="mh"><h3>${title}</h3><button class="ib pl" data-close="1">${ic('x')}</button></div>`;
const sw = (k, on, attr = 'data-sw') => `<button class="sw ${on ? 'on' : ''}" ${attr}="${k}" role="switch"></button>`;
const perNav = r => `<div class="mnav"><button class="ib" data-off="-1">${ic('left')}</button><b>${r.label}${r.span ? `<small class="span">${r.span}</small>` : ''}</b><button class="ib" data-off="1" ${r.off >= 0 ? 'disabled style="opacity:.35"' : ''}>${ic('right')}</button></div>`;
const perSeg = () => `<div class="seg full">${['week', 'month', 'quarter', 'year'].map(p => `<button class="${UI.per === p ? 'on' : ''}" data-per="${p}">${t('per_' + p)}</button>`).join('')}</div>`;

const SUB = ['rates', 'learn', 'settings', 'feedback', 'loan'];
const FEEDBACK_TG = 'bsp3221';
let FB = { type: 'idea', t: '', img: null };
const APPV = '2.0';
function devInfo() { const u = navigator.userAgent, a = u.match(/Android [\d.]+/), m = u.match(/;\s*([^;)]+)\s+Build/), i = u.match(/iPhone OS [\d_]+/);
  return [a ? a[0] : i ? i[0].replace(/_/g, '.') : (u.match(/Windows NT [\d.]+|Mac OS X [\d_]+/) || ['?'])[0], m ? m[1] : '', Platform.native ? 'APK' : 'Web'].filter(Boolean).join(' · '); }
function pageFeedback() {
  return `<div class="card" style="display:grid;gap:14px">
   <div class="small muted">${t('fb_sub')}</div>
   <div class="seg full">${[['idea', '💡'], ['bug', '🐞'], ['q', '❓']].map(([k, e]) => `<button class="${FB.type === k ? 'on' : ''}" data-fbt="${k}">${e} ${t('fb_' + k)}</button>`).join('')}</div>
   <div class="fld"><label>${t('fb_text')}</label><textarea id="fbt" rows="6" maxlength="1500" placeholder="${t('fb_ph_' + FB.type)}">${esc(FB.t)}</textarea></div>
   ${FB.img ? `<div class="row"><div class="ico sm">🖼️</div><div class="tx"><b>${esc(FB.img.name)}</b><small>${Math.round(FB.img.size / 1024)} KB</small></div><button class="ib pl" data-act="fbimgx">${ic('x')}</button></div>` : `<button class="btn alt sm" data-act="fbimg">🖼️ ${t('fb_img')}</button>`}
   <button class="btn w" data-act="fbsend">✈️ ${t('fb_send')}</button>
   <div class="small muted">${t('fb_how', { u: '@' + FEEDBACK_TG })}</div></div>`;
}
async function fbSend() {
  FB.t = ($('#fbt') || {}).value || ''; const txt = FB.t.trim();
  if (txt.length < 5) { $('#fbt').classList.add('err'); return toast(t('fb_short'), 'bd'); }
  const msg = `${{ idea: '💡', bug: '🐞', q: '❓' }[FB.type]} ${t('fb_' + FB.type)} — ${t('app')} v${APPV}\n\n${txt}\n\n— ${DB.settings.ism || ''} · ${devInfo()}`;
  await Platform.copy(msg);
  if (FB.img) { const ok = await Platform.shareText(t('fb_send'), msg, FB.img); if (ok) { toast(t('fb_pick', { u: '@' + FEEDBACK_TG })); return; } }
  Platform.openUrl(`https://t.me/${FEEDBACK_TG}?text=${encodeURIComponent(msg)}`);
  toast(t('fb_copied'));
  FB.t = ''; FB.img = null; setTimeout(render, 800);
}
function render() {
  if (!DB) return;
  if (!DB.settings.ism) return onboarding();
  const pages = { loan: pageLoan, shop: pageShop, feedback: pageFeedback, home: pageHome, tx: pageTx, report: pageReport, plan: pagePlan, more: pageMore, rates: pageRates, learn: pageLearn, settings: pageSettings };
  const th = document.documentElement.dataset.theme, sub = SUB.includes(UI.page), shp = UI.page === 'shop', navOn = sub ? 'more' : shp ? 'home' : UI.page;
  $('#root').innerHTML = `<div class="app"><main class="main" id="main">
   <header class="top">${UI.page === 'settings' && UI.setSec ? `<button class="ib" data-act="setback">${ic('left')}</button>` : sub ? `<button class="ib" data-pg="more">${ic('left')}</button>` : shp ? `<button class="ib" data-act="shopback">${ic('left')}</button>` : ''}<h1>${UI.page === 'settings' && UI.setSec ? setSecInfo(UI.setSec)[1] : t('pg_' + UI.page)}</h1>${shp ? '' : shopHeaderBtn()}
    ${sub || shp ? "" : `<button class="ib famb" data-act="famsheet" aria-label="${t('fam_share')}">${ic('famx')}${syncDue() ? '<i class="rdot"></i>' : ''}</button>`}
    <div class="langw"><button class="langb" data-act="langmenu" aria-label="Til">${ic('globe')}${L().toUpperCase()}<span>▾</span></button>
     ${UI.langOpen ? `<div class="langpop">${LANGS.map(([k, n]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}"><b>${k.toUpperCase()}</b>${n}${L() === k ? `<i>${ic('check')}</i>` : ''}</button>`).join('')}</div>` : ''}</div>
    <button class="ib" data-act="theme">${ic(th === 'dark' ? 'sun' : 'moon')}</button></header>
   <div class="page">${pages[UI.page]()}</div></main>
   ${['home', 'tx', 'report'].includes(UI.page) ? `<button class="fab" data-act="add" aria-label="${t('add')}">${ic('plus')}</button>` : ''}
   <nav class="nav">${[['home', 'home'], ['tx', 'list'], ['report', 'chart'], ['plan', 'target'], ['more', 'menu']].map(([p, i]) => `<button class="${navOn === p ? 'on' : ''}" data-pg="${p}">${ic(i)}${t('nav_' + p)}</button>`).join('')}</nav></div>`;
}

/* ---------- Boşqa (menyu) ---------- */
function famSheet() {
  modal(`${mhead('👨‍👩‍👧 ' + t('fam_share'))}<div class="mb">
   <p class="small muted" style="margin:0">${t('fam_share_s')}</p>
   <button class="btn w" data-act="syncsend">${ic('share')}${t('sync_send')}</button>
   <button class="btn alt w" data-act="syncget">${ic('import')}${t('sync_get')}</button>
   <div class="tip"><span>💡</span><div>${Platform.native ? t('fam_tip_apk') : t('fam_tip_web', { b: t('sync_get') })}</div></div>
   <div class="small muted">${DB.settings.sync_oxirgi ? t('sync_last', { d: DB.settings.sync_oxirgi }) : t('sync_never')}</div></div>`);
}
function pageMore() {
  const L_ = LESSONS[L()] || LESSONS.uz, done = L_.filter(x => (DB.settings.bilim || {})[x.id]?.ok).length;
  const usd = rateItem('USD');
  const item = (pg, e, ttl, sub) => `<button class="mi" data-pg="${pg}"><div class="ico">${e}</div><div class="tx"><b>${ttl}</b><small>${sub}</small></div>${ic('right')}</button>`;
  return `<div class="card" style="padding:6px 12px">
   <button class="mi" data-act="famsheet"><div class="ico">👨‍👩‍👧</div><div class="tx"><b>${t('fam_share')}</b><small>${DB.settings.sync_oxirgi ? t('sync_last', { d: DB.settings.sync_oxirgi }) : t('sync_never')}</small></div>${ic('right')}</button>
   ${item('rates', '💱', t('pg_rates'), usd ? `1 $ = ${fmt(usd.r)}${DB.rates.date ? ' · ' + DB.rates.date : ''}` : t('rates_sub'))}
   ${item('loan', '🏦', t('pg_loan'), t('loan_sub'))}
   ${item('learn', '📚', t('pg_learn'), t('learn_prog', { a: done, b: L_.length }))}
   ${item('settings', '⚙️', t('pg_settings'), t('settings_sub'))}
   ${item('feedback', '💬', t('pg_feedback'), t('fb_menu'))}</div>
   <div class="small muted" style="text-align:center">${t('app')} · v${APPV}</div>`;
}

/* ---------- Valyuta kurslari ---------- */
let CONV = { a: '100', f: 'USD', to: 'UZS', q: '', init: false };
const FLAG = c => c === 'EUR' ? '🇪🇺' : c === 'UZS' ? '🇺🇿' : /^X/.test(c) ? '🌐' : String.fromCodePoint(...[...c.slice(0, 2)].map(ch => 0x1F1A5 + ch.charCodeAt(0)));
const uzsOf = c => c === 'UZS' ? 1 : rateOf(c);
const fmtCv = (n, c) => { const d = c === 'UZS' && Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 1 ? 2 : 4; return sp(n.toFixed(d).split('.')[0]) + (d ? ',' + n.toFixed(d).split('.')[1] : ''); };
function convSave() { DB.settings.conv = { f: CONV.f, to: CONV.to }; Platform.save(DB); }
function pageRates() {
  const R = DB.rates;
  const head = `<div class="card"><div class="ch"><div><h2>🏦 ${t('cbu')}</h2><p>${R ? t('rates_date', { d: esc(R.date || '') }) : t('rates_none')}</p></div><button class="btn sm alt" data-act="ratesref">${ic('swap')}${t('refresh')}</button></div>
   ${R ? '' : `<div class="tip wn"><span>⚠️</span><div>${t('rates_off')}</div></div><div class="fld" style="margin-top:10px"><label>${t('rate_manual')}</label><input id="setRate" inputmode="decimal" value="${sp(DB.settings.kurs)}"></div>`}</div>`;
  if (!R) return head;
  if (!CONV.init) { CONV.init = true; const sv = DB.settings.conv; if (sv && sv.f) { CONV.f = sv.f; CONV.to = sv.to || 'UZS'; } }
  const cs = CURS(); if (!cs.includes(CONV.f)) CONV.f = 'USD'; if (!cs.includes(CONV.to)) CONV.to = 'UZS';
  const rf = uzsOf(CONV.f), rt = uzsOf(CONV.to), a = parseAmt(CONV.a), res = rt ? a * rf / rt : 0;
  const opts = sel => cs.map(c => `<option ${c === sel ? 'selected' : ''} value="${c}">${FLAG(c)} ${c} — ${esc(curName(c))}</option>`).join('');
  const quick = ['USD', 'EUR', 'RUB', 'KZT', 'CNY', 'TRY'].filter(c => cs.includes(c));
  const conv = `<div class="card cvc"><div class="ch"><h2>🧮 ${t('calc')}</h2></div>
   <div class="chips" style="flex-wrap:wrap;margin-bottom:12px">${quick.map(c => `<button class="chip ${CONV.f === c ? 'on' : ''}" data-cvq="${c}">${FLAG(c)} ${c}</button>`).join('')}</div>
   <div class="cvbox"><small>${t('cv_give')}</small><div class="cvrow"><select id="cvf">${opts(CONV.f)}</select><input id="cva" inputmode="decimal" value="${esc(fmtInput(CONV.a))}" aria-label="${t('sum')}"></div></div>
   <div class="cvsw"><button class="ib" data-act="cvswap" aria-label="swap">${ic('swap')}</button></div>
   <div class="cvbox got"><small>${t('cv_get')}</small><div class="cvrow"><select id="cvt">${opts(CONV.to)}</select><b class="num">${fmtCv(res, CONV.to)}</b></div></div>
   ${(() => { if (!(a > 0)) return ''; if (CONV.to === 'UZS' && CONV.f !== 'UZS') { const x = bankBest(CONV.f, 'b'); if (x) return `<div class="tip" style="margin-top:12px"><span>🏦</span><div>${t('bk_cv_sell', { a: fmtCv(a, CONV.f) + ' ' + CONV.f, b: esc(bankName(x.n)), s: fmt(a * x.b) })}</div></div>`; }
     if (CONV.f === 'UZS' && CONV.to !== 'UZS') { const x = bankBest(CONV.to, 's'); if (x) return `<div class="tip" style="margin-top:12px"><span>🏦</span><div>${t('bk_cv_buy', { a: fmt(a), b: esc(bankName(x.n)), s: fmtCv(a / x.s, CONV.to) + ' ' + CONV.to })}</div></div>`; } return ''; })()}
   <div class="small" style="margin-top:12px;display:grid;gap:4px"><span>1 ${CONV.f} = <b>${fmtCv(rf / rt, CONV.to)}</b> ${CONV.to}</span><span>1 ${CONV.to} = <b>${fmtCv(rt / rf, CONV.f)}</b> ${CONV.f}</span></div>
   <div class="small muted" style="margin-top:8px">${t('cv_note')}</div></div>`;
  const q = CONV.q.trim().toLowerCase();
  const top = ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'KZT', 'TRY', 'JPY'];
  const list = [...R.list].sort((x, y) => { const i = top.indexOf(x.c), j = top.indexOf(y.c); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j) || x.c.localeCompare(y.c); })
    .filter(x => !q || x.c.toLowerCase().includes(q) || Object.values(x.n).join(' ').toLowerCase().includes(q));
  return `${head}${conv}${banksCard()}<div class="card"><div class="fld" style="margin-bottom:6px"><input id="rq" placeholder="${t('search')}" value="${esc(CONV.q)}"></div>
   ${list.map(x => `<div class="row" data-rc="${x.c}" style="cursor:pointer"><div class="ico sm" style="font-size:12px;font-weight:800;font-family:var(--fm)">${x.c}</div><div class="tx"><b>${esc(x.n[L()] || x.n.uz)}</b><small>1 ${x.c}</small></div><div class="pct num" style="text-align:right"><b>${sp(Math.floor(x.r))}${(x.r % 1).toFixed(2).slice(1)}</b><small class="${x.d > 0 ? 'neg' : x.d < 0 ? 'pos' : 'muted'}">${x.d > 0 ? '▲' : x.d < 0 ? '▼' : '='} ${Math.abs(x.d).toFixed(2)}</small></div></div>`).join('')}</div>`;
}

/* ---------- Boşlaş (birinçi marta) ---------- */
let OB = { step: 1, rol: '', soni: 0 };
const ROLES = ['ota', 'ona', 'er', 'xotin', 'farzand', 'boshqa'];
function onboarding() {
  const st = DB.settings, y = new Date().getFullYear();
  const steps = `<div class="obst">${[1, 2, 3].map(i => `<i class="${OB.step >= i ? 'on' : ''}"></i>`).join('')}</div>`;
  let body;
  if (OB.step === 1) body = `<div class="card" style="display:grid;gap:14px"><h3 style="margin:0">👤 ${t('ob_s1')}</h3>
    <div class="fld"><label>${t('ob_name')} *</label><input id="obName" value="${esc(OB.ism || '')}" placeholder="${t('ob_name_ph')}" maxlength="30" autocomplete="off"></div>
    <div class="fld"><label>${t('ob_year')} *</label><input id="obYear" inputmode="numeric" maxlength="4" value="${esc(OB.yil || '')}" placeholder="${y - 30}"></div>
    <div><div class="small muted" style="margin-bottom:6px">${t('ob_role')} *</div><div class="chips" style="flex-wrap:wrap">${ROLES.map(r => `<button class="chip ${OB.rol === r ? 'on' : ''}" data-obrol="${r}">${t('role_' + r)}</button>`).join('')}</div></div>
    <div><div class="small muted" style="margin-bottom:6px">${t('ob_fam')} *</div><div class="chips" style="flex-wrap:wrap">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button class="chip ${OB.soni === n ? 'on' : ''}" data-obsoni="${n}">${n === 7 ? '7+' : n}</button>`).join('')}</div></div>
    <div class="fld"><label>${t('ob_city')} <span class="muted">(${t('optional')})</span></label><input id="obCity" value="${esc(OB.shahar || '')}" placeholder="${t('ob_city_ph')}" maxlength="30"></div></div>`;
  else if (OB.step === 2) body = `<div class="card" style="display:grid;gap:14px"><h3 style="margin:0">👛 ${t('ob_s2')}</h3>
    <div class="small muted">${t('ob_start')}</div>
    ${W().map(w => `<div class="fld"><label>${w.e} ${walName(w)} (${unit(w.cur)})</label><input data-ob="${w.id}" inputmode="decimal" placeholder="0" value="${esc((OB.bal || {})[w.id] || '')}"></div>`).join('')}</div>`;
  else body = `<div class="card" style="display:grid;gap:12px"><h3 style="margin:0">🔒 ${t('ob_s3')}</h3>
    <div class="tip"><span>🛡️</span><div>${t('ob_priv')}</div></div>
    <div class="small muted">${t('ob_pin_s')}</div>
    <button class="btn w" data-act="obpin">🔒 ${t('ob_pin_btn')}</button>
    <button class="btn alt w" data-act="obfinish">${t('later')}</button></div>`;
  $('#root').innerHTML = `<div class="app"><main class="main"><div class="page" style="padding-top:calc(24px + env(safe-area-inset-top))">
   <div style="text-align:center"><div class="lock" style="position:static;background:none;padding:0;gap:10px"><div class="mk">💰</div><h2>${t('app')}</h2></div><p class="muted" style="margin:6px 0 0">${t('ob_sub')}</p></div>
   ${OB.step === 1 ? `<div class="seg full">${LANGS.map(([k, n]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}">${n}</button>`).join('')}</div>` : ''}
   ${steps}${body}
   ${OB.step === 1 ? `<button class="btn alt sm" data-act="obrestore" style="justify-self:center">♻️ ${t('ob_restore')}</button>` : ''}
   ${OB.step < 3 ? `<div class="g2">${OB.step > 1 ? `<button class="btn alt" data-act="obback">← ${t('back')}</button>` : '<span></span>'}<button class="btn" data-act="obnext">${t('next')} →</button></div>` : `<button class="btn alt sm" data-act="obback" style="justify-self:start">← ${t('back')}</button>`}
   </div></main></div>`;
}
function obRead() {
  if ($('#obName')) { OB.ism = $('#obName').value.trim(); OB.yil = $('#obYear').value.trim(); OB.shahar = $('#obCity').value.trim(); }
  if (OB.step === 2) { OB.bal = {}; document.querySelectorAll('[data-ob]').forEach(i => OB.bal[i.dataset.ob] = i.value); if ($('#obRate')) OB.kurs = $('#obRate').value; }
}
function obNext() {
  obRead();
  if (OB.step === 1) { const y = new Date().getFullYear(), yr = +OB.yil;
    if (!OB.ism) { $('#obName').classList.add('err'); $('#obName').focus(); return toast(t('e_name'), 'bd'); }
    if (!(yr >= 1920 && yr <= y - 5)) { $('#obYear').classList.add('err'); $('#obYear').focus(); return toast(t('e_year'), 'bd'); }
    if (!OB.rol) return toast(t('e_role'), 'bd');
    if (!OB.soni) return toast(t('e_fam'), 'bd'); }
  OB.step++; onboarding();
}
async function obFinish(withPin) {
  const st = DB.settings; st.ism = OB.ism; st.yil = +OB.yil; st.rol = OB.rol; st.oila_soni = OB.soni; st.shahar = OB.shahar || '';
  if (OB.kurs) st.kurs = parseAmt(OB.kurs) || st.kurs;
  W().forEach(w => { w.start = parseAmt((OB.bal || {})[w.id] || '0'); w.egasi = OB.ism; touch(w); });
  await persist(); render(); afterUnlock();
  if (withPin) showLock('set');
}

const NEAR = () => +DB.settings.ogoh || 80;
/* ---------- Boş sahifa ---------- */
function homeAlerts() {
  const alerts = [], d = today();
  for (const c of live(DB.cats).filter(c => c.tur === 'x' && c.limit > 0)) {
    const s = catSpentMonth(c.id), p = s / c.limit * 100;
    if (p >= 100) alerts.push(['var(--bad)', `${c.e} ${t('al_over', { c: catName(c), p: Math.round(p) })}`, `data-catd="${c.id}" data-src="cur"`]);
    else if (p >= NEAR()) alerts.push(['var(--warn)', `${c.e} ${t('al_near', { c: catName(c), p: Math.round(p) })}`, `data-catd="${c.id}" data-src="cur"`]);
  }
  for (const x of recUnpaidThisMonth()) { const due = recDue(x, d), n = Math.round((due - d) / 864e5); if (n <= 3) alerts.push([n < 0 ? 'var(--bad)' : 'var(--warn)', `🔁 ${t(n < 0 ? 'al_rec_late' : n === 0 ? 'al_rec_today' : 'al_rec_soon', { n: esc(x.nom), d: n })} — ${money(x.s, (walById(x.w) || {}).cur)}`, `data-recedit="${x.id}"`]); }
  for (const x of live(DB.debts).filter(x => !x.yopiq && x.muddat)) { const n = Math.round((pd(x.muddat) - d) / 864e5); if (n <= 3) alerts.push([n < 0 ? 'var(--bad)' : 'var(--warn)', `🤝 ${t(x.tur === 'berdim' ? 'al_debt_in' : 'al_debt_out', { k: esc(x.kim) })}: ${money(debtLeft(x), x.cur)} — ${n < 0 ? t('overdue') : fmtDay(pd(x.muddat))}`, `data-debt="${x.id}"`]); }
  { const d = today(); if ((d.getMonth() === 11 && d.getDate() >= 20) || (d.getMonth() === 0 && d.getDate() <= 10)) alerts.push(['var(--acc)', `🎉 ${t('ys_ready')}`, 'data-act="yearsum"']); }
  if (syncDue()) alerts.push(['var(--acc)', `👨‍👩‍👧 ${t('sync_due', { d: DB.settings.sync_ts ? Math.floor((Date.now() - DB.settings.sync_ts) / 864e5) : 7 })}`, 'data-act="syncsend"']);
  return alerts;
}
function rateChips() {
  if (!DB.rates) return '';
  const it = ['USD', 'EUR', 'RUB'].map(rateItem).filter(Boolean);
  return `<div class="rates" data-pg="rates">${it.map(x => `<div><small>${SYM[x.c] || x.c} ${x.c}</small><b class="num">${sp(x.r.toFixed(2)).replace(/ (\d\d)$/, '.$1')}</b><em class="${x.d > 0 ? 'neg' : x.d < 0 ? 'pos' : 'muted'}">${x.d > 0 ? '▲' : x.d < 0 ? '▼' : '='}${Math.abs(x.d).toFixed(2)}</em></div>`).join('')}<span class="muted">${ic('right')}</span></div>`;
}
function dailyTip() {
  const tips = (TIPS[L()] || TIPS.uz);
  const tip = tips[Math.floor((today() - new Date(2026, 0, 1)) / 864e5) % tips.length];
  return `<div class="card tipc" data-pg="learn"><div class="em">💡</div><div><small>${t('tip_day')}</small><div>${tip}</div></div><span class="muted">${ic('right')}</span></div>`;
}
function planCard() {
  const P = savePlan();
  if (P.inc <= 0) return `<div class="card"><div class="ch"><h2>🐷 ${t('plan_t')}</h2></div><div class="small muted">${t('allow_noinc_s')}</div></div>`;
  const over = P.remaining < 0, pc = P.allowed > 0 ? Math.min(100, P.spent / P.allowed * 100) : 100;
  const col = over ? 'var(--bad)' : pc >= 85 ? 'var(--warn)' : 'var(--good)';
  return `<div class="card"><div class="ch"><div><h2>🐷 ${t('plan_t')}</h2><p>${t('plan_goal', { s: money(P.target), p: P.p })}</p></div><button class="ib pl" data-act="planedit">${ic('edit')}</button></div>
   <b class="num" style="font-family:var(--fd);font-size:19px;color:${over ? 'var(--bad)' : 'inherit'}">${over ? t('plan_over', { s: money(-P.remaining) }) : t('plan_day', { s: money(P.perDay) })}</b>
   <div class="bar" style="height:10px;margin:10px 0 6px"><i style="width:${pc}%;--c:${col}"></i></div>
   <div class="small muted">${t('plan_spent', { a: money(P.spent), b: money(Math.max(0, P.allowed)) })} · ${t('days_left', { d: P.daysLeft })}${P.recLeft ? ' · ' + t('allow_rec', { s: money(P.recLeft) }) : ''}</div></div>`;
}
function pageHome() {
  const r = monthRange(UI.homeOff), S = stats(r), H = health(), cur = UI.homeOff === 0, hid = DB.settings.yashir;
  const alerts = cur ? homeAlerts() : [];
  const recent = live(DB.tx).sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u).slice(0, 5);
  return `
  <div class="hero"><div class="tot" data-act="walsheet"><small>${t('total_bal')} ›</small><div class="big num">${money(totalBalance())}</div></div>
   <button class="eye" data-act="eye" aria-label="eye">${hid ? '🙈' : '👁'}</button>
   <div class="mnav" style="margin:-4px 0 10px;position:relative;z-index:1;color:#fff"><button class="ib pl" style="color:#fff" data-hoff="-1">${ic('left')}</button><b style="font-size:13.5px;text-align:center">${r.label}${r.span ? `<small class="span" style="color:rgba(255,255,255,.8)">${r.span}</small>` : ''}</b><button class="ib pl" style="color:#fff;${cur ? 'opacity:.3' : ''}" data-hoff="1" ${cur ? 'disabled' : ''}>${ic('right')}</button></div>
   <div class="two"><div data-act="incsheet" style="cursor:pointer"><small>↓ ${t('income')} ›</small><b class="num">${money(S.inc)}</b></div><div data-act="expsheet" style="cursor:pointer"><small>↑ ${t('expense')} ›</small><b class="num">${money(S.exp)}</b></div></div></div>
  ${rateChips()}
  ${cur ? shopCard() : ''}
  ${alerts.length ? `<div style="display:grid;gap:8px">${alerts.map(([c, m, a]) => `<div class="alert" style="--c:${c}" ${a || ''}><span style="flex:1">${m}</span>${a ? ic('right') : ''}</div>`).join('')}</div>` : ''}
  ${cur ? planCard() : ''}
  ${cur && H ? `<div class="card"><div class="health">${ringSvg(H.score, H.col)}<div><div class="small muted">${t('health')}</div><div class="lbl" style="color:${H.col}">${t(H.lvl)}</div><div class="tip" style="padding:0;border:0;background:none;margin-top:4px">${H.tip}</div></div></div></div>` : ''}
  ${dailyTip()}
  <div class="card"><div class="ch"><h2>${t('recent')}</h2><button class="lnk" data-pg="tx">${t('all')} →</button></div>
   ${recent.length ? recent.map((x, i) => txRow(x, i, hid)).join('') : `<div class="empty"><div class="em">🧾</div><b>${t('no_tx')}</b>${t('no_tx_s')}</div>`}</div>`;
}
function walletSheet() {
  const ws = W(); const tot = totalBalance();
  const byCur = {}; ws.forEach(w => { byCur[w.cur] = (byCur[w.cur] || 0) + balance(w); });
  modal(`${mhead(t('where_money'))}<div class="mb">
   <div class="kp" style="text-align:center"><small>${t('total_bal')}</small><b class="num" style="font-size:24px">${money(tot)}</b></div>
   <div>${ws.map(w => { const b = balance(w), uzs = toUZS(b, w.cur), pc = tot > 0 ? Math.max(0, uzs) / tot * 100 : 0;
     return `<div class="row"><div class="ico sm">${w.e}</div><div class="tx"><b>${esc(walName(w))}</b><div class="bar" style="margin-top:5px"><i style="width:${pc}%"></i></div></div><div class="pct num" style="text-align:right"><b class="${b < 0 ? 'neg' : ''}">${money(b, w.cur)}</b>${w.cur !== 'UZS' ? `<small class="muted">≈ ${money(uzs)}</small>` : `<small class="muted">${Math.round(pc)}%</small>`}</div></div>`; }).join('')}</div>
   ${Object.keys(byCur).length > 1 ? `<div class="chips" style="flex-wrap:wrap">${Object.entries(byCur).map(([c, v]) => `<span class="chip">${c}: ${money(v, c)}</span>`).join('')}</div>` : ''}
   <div class="g2"><button class="btn sm alt" data-act="transfer">${ic('swap')}${t('transfer')}</button><button class="btn sm alt" data-pg="settings">${ic('gear')}${t('wallets')}</button></div></div>`);
}
function typeSheet(tur) {
  const r = monthRange(UI.homeOff), S = stats(r), by = tur === 'd' ? S.byInc : S.byCat, tot = tur === 'd' ? S.inc : S.exp;
  const xs = S.list.filter(x => x.tur === tur).sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u);
  const cnt = {}; xs.forEach(x => cnt[x.c] = (cnt[x.c] || 0) + 1);
  modal(`${mhead((tur === 'd' ? '↓ ' + t('income') : '↑ ' + t('expense')) + ' · ' + r.label)}<div class="mb">
   <div class="kp" style="text-align:center"><b class="num ${tur === 'd' ? 'pos' : 'neg'}" style="font-size:24px">${money(tot)}</b><small>${t('ops_n', { n: xs.length })}</small></div>
   ${tot ? `<div>${Object.entries(by).sort((a, b) => b[1] - a[1]).map(([id, v]) => { const c = catById(id);
      return `<div class="row tap" data-catd="${id}" data-src="home"><div class="ico sm" style="--c:${catColor(c)}">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))} <span class="cnt">${t('times', { n: cnt[id] })}</span></b><div class="bar" style="margin-top:5px"><i style="width:${v / tot * 100}%;--c:${catColor(c)}"></i></div></div><div class="pct num">${money(v)}<small>${(v / tot * 100).toFixed(1)}%</small></div></div>`; }).join('')}</div>` : `<div class="empty"><div class="em">🧾</div><b>${t('no_tx')}</b></div>`}
   ${xs.length ? `<div><div class="small muted" style="margin:4px 0 8px">${t('recent')}</div>${xs.slice(0, 8).map((x, i) => txRow(x, i, DB.settings.yashir)).join('')}</div>` : ''}
   <button class="btn alt w" data-act="seeall" data-tt="${tur}">${t('all')} →</button></div>`);
}

function catSheet(cid, src) {
  const rep = src === 'rep', r = rep ? range(UI.per, UI.off) : monthRange(src === 'cur' ? 0 : UI.homeOff), who = rep ? UI.who : '';
  const c = catById(cid), xs = stats(r, who).list.filter(x => x.c === cid).sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u);
  const tot = xs.reduce((s, x) => s + txUZS(x), 0), inc = c && c.tur === 'd';
  const days = {}; xs.forEach(x => (days[x.dt] = days[x.dt] || []).push(x)); let i = 0;
  modal(`${mhead(`${c ? c.e : '❓'} ${esc(catName(c))} · ${r.label}${who ? ' · 👤 ' + esc(who) : ''}`)}<div class="mb">
   ${c && c.limit > 0 && c.tur === 'x' && (src === 'cur' || (!rep && UI.homeOff === 0)) ? (() => { const p = tot / c.limit * 100, col = p >= 100 ? 'var(--bad)' : p >= NEAR() ? 'var(--warn)' : 'var(--good)';
     return `<div class="kp"><small>${t('limit_month')}: ${money(c.limit)}</small><div class="bar" style="margin:8px 0 4px;height:10px"><i style="width:${Math.min(100, p)}%;--c:${col}"></i></div><small style="color:${col}">${Math.round(p)}% · ${p >= 100 ? t('over_by', { s: money(tot - c.limit) }) : t('left_s', { s: money(c.limit - tot) })}</small></div>`; })() : ''}
   <div class="g2"><div class="kp"><small>${t('jami')}</small><b class="num ${inc ? 'pos' : 'neg'}">${money(tot)}</b><small>${t('times', { n: xs.length })}</small></div>
   <div class="kp"><small>${t('avg_one')}</small><b class="num">${money(xs.length ? tot / xs.length : 0)}</b></div></div>
   ${xs.length ? `<div>${Object.entries(days).map(([d, list]) => { const sum = list.reduce((s, x) => s + txUZS(x), 0);
     return `<div class="dh"><span>${fmtDay(pd(d))}, ${I18N[L()].wd[(pd(d).getDay() + 6) % 7]}</span><span class="${inc ? 'pos' : 'neg'}">${money(sum)}</span></div>${list.map(x => txRow(x, i++, DB.settings.yashir)).join('')}`; }).join('')}</div>
   <div class="small muted" style="text-align:center">${t('tap_edit')}</div>` : `<div class="empty"><div class="em">🧾</div><b>${t('no_tx')}</b></div>`}</div>`);
}

function ringSvg(v, col) {
  const R = 36, C = 2 * Math.PI * R;
  return `<div class="ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="${R}" fill="none" stroke="var(--s3)" stroke-width="8"/><circle cx="42" cy="42" r="${R}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C * v / 100} ${C}"/></svg><b>${v}</b></div>`;
}
function txRow(x, i = 0, hid = false) {
  const F = hid ? money : fmt;
  const w = walById(x.w), c = catById(x.c);
  let icon, title, sub, am, cls;
  if (x.tur === 'o') { const w2 = walById(x.w2); icon = '🔄'; title = t('transfer'); sub = `${walName(w)} → ${walName(w2)}`; am = F(x.s, w && w.cur); cls = ''; }
  else { icon = c ? c.e : '❓'; title = catName(c); sub = [x.n, walName(w)].filter(Boolean).map(esc).join(' · '); am = F(x.s, w && w.cur, x.tur === 'd'); cls = x.tur === 'd' ? 'pos' : ''; if (x.tur === 'x') am = '−' + am; }
  const who = members().length > 1 && x.kim ? ` · 👤 ${esc(x.kim)}` : '';
  return `<div class="tr" style="--i:${i}" data-txv="${x.id}"><div class="ico sm" style="--c:${c ? catColor(c) : 'var(--acc)'}">${icon}</div><div class="tx"><b>${esc(title)}</b><small>${sub}${who}</small></div><div class="am num ${cls}">${am}<small>${fmtDay(pd(x.dt))}</small></div></div>`;
}

/* ---------- Amallar ---------- */
function pageTx() {
  const r = range(UI.per, UI.off), q = UI.q.trim().toLowerCase(), mem = members();
  let xs = live(DB.tx).filter(x => inR(x, r) && (!UI.txType || x.tur === UI.txType) && (!UI.who || x.kim === UI.who));
  if (q) xs = xs.filter(x => [catName(catById(x.c)), x.n, walName(walById(x.w)), x.kim].join(' ').toLowerCase().includes(q));
  xs.sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u);
  const days = {}; xs.forEach(x => (days[x.dt] = days[x.dt] || []).push(x));
  let i = 0;
  return `${perSeg()}${perNav(r)}
  <div class="seg full">${[['', 'all'], ['x', 'expenses'], ['d', 'incomes'], ['o', 'transfers']].map(([k, l]) => `<button class="${UI.txType === k ? 'on' : ''}" data-ttype="${k}">${t(l)}</button>`).join('')}</div>
  <div class="filt"><div class="fld"><input id="q" placeholder="${t('search')}" value="${esc(UI.q)}"></div>
   ${mem.length > 1 ? `<div class="fld" style="max-width:160px"><select id="who"><option value="">👥 ${t('everyone')}</option>${mem.map(m => `<option ${UI.who === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select></div>` : ''}</div>
  ${xs.length ? Object.entries(days).map(([d, list]) => {
    const net = list.reduce((s, x) => s + (x.tur === 'd' ? txUZS(x) : x.tur === 'x' ? -txUZS(x) : 0), 0);
    return `<div><div class="dh"><span>${fmtDay(pd(d))}, ${I18N[L()].wd[(pd(d).getDay() + 6) % 7]}</span><span class="${net >= 0 ? 'pos' : 'neg'}">${fmt(net, 'UZS', true)}</span></div>${list.map(x => txRow(x, i++)).join('')}</div>`;
  }).join('') : `<div class="card"><div class="empty"><div class="em">🔍</div><b>${t('no_tx')}</b></div></div>`}`;
}

/* ---------- Hisobot ---------- */
/* rangli aylana + çiziqli yozuvlar */
function donutSvg(cats, tot) {
  if (!cats.length || !(tot > 0)) return '';
  const W_ = 360, H_ = 250, cx = 180, cy = 125, R = 60, C = 2 * Math.PI * R;
  let sl = [], other = 0;
  cats.forEach(([id, v]) => { if (v / tot < 0.03 && cats.length > 6) other += v; else sl.push({ id, v }); });
  if (other) sl.push({ id: null, v: other });
  let off = 0, a0 = -Math.PI / 2; const rings = [], labs = [];
  sl.forEach(x => { const len = x.v / tot * C, c = x.id ? catById(x.id) : null, col = x.id ? catColor(c) : 'var(--faint)';
    rings.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${col}" stroke-width="24" stroke-dasharray="${Math.max(0, len - 1.5)} ${C}" stroke-dashoffset="${-off}"/>`);
    const am = a0 + (x.v / tot) * Math.PI; a0 += (x.v / tot) * 2 * Math.PI; off += len;
    const nm = x.id ? catName(c) : t('others');
    labs.push({ col, am, side: Math.cos(am) >= 0 ? 1 : -1, y: cy + Math.sin(am) * (R + 30), txt: (nm.length > 12 ? nm.slice(0, 11) + '…' : nm), pc: Math.round(x.v / tot * 100) }); });
  for (const sd of [1, -1]) { const g = labs.filter(l => l.side === sd).sort((p, q) => p.y - q.y);
    for (let i = 0; i < g.length; i++) { g[i].y = Math.max(g[i].y, i ? g[i - 1].y + 17 : 12); }
    for (let i = g.length - 1; i >= 0; i--) { g[i].y = Math.min(g[i].y, i < g.length - 1 ? g[i + 1].y - 17 : H_ - 8); } }
  const lines = labs.map(l => { const x1 = cx + Math.cos(l.am) * (R + 13), y1 = cy + Math.sin(l.am) * (R + 13), x2 = cx + Math.cos(l.am) * (R + 26), xe = cx + l.side * (R + 40);
    const tx = xe + l.side * 4;
    return `<polyline points="${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${l.y.toFixed(1)} ${xe.toFixed(1)},${l.y.toFixed(1)}" fill="none" stroke="${l.col}" stroke-width="1.4"/><circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="2.2" fill="${l.col}"/>
     <text x="${tx.toFixed(1)}" y="${(l.y + 4).toFixed(1)}" text-anchor="${l.side > 0 ? 'start' : 'end'}" class="dl">${esc(l.txt)} <tspan class="dp">${l.pc}%</tspan></text>`; }).join('');
  return `<div class="donut"><svg viewBox="0 0 ${W_} ${H_}"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--s3)" stroke-width="24"/><g transform="rotate(-90 ${cx} ${cy})">${rings.join('')}</g>${lines}</svg><div class="ctr"><div><b class="num">${short(tot)}</b><small>${t('expense')}</small></div></div></div>`;
}

function pageReport() {
  const r = range(UI.per, UI.off), S = stats(r, UI.who), P = stats(range(UI.per, UI.off - 1), UI.who), mem = members();
  const bal = S.inc - S.exp, saveP = S.inc > 0 ? Math.round((bal + S.byGroup.j) / S.inc * 100) : null;
  const chg = (a, b) => b > 0 ? Math.round((a - b) / b * 100) : null;
  const ce = chg(S.exp, P.exp), ci = chg(S.inc, P.inc);
  const cats = Object.entries(S.byCat).sort((a, b) => b[1] - a[1]);
  const cnt = {}; S.list.forEach(x => cnt[x.c] = (cnt[x.c] || 0) + 1);
  const donut = donutSvg(cats, S.exp);
  const pill = (v, a, b, invert) => { if (v === null && !(a - b)) return ''; const dv = a - b, bad = (dv > 0) !== !!invert;
    return `<em style="color:${dv === 0 ? 'var(--muted)' : bad ? 'var(--bad)' : 'var(--good)'}">${dv > 0 ? '▲' : dv < 0 ? '▼' : '='} ${v === null ? t('new_s') : Math.abs(v) + '%'} · ${fmt(dv, 'UZS', true)}</em>`; };
  const changes = [...new Set([...Object.keys(S.byCat), ...Object.keys(P.byCat)])].map(id => ({ id, a: S.byCat[id] || 0, b: P.byCat[id] || 0 })).map(x => ({ ...x, d: x.a - x.b })).filter(x => x.d);
  const up = changes.filter(x => x.d > 0).sort((p, q) => q.d - p.d).slice(0, 3), down = changes.filter(x => x.d < 0).sort((p, q) => p.d - q.d).slice(0, 3);
  const chRow = x => { const c = catById(x.id), pc = x.b > 0 ? Math.round(x.d / x.b * 100) : null;
    return `<div class="row"><div class="ico sm" style="--c:${catColor(c)}">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))}</b><small>${fmt(x.b)} → ${fmt(x.a)}</small></div><div class="pct num ${x.d > 0 ? 'neg' : 'pos'}">${fmt(x.d, 'UZS', true)}<small>${pc === null ? t('new_s') : (x.d > 0 ? '▲' : '▼') + Math.abs(pc) + '%'}</small></div></div>`; };
  return `${perSeg()}${perNav(r)}
  ${mem.length > 1 ? `<div class="chips">${['', ...mem].map(m => `<button class="chip ${UI.who === m ? 'on' : ''}" data-whochip="${esc(m)}">${m ? '👤 ' + esc(m) : '👥 ' + t('everyone')}</button>`).join('')}</div>` : ''}
  <div class="sum3">
   <div class="kp"><small>${t('income')}</small><b class="num pos">${fmt(S.inc)}</b>${pill(ci, S.inc, P.inc, true)}</div>
   <div class="kp"><small>${t('expense')}</small><b class="num neg">${fmt(S.exp)}</b>${pill(ce, S.exp, P.exp)}</div>
   <div class="kp"><small>${t('left')}</small><b class="num ${bal < 0 ? 'neg' : ''}">${fmt(bal, 'UZS', true)}</b></div>
   <div class="kp"><small>${t('save_rate')}</small><b class="num">${saveP === null ? '—' : saveP + '%'}</b></div></div>
  <div class="card"><div class="ch"><h2>🍩 ${t('by_cat')}</h2>${ce !== null ? `<span class="small muted">${t('vs_prev')}</span>` : ''}</div>
   ${cats.length ? donut + `<div class="cl">${cats.map(([id, v]) => { const c = catById(id), p = v / S.exp * 100, pv = P.byCat[id] || 0, d = chg(v, pv);
      return `<div class="row tap" data-catd="${id}" data-src="rep"><div class="ico sm" style="--c:${catColor(c)}">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))} <span class="cnt">${t('times', { n: cnt[id] })}</span></b><div class="bar" style="margin-top:5px"><i style="width:${p}%;--c:${catColor(c)}"></i></div></div><div class="pct num">${fmt(v)}<small>${p.toFixed(1)}% ${d === null ? (pv ? '' : `<span class="muted">· ${t('new_s')}</span>`) : `<span style="color:${d > 0 ? 'var(--bad)' : 'var(--good)'}">${d > 0 ? '▲' : '▼'}${Math.abs(d)}% (${fmt(v - pv, 'UZS', true)})</span>`}</small></div></div>`; }).join('')}</div>`
      : `<div class="empty"><div class="em">📊</div><b>${t('no_exp')}</b></div>`}</div>
  ${up.length || down.length ? `<div class="card"><div class="ch"><div><h2>🔀 ${t('changes_t')}</h2><p>${t('changes_s', { p: range(UI.per, UI.off - 1).label })}</p></div></div>
   ${up.length ? `<div class="small" style="font-weight:700;color:var(--bad);margin-top:2px">▲ ${t('grew')}</div>${up.map(chRow).join('')}` : ''}
   ${down.length ? `<div class="small" style="font-weight:700;color:var(--good);margin-top:10px">▼ ${t('fell')}</div>${down.map(chRow).join('')}` : ''}</div>` : ''}
  ${UI.who ? (() => { const F = famFlow(r, UI.who); return F.n ? `<div class="card"><div class="ch"><div><h2>👨‍👩‍👧 ${t('fam_flow')}</h2><p>${t('fam_flow_s')}</p></div></div>
   <div class="g2"><div class="kp"><small>${t('fam_got')}</small><b class="num pos">+${money(F.got)}</b></div><div class="kp"><small>${t('fam_gave')}</small><b class="num neg">−${money(F.gave)}</b></div></div>
   ${F.list.map(x => `<div class="row" data-txv="${x.id}" style="cursor:pointer"><div class="ico sm">${x.dir > 0 ? '⬇️' : '⬆️'}</div><div class="tx"><b>${esc(x.dir > 0 ? t('fam_from', { n: x.who }) : t('fam_to', { n: x.who }))}</b><small>${fmtDay(pd(x.dt))}${x.n ? ' · ' + esc(x.n) : ''}</small></div><b class="num ${x.dir > 0 ? 'pos' : 'neg'}">${x.dir > 0 ? '+' : '−'}${money(x.v)}</b></div>`).join('')}</div>` : ''; })() : ''}
  <button class="card mi ysbtn" data-act="yearsum"><div class="ico">🎉</div><div class="tx"><b>${t('ys_btn')}</b><small>${t('ys_btn_s')}</small></div>${ic('right')}</button>
  <div class="card"><div class="ch"><h2>📈 ${t('dynamics')}</h2><span class="small"><span class="pos">■</span> ${t('income')} &nbsp;<span class="neg">■</span> ${t('expense')}</span></div>${barChart(r, UI.who)}</div>
  ${S.inc > 0 ? `<div class="card rule"><div class="ch"><div><h2>⚖️ ${t('rule_t')}</h2><p>${t('rule_s')}</p></div></div>
   ${[['z', 50, 'needs'], ['h', 30, 'wants'], ['j', 20, 'savings_g']].map(([g, target, l]) => { const v = g === 'j' ? Math.max(0, S.inc - S.exp + S.byGroup.j) : S.byGroup[g]; const p = Math.round(v / S.inc * 100); const good = g === 'j' ? p >= target : p <= target;
      return `<div class="r"><span>${t(l)}</span><div class="bar"><i style="width:${Math.min(100, p)}%;--c:${good ? 'var(--good)' : 'var(--warn)'}"></i></div><b class="num">${p}% <span class="muted small">/${target}</span></b></div>`; }).join('')}</div>` : ''}
  ${Object.keys(S.byInc).length ? `<div class="card"><div class="ch"><h2>💼 ${t('inc_src')}</h2></div>${Object.entries(S.byInc).sort((a, b) => b[1] - a[1]).map(([id, v]) => { const c = catById(id); return `<div class="row tap" data-catd="${id}" data-src="rep"><div class="ico sm" style="--c:var(--good)">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))} <span class="cnt">${t('times', { n: cnt[id] })}</span></b></div><div class="pct num pos">${fmt(v)}<small>${Math.round(v / S.inc * 100)}%</small></div></div>`; }).join('')}</div>` : ''}
  ${mem.length > 1 && !UI.who && S.exp ? `<div class="card"><div class="ch"><h2>👥 ${t('by_who')}</h2></div>${Object.entries(S.byWho).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="row"><div class="ico sm">👤</div><div class="tx"><b>${esc(k)}</b><div class="bar" style="margin-top:5px"><i style="width:${v / S.exp * 100}%"></i></div></div><div class="pct num">${fmt(v)}<small>${Math.round(v / S.exp * 100)}%</small></div></div>`).join('')}</div>` : ''}
  <button class="btn alt w" data-act="xlexp">📊 ${t('xl_period')}</button>`;
}
function barChart(r, who) {
  let buckets = [];
  if (r.per === 'week' || r.per === 'month') for (let d = new Date(r.a); d < r.b; d = addDays(d, 1)) buckets.push({ a: new Date(d), b: addDays(d, 1), l: r.per === 'week' ? I18N[L()].wd[(d.getDay() + 6) % 7] : String(d.getDate()) });
  else for (let d = new Date(r.a); d < r.b; d = new Date(d.getFullYear(), d.getMonth() + 1, r.a.getDate())) buckets.push({ a: new Date(d), b: new Date(d.getFullYear(), d.getMonth() + 1, r.a.getDate()), l: monName(d.getMonth()).slice(0, 3) });
  const xs = live(DB.tx).filter(x => x.tur !== 'o' && inR(x, r) && (!who || x.kim === who));
  for (const b of buckets) { b.i = 0; b.e = 0; for (const x of xs) { const d = pd(x.dt); if (d >= b.a && d < b.b) x.tur === 'd' ? b.i += txUZS(x) : b.e += txUZS(x); } }
  const mx = Math.max(1, ...buckets.map(b => Math.max(b.i, b.e)));
  const W = 340, H = 150, n = buckets.length, bw = W / n, pair = r.per === 'quarter' || r.per === 'year' || r.per === 'week';
  const every = n > 16 ? 5 : 1;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 18}">
   ${[0.25, 0.5, 0.75, 1].map(f => `<line x1="0" x2="${W}" y1="${H - H * f}" y2="${H - H * f}" stroke="var(--line)" stroke-width=".6"/>`).join('')}
   ${buckets.map((b, i) => { const x0 = i * bw, w = pair ? bw * 0.34 : bw * 0.62, he = b.e / mx * (H - 6), hi = b.i / mx * (H - 6);
      return (pair ? `<rect x="${x0 + bw * 0.14}" y="${H - hi}" width="${w}" height="${hi}" rx="2" fill="var(--inc)" opacity=".85"/><rect x="${x0 + bw * 0.52}" y="${H - he}" width="${w}" height="${he}" rx="2" fill="var(--exp)" opacity=".85"/>`
        : `<rect x="${x0 + bw * 0.19}" y="${H - he}" width="${w}" height="${he}" rx="1.5" fill="var(--exp)" opacity=".85"/>${b.i ? `<circle cx="${x0 + bw / 2}" cy="${H - Math.min(hi, H - 4)}" r="2.4" fill="var(--inc)"/>` : ''}`)
        + (i % every === 0 ? `<text x="${x0 + bw / 2}" y="${H + 13}" text-anchor="middle">${b.l}</text>` : ''); }).join('')}
   <text x="2" y="10">${short(mx)}</text></svg>`;
}

/* ---------- Rejalar ---------- */
function pagePlan() {
  const tabs = [['budget', '🎯'], ['goals', '🏦'], ['debts', '🤝'], ['rec', '🔁']];
  const body = { budget: planBudget, goals: planGoals, debts: planDebts, rec: planRec }[UI.plan]();
  return `<div class="seg full">${tabs.map(([k, e]) => `<button class="${UI.plan === k ? 'on' : ''}" data-plan="${k}">${e} ${t('pl_' + k)}</button>`).join('')}</div>${body}`;
}
function planBudget() {
  const cats = live(DB.cats).filter(c => c.tur === 'x'), withL = cats.filter(c => c.limit > 0), noL = cats.filter(c => !c.limit);
  const tot = withL.reduce((s, c) => s + c.limit, 0), spent = withL.reduce((s, c) => s + catSpentMonth(c.id), 0);
  return `<div class="tip"><span>💡</span><div>${t('bud_tip', { p: NEAR() })}</div></div>
  <div class="card" style="padding:4px 14px"><div class="row" data-act="nearedit" style="cursor:pointer"><div class="ico sm">🔔</div><div class="tx"><b>${t('near_t')}</b><small>${t('near_s', { p: NEAR() })}</small></div><b class="num" style="color:var(--warn)">${NEAR()}%</b><span class="muted" style="display:flex">${ic('right', 'width:18px;height:18px')}</span></div></div>
  ${withL.length ? `<div class="card"><div class="ch"><div><h2>${t('bud_month', { m: monthRange(0).label })}</h2><p>${fmt(spent)} / ${fmt(tot)}</p></div></div>
   ${withL.map(c => { const s = catSpentMonth(c.id), p = s / c.limit * 100, col = p >= 100 ? 'var(--bad)' : p >= NEAR() ? 'var(--warn)' : 'var(--good)';
     return `<div class="row" data-limit="${c.id}" style="cursor:pointer"><div class="ico sm" style="--c:${catColor(c)}">${c.e}</div><div class="tx"><b>${esc(catName(c))}</b><div class="bar" style="margin:6px 0 3px"><i style="width:${Math.min(100, p)}%;--c:${col}"></i></div><small>${fmt(s)} / ${fmt(c.limit)} · ${p >= 100 ? `<span class="neg">${t('over_by', { s: fmt(s - c.limit) })}</span>` : t('left_s', { s: fmt(c.limit - s) })}</small></div><b class="num" style="color:${col}">${Math.round(p)}%</b></div>`; }).join('')}</div>` : ''}
  <div class="card"><div class="ch"><h2>${t('bud_set')}</h2></div>${noL.map(c => `<div class="row" data-limit="${c.id}" style="cursor:pointer"><div class="ico sm" style="--c:${catColor(c)}">${c.e}</div><div class="tx"><b>${esc(catName(c))}</b><small>${t('this_month')}: ${fmt(catSpentMonth(c.id))}</small></div><span class="lnk">+ ${t('limit')}</span></div>`).join('') || `<div class="small muted">${t('bud_all')}</div>`}</div>`;
}
const goalSaved = g => live(DB.tx).filter(x => x.g === g.id).reduce((s, x) => s + (x.tur === 'd' ? -1 : 1) * txUZS(x), 0) + (+g.boshi || 0);
function planGoals() {
  const gs = live(DB.goals);
  return `${gs.map(g => { const s = goalSaved(g), p = Math.min(100, s / g.maqsad * 100); let per = '';
      if (g.muddat && s < g.maqsad) { const m = Math.max(1, Math.round((pd(g.muddat) - today()) / (864e5 * 30.4))); per = t('goal_per', { s: fmt((g.maqsad - s) / m), m }); }
      return `<div class="card" data-goalv="${g.id}" style="cursor:pointer"><div class="ch"><h2>${g.e} ${esc(g.nom)}</h2><span class="muted">${ic('right')}</span></div>
       <div style="display:flex;justify-content:space-between;align-items:baseline"><b class="num" style="font-family:var(--fd);font-size:20px">${fmt(s)}</b><span class="muted small">/ ${fmt(g.maqsad)}</span></div>
       <div class="bar" style="height:12px;margin:8px 0"><i style="width:${p}%;--c:${p >= 100 ? 'var(--good)' : 'var(--acc)'}"></i></div>
       <div class="small muted">${p >= 100 ? '🎉 ' + t('goal_done') : `${Math.round(p)}% · ${t('left_s', { s: fmt(g.maqsad - s) })}${g.muddat ? ' · ' + t('until', { d: fmtDay(pd(g.muddat)) + ' ' + pd(g.muddat).getFullYear() }) : ''}`}</div>
       ${per ? `<div class="tip" style="margin-top:10px"><span>📅</span><div>${per}</div></div>` : ''}
       ${p < 100 ? `<button class="btn sm w" style="margin-top:12px" data-goaladd="${g.id}">${ic('plus')}${t('goal_add')}</button>` : ''}</div>`; }).join('')}
  ${gs.length ? '' : `<div class="card"><div class="empty"><div class="em">🏦</div><b>${t('no_goals')}</b>${t('no_goals_s')}</div></div>`}
  <button class="btn w" data-act="goalnew">${ic('plus')}${t('goal_new')}</button>`;
}
const debtLeft = x => x.s - (x.qaytdi || []).reduce((s, r) => s + r.s, 0);
function planDebts() {
  const ds = live(DB.debts), open = ds.filter(x => !x.yopiq), closed = ds.filter(x => x.yopiq);
  const sumT = tur => open.filter(x => x.tur === tur).reduce((s, x) => s + toUZS(debtLeft(x), x.cur), 0);
  const item = x => { const left = debtLeft(x), late = x.muddat && !x.yopiq && pd(x.muddat) < today();
    return `<div class="row" data-debt="${x.id}" style="cursor:pointer"><div class="ico sm" style="--c:${x.tur === 'berdim' ? 'var(--good)' : 'var(--bad)'}">${x.tur === 'berdim' ? '↗️' : '↙️'}</div><div class="tx"><b>${esc(x.kim)}</b><small>${fmtDay(pd(x.dt))}${x.muddat ? ` → <span class="${late ? 'neg' : ''}">${fmtDay(pd(x.muddat))}${late ? ' · ' + t('overdue') : ''}</span>` : ''}${x.n ? ' · ' + esc(x.n) : ''}</small></div><div class="pct num" style="text-align:right"><b class="${x.yopiq ? 'muted' : ''}">${fmt(x.yopiq ? x.s : left, x.cur)}</b>${!x.yopiq && left !== x.s ? `<small class="muted">/ ${fmt(x.s, x.cur)}</small>` : ''}${x.yopiq ? `<small class="pos">✓ ${t('closed')}</small>` : ''}</div></div>`; };
  return `<div class="sum3"><div class="kp"><small>↗️ ${t('owed_me')}</small><b class="num pos">${fmt(sumT('berdim'))}</b></div><div class="kp"><small>↙️ ${t('i_owe')}</small><b class="num neg">${fmt(sumT('oldim'))}</b></div></div>
  ${['berdim', 'oldim'].map(k => { const l = open.filter(x => x.tur === k); return l.length ? `<div class="card"><div class="ch"><h2>${t(k === 'berdim' ? 'owed_me' : 'i_owe')}</h2></div>${l.map(item).join('')}</div>` : ''; }).join('')}
  ${!open.length ? `<div class="card"><div class="empty"><div class="em">🤝</div><b>${t('no_debts')}</b>${t('no_debts_s')}</div></div>` : ''}
  <button class="btn w" data-act="debtnew">${ic('plus')}${t('debt_new')}</button>
  ${closed.length ? `<div class="card"><div class="ch"><h2 class="muted">${t('closed_debts')}</h2></div>${closed.slice(-10).reverse().map(item).join('')}</div>` : ''}`;
}
function planRec() {
  const rs = live(DB.rec), d = today();
  const tot = rs.filter(r => r.faol !== false).reduce((s, r) => s + toUZS(r.s, (walById(r.w) || {}).cur), 0);
  return `<div class="tip"><span>🔁</span><div>${t('rec_tip')}</div></div>
  ${rs.length ? `<div class="card"><div class="ch"><div><h2>${t('rec_month')}</h2><p>${fmt(tot)} / ${t('per_month_s')}</p></div></div>
   ${rs.sort((a, b) => a.kun - b.kun).map(r => { const c = catById(r.c), paid = recPaid(r, d), due = recDue(r, d), n = Math.round((due - d) / 864e5);
     const st = r.faol === false ? `<span class="muted">${t('paused')}</span>` : paid ? `<span class="pos">✓ ${t('paid')}</span>` : n < 0 ? `<span class="neg">${t('overdue')}</span>` : n === 0 ? `<span style="color:var(--warn)">${t('today')}</span>` : t('in_days', { n });
     return `<div class="row"><div class="ico sm" style="--c:${catColor(c)}" data-recedit="${r.id}">${c ? c.e : '🔁'}</div><div class="tx" data-recedit="${r.id}" style="cursor:pointer"><b>${esc(r.nom)}</b><small>${t('every_month', { d: r.kun })} · ${fmt(r.s, (walById(r.w) || {}).cur)} · ${st}</small></div>${!paid && r.faol !== false ? `<button class="btn sm" data-recpay="${r.id}">${t('pay')}</button>` : ''}</div>`; }).join('')}</div>`
    : `<div class="card"><div class="empty"><div class="em">🔁</div><b>${t('no_rec')}</b>${t('no_rec_s')}</div></div>`}
  <button class="btn w" data-act="recnew">${ic('plus')}${t('rec_new')}</button>`;
}

/* ---------- Sozlamalar ---------- */
let TG = { phase: 'idle', code: '', bot: '', token: '', timer: null, until: 0 };
const SET_SECS = ['profile', 'wallets', 'cats', 'notif', 'tg', 'security', 'data', 'look'];
function setSecInfo(k) {
  const s = DB.settings;
  return {
    profile: ['👤', t('profile'), [s.ism, s.rol ? t('role_' + s.rol) : '', s.oila_soni ? t('fam_n', { n: s.oila_soni }) : ''].filter(Boolean).map(esc).join(' · ')],
    wallets: ['👛', t('wallets'), t('wal_n', { n: W().length })],
    cats: ['🏷️', t('categories'), t('cat_n', { a: live(DB.cats).filter(c => c.tur === 'x').length, b: live(DB.cats).filter(c => c.tur === 'd').length })],
    notif: ['🔔', t('notif'), s.eslat ? `${t('on')} · ${esc(s.eslat_vaqt || '')}` : t('off')],
    tg: ['✈️', t('tg_title'), s.tg_chat_id ? t('tg_linked') : t('tg_not')],
    security: ['🔒', t('security'), s.pin ? [t('pin'), s.bio ? t('bio_short') : '', s.sir_h ? t('sq_t') : ''].filter(Boolean).join(' · ') : t('pin_off')],
    data: ['🗄️', t('data'), t('data_sub')],
    look: ['🎨', t('look'), `${(LANGS.find(x => x[0] === L()) || [])[1]} · ${t({ light: 'th_l', dark: 'th_d', auto: 'th_a' }[s.mavzu] || 'th_a')}`],
  }[k];
}
function pageSettings() {
  const s = DB.settings, ws = W(), sec = UI.setSec;
  if (!sec) return `<div class="card" style="padding:6px 12px">${SET_SECS.filter(k => k !== 'notif' || Platform.notify.available).map(k => { const [e, ttl, sub] = setSecInfo(k);
      return `<button class="mi" data-setsec="${k}"><div class="ico">${e}</div><div class="tx"><b>${ttl}</b><small>${sub || '&nbsp;'}</small></div>${ic('right')}</button>`; }).join('')}</div>
   <div class="small muted" style="text-align:center;padding:4px 0 10px">🛡️ ${t('privacy')}<br>${t('app')} · v${APPV}</div>`;
  const body = {
  profile: () => `<div class="card">
   <div class="fld"><label>${t('ob_name')}</label><input id="setName" value="${esc(s.ism)}" maxlength="30"></div>
   <div class="small muted" style="margin-top:6px">${t('name_hint')}</div>
   <div class="g2" style="margin-top:12px"><div class="fld"><label>${t('ob_year')}</label><input id="setYear" inputmode="numeric" maxlength="4" value="${esc(s.yil || '')}"></div><div class="fld"><label>${t('ob_city')}</label><input id="setCity" value="${esc(s.shahar || '')}" maxlength="30"></div></div>
   <div class="small muted" style="margin:10px 0 6px">${t('ob_role')}</div><div class="chips" style="flex-wrap:wrap">${ROLES.map(r => `<button class="chip ${s.rol === r ? 'on' : ''}" data-setrol="${r}">${t('role_' + r)}</button>`).join('')}</div>
   <div class="small muted" style="margin:10px 0 6px">${t('ob_fam')}</div><div class="chips" style="flex-wrap:wrap">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button class="chip ${+s.oila_soni === n ? 'on' : ''}" data-setsoni="${n}">${n === 7 ? '7+' : n}</button>`).join('')}</div>
   <div class="small muted" style="margin-top:10px">🛡️ ${t('prof_local')}</div></div>
   <div class="card"><div class="ch"><div><h2>📅 ${t('sd_t')}</h2><p>${t('sd_s')}</p></div></div>
    <div class="row"><div class="tx"><b>${t('sd_day')}</b><small>${SD() > 1 ? t('sd_ex', { r: range('month', 0).span }) : t('sd_cal')}</small></div><div class="fld" style="width:96px"><select id="setSd">${Array.from({ length: 28 }, (_, i) => `<option value="${i + 1}" ${SD() === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></div></div>
    ${SD() > 1 && Platform.notify.available ? `<div class="row"><div class="tx"><b>🔔 ${t('sd_rem')}</b><small>${t('sd_rem_s', { d: SD() })}</small></div>${sw('maosh_eslat', s.maosh_eslat)}</div>` : ''}</div>
   <div class="card"><div class="row"><div class="tx"><b class="neg">🚪 ${t('logout')}</b><small>${t('logout_s')}</small></div><button class="btn sm dng" data-act="logout">${t('logout_btn')}</button></div></div>`,
  wallets: () => `<div class="card"><div class="ch"><h2>👛 ${t('wallets')}</h2><button class="lnk" data-act="walnew">+ ${t('add_s')}</button></div>
   ${ws.map((w, i) => `<div class="row"><div class="ico sm">${w.e}</div><div class="tx" data-wal="${w.id}" style="cursor:pointer"><b>${esc(walName(w))}</b><small>${w.cur} · ${fmt(balance(w), w.cur)}</small></div>
     <div class="ord"><button class="ib pl" data-wup="${w.id}" ${i === 0 ? 'disabled' : ''}>▲</button><button class="ib pl" data-wdn="${w.id}" ${i === ws.length - 1 ? 'disabled' : ''}>▼</button></div></div>`).join('')}
   <div class="small muted" style="margin-top:6px">${t('wal_order')}</div>
   ${ws.length > 1 ? `<button class="btn sm alt w" style="margin-top:8px" data-act="transfer">${ic('swap')}${t('transfer')}</button>` : ''}</div>`,
  cats: () => `<div class="card"><div class="ch"><h2>🏷️ ${t('categories')}</h2><button class="lnk" data-act="catnew">+ ${t('add_s')}</button></div>
   ${['x', 'd'].map(tp => `<div class="small muted" style="margin:6px 0">${t(tp === 'x' ? 'expenses' : 'incomes')}</div><div class="chips" style="flex-wrap:wrap">${live(DB.cats).filter(c => c.tur === tp).map(c => `<button class="chip" data-cat="${c.id}">${c.e} ${esc(catName(c))}</button>`).join('')}</div>`).join('')}</div>`,
  notif: () => `<div class="card"><div class="ch"><h2>🔔 ${t('notif')}</h2><button class="lnk" data-act="ntest">${t('test')}</button></div>
   <div class="row"><div class="tx"><b>${t('n_daily')}</b><small>${t('n_daily_s')}</small></div>${sw('eslat', s.eslat)}</div>
   <div class="row"><div class="tx"><b>${t('n_time')}</b></div><div class="fld" style="width:120px"><input type="time" id="ntime" value="${esc(s.eslat_vaqt)}"></div></div>
   <div class="small muted">${t('n_auto')}</div></div>`,
  tg: () => tgCard(),
  security: () => `<div class="card">
   <div class="row"><div class="tx"><b>${t('pin')}</b><small>${s.pin ? t('pin_on') : t('pin_off')}</small></div><button class="btn sm ${s.pin ? 'alt' : ''}" data-act="${s.pin ? 'pinoff' : 'pinset'}">${s.pin ? t('turn_off') : t('turn_on')}</button></div>
   ${s.pin ? `<div class="row"><div class="tx"><b>🔑 ${t('sq_t')}</b><small>${s.sir_h ? t('sq_on') : `<span class="neg">${t('sq_off')}</span>`}</small></div><button class="btn sm alt" data-act="secq">${s.sir_h ? t('change') : t('turn_on')}</button></div>` : ''}
   ${s.pin && BIO_OK ? `<div class="row"><div class="tx"><b>👆 ${t('bio_t')}</b><small>${t('bio_s')}</small></div>${sw('bio', s.bio)}</div>` : ''}
   <div class="row"><div class="tx"><b>✨ ${t('splash_t')}</b><small>${t('splash_s')}</small></div>${sw('splash', s.splash !== false)}</div>
   <div class="small muted" style="margin-top:6px">${t('pin_rules')}</div></div>`,
  data: () => `<div class="card">
   <div class="row"><div class="tx"><b>📊 ${t('xl_all')}</b><small>${t('xl_all_s')}</small></div><button class="btn sm alt" data-act="xlall">${ic('export')}</button></div>
   <div class="row"><div class="tx"><b>🗄️ ${t('backup')}</b><small>${t('backup_s')}</small></div><button class="btn sm alt" data-act="backupfull">${ic('export')}</button></div>
   <div class="row"><div class="tx"><b>♻️ ${t('restore')}</b><small>${t('restore_s')}</small></div><button class="btn sm alt" data-act="syncget">${ic('import')}</button></div>
   <div class="small muted" style="margin-top:8px">🛡️ ${t('privacy')}</div></div>`,
  look: () => `<div class="card" style="display:grid;gap:14px">
   <div><div class="small muted" style="margin-bottom:6px">${t('lang_t')}</div><div class="langlist">${LANGS.map(([k, n]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}"><b>${k.toUpperCase()}</b>${n}${L() === k ? `<i>${ic('check')}</i>` : ''}</button>`).join('')}</div></div>
   <div><div class="small muted" style="margin-bottom:6px">${t('theme_t')}</div><div class="seg full">${[['light', 'th_l'], ['dark', 'th_d'], ['auto', 'th_a']].map(([k, l]) => `<button class="${s.mavzu === k ? 'on' : ''}" data-thm="${k}">${t(l)}</button>`).join('')}</div></div>
   <div class="sws">${COLORS.map(([k, a, b]) => `<button class="swc ${s.rang === k ? 'on' : ''}" data-color="${k}" style="--x1:${a};--x2:${b}"></button>`).join('')}</div>
   <div class="row"><div class="tx"><b>🧺 ${t('bsk_t')}</b><small>${t('bsk_s')}</small></div>${sw('bsk_pulse', s.bsk_pulse)}</div></div>`,
  }[sec];
  return body ? body() : '';
}

/* ---------- Bilim ---------- */
function pageLearn() {
  const L_ = LESSONS[L()] || LESSONS.uz, prog = DB.settings.bilim || {}, done = L_.filter(x => prog[x.id]?.ok).length;
  return `<div class="card"><div class="ch"><div><h2>🎓 ${t('learn_prog', { a: done, b: L_.length })}</h2><p>${t('learn_sub')}</p></div></div><div class="bar" style="height:10px"><i style="width:${done / L_.length * 100}%"></i></div></div>
  ${L_.map((x, i) => { const p = prog[x.id]; return `<button class="lc" data-lesson="${x.id}" style="--i:${i}"><div class="ico">${x.e}</div><div class="tx"><b>${esc(x.t)}</b><small>⏱ ${x.min} ${t('min')} · ${x.q.length} ${t('questions')}</small></div>${p ? `<span class="pill" style="--c:${p.ok ? 'var(--good)' : 'var(--warn)'}">${p.ok ? '✓' : ''} ${p.s}/${p.n}</span>` : ic('right')}</button>`; }).join('')}
  <div class="card"><div class="ch"><div><h2>🏛️ ${t('official')}</h2><p>${t('official_s')}</p></div></div>
   ${[['finlit.uz', 'https://finlit.uz/oz/', 'link_finlit'], ['financeworld.uz', 'https://financeworld.uz/', 'link_fw'], ['cbu.uz', 'https://cbu.uz/uz/arkhiv-kursov-valyut/', 'link_cbu']].map(([n, u, k]) => `<a class="row" href="${u}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><div class="ico sm">🔗</div><div class="tx"><b>${n}</b><small>${t(k)}</small></div>${ic('right')}</a>`).join('')}
   <div class="tip wn" style="margin-top:10px"><span>⚠️</span><div>${t('fraud_note')}</div></div></div>`;
}
let QZ = null;
function openLesson(id) {
  const x = (LESSONS[L()] || LESSONS.uz).find(z => z.id === id); if (!x) return;
  modal(`${mhead(x.e + ' ' + esc(x.t))}<div class="mb"><div class="lesson">${x.body}</div></div><div class="mf"><button class="btn" data-act="quizstart" data-lid="${id}">📝 ${t('quiz_start')} (${x.q.length})</button></div>`);
}
function drawQuiz() {
  const x = (LESSONS[L()] || LESSONS.uz).find(z => z.id === QZ.id), n = x.q.length;
  if (QZ.i >= n) {
    const ok = QZ.score >= Math.ceil(n * 2 / 3); DB.settings.bilim = { ...(DB.settings.bilim || {}), [x.id]: { ok, s: QZ.score, n } }; Platform.save(DB);
    return modal(`${mhead(x.e + ' ' + esc(x.t))}<div class="mb" style="text-align:center"><div style="font-size:56px">${ok ? '🏆' : '📖'}</div><h3 style="margin:0;font-family:var(--fd)">${t('quiz_res', { a: QZ.score, b: n })}</h3><div class="muted">${ok ? t('quiz_ok') : t('quiz_fail')}</div></div>
     <div class="mf"><button class="btn alt" data-act="quizstart" data-lid="${x.id}">↻ ${t('again')}</button><button class="btn" data-close="1" data-act="quizclose">${t('done')}</button></div>`);
  }
  const q = x.q[QZ.i], picked = QZ.picked;
  modal(`${mhead(`${t('question')} ${QZ.i + 1}/${n}`)}<div class="mb"><b style="font-size:16px;line-height:1.4">${q.q}</b>
   <div class="qz">${q.a.map((a, j) => `<button class="${picked == null ? '' : j === q.c ? 'ok' : j === picked ? 'bad' : 'dim'}" data-qa="${j}" ${picked == null ? '' : 'disabled'}>${a}</button>`).join('')}</div>
   ${picked != null ? `<div class="tip ${picked === q.c ? '' : 'wn'}"><span>${picked === q.c ? '✅' : '💡'}</span><div>${q.x}</div></div>` : ''}</div>
   ${picked != null ? `<div class="mf"><button class="btn" data-act="quiznext">${QZ.i + 1 < n ? t('next') + ' →' : t('result')}</button></div>` : ''}`);
}

function tgCard() {
  const s = DB.settings; let body;
  if (s.tg_chat_id && TG.phase !== 'wait') body = `<div class="row"><div class="ico sm" style="--c:#229ED9">✈️</div><div class="tx"><b>${t('tg_linked')}: ${esc(s.tg_chat_nomi)}</b><small>@${esc(s.tg_bot)}</small></div><button class="btn sm dng" data-act="tgunlink">${t('turn_off')}</button></div>
    <div class="row"><div class="tx"><b>${t('tg_weekly')}</b><small>${t('tg_weekly_s')}</small></div>${sw('tg_haftalik', s.tg_haftalik)}</div>
    <button class="btn sm w" style="margin-top:8px" data-act="tgsend">${ic('send')}${t('tg_now')}</button>`;
  else if (TG.phase === 'wait') body = `<div style="display:grid;gap:10px"><b>${t('tg_wait')}</b><div class="code"><b id="tgcode">${esc(TG.code)}</b><button class="btn sm alt" data-act="tgcopy">${ic('copy')}</button></div>
    <div class="g2"><a class="btn sm" href="https://t.me/${esc(TG.bot)}" target="_blank" style="text-decoration:none">@${esc(TG.bot)}</a><button class="btn sm alt" data-act="tgcancel">${t('cancel')}</button></div>
    <div class="small muted" style="display:flex;gap:8px;align-items:center"><span class="spin"></span>${t('tg_waiting')}</div></div>`;
  else body = `<div class="small muted" style="margin-bottom:10px">${t('tg_how')}</div><div class="fld"><input id="tgtok" placeholder="123456789:AAH..." value="${esc(s.tg_token || '')}" spellcheck="false"></div><button class="btn sm w" style="margin-top:10px" data-act="tglink">${t('tg_link')}</button>`;
  return `<div class="card"><div class="ch"><div><h2>✈️ Telegram</h2><p>${t('tg_s')}</p></div></div>${body}</div>`;
}

/* =================== Amal qöşiş / tahrirlaş =================== */
let M = null;
function txSheet(id) {
  const x = DB.tx.find(z => z.id === id); if (!x) return;
  const w = walById(x.w), c = catById(x.c), cur = w && w.cur, g = x.g && DB.goals.find(q => q.id === x.g);
  const tl = x.tur === 'd' ? t('income') : x.tur === 'x' ? t('expense') : t('transfer');
  const big = x.tur === 'o' ? fmt(x.s, cur) : (x.tur === 'd' ? '+' : '−') + fmt(x.s, cur);
  const rowI = (k, v) => v ? `<div class="kv"><span>${k}</span><b>${v}</b></div>` : '';
  const d = pd(x.dt);
  modal(`${mhead(`${x.tur === 'o' ? '🔄' : c ? c.e : '❓'} ${esc(x.tur === 'o' ? t('transfer') : catName(c))}`)}<div class="mb">
   <div class="kp" style="text-align:center"><small>${tl}</small><b class="num ${x.tur === 'd' ? 'pos' : x.tur === 'x' ? 'neg' : ''}" style="font-size:26px">${big}</b>${cur && cur !== 'UZS' ? `<small>≈ ${fmt(txUZS(x))}</small>` : ''}</div>
   <div class="kvs">
    ${rowI(t('date'), `${fmtDay(d)} ${d.getFullYear()}, ${I18N[L()].wd[(d.getDay() + 6) % 7]}`)}
    ${rowI(x.tur === 'o' ? t('from') : t('wallet'), w ? `${w.e} ${esc(walName(w))}` : '')}
    ${x.tur === 'o' ? rowI(t('to'), (() => { const w2 = walById(x.w2); return w2 ? `${w2.e} ${esc(walName(w2))}${x.s2 != null ? ` · ${fmt(x.s2, w2.cur)}` : ''}` : ''; })()) : ''}
    ${x.tur !== 'o' ? rowI(t('category'), c ? `${c.e} ${esc(catName(c))}` : '') : ''}
    ${g ? rowI(t('goal'), `${g.e} ${esc(g.nom)}`) : ''}
    ${rowI(t('who'), x.kim ? '👤 ' + esc(x.kim) : '')}
    ${rowI(t('note'), x.n ? esc(x.n) : '')}
    ${rowI(t('added_at'), x.u ? new Date(x.u).toLocaleString(L() === 'en' ? 'en-GB' : 'ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '')}
   </div></div>
   <div class="mf"><button class="btn dng" data-del="tx:${x.id}" style="flex:0 0 auto" aria-label="del">${ic('trash')}</button><button class="btn alt" data-dup="${x.id}">🔁 ${t('dup')}</button><button class="btn" data-edit="${x.id}">${ic('edit')}${t('edit')}</button></div>`);
}
function openTx(id, preset) {
  const x = id ? DB.tx.find(z => z.id === id) : null;
  const mine = W().filter(w => !w.egasi || w.egasi === DB.settings.ism);
  const lastW = (live(DB.tx).filter(x => x.kim === me() && walById(x.w) && !walById(x.w).d).slice(-1)[0] || {}).w || (mine[0] || W()[0] || {}).id;
  M = x ? { ...x, amt: String(x.s), amt2: x.s2 != null ? String(x.s2) : '', kimga: (() => { const w2 = walById(x.w2); return w2 && w2.egasi && w2.egasi !== DB.settings.ism ? w2.egasi : ''; })() } : { id: null, tur: 'x', amt: '', c: '', w: lastW, w2: '', dt: ymd(today()), n: '', kim: me(), amt2: '', ...(preset || {}) };
  drawTx();
  setTimeout(() => { const a = $('#amt'); if (a && !x) a.focus(); }, 80);
}
function famMembers() { const me_ = DB.settings.ism; return [...new Set(W().map(w => w.egasi).filter(e => e && e !== me_))]; }
function readTx() { if (!$('#amt')) return; M.amt = $('#amt').value; M.dt = $('#txdt').value; M.n = $('#txn').value; if ($('#amt2')) M.amt2 = $('#amt2').value; }
function drawTx() {
  const m = M, w = walById(m.w), w2 = walById(m.w2), cats = live(DB.cats).filter(c => c.tur === m.tur);
  const recent = [...new Set(live(DB.tx).filter(x => x.tur === m.tur).slice(-40).reverse().map(x => x.c))];
  cats.sort((a, b) => { const ia = recent.indexOf(a.id), ib = recent.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  const cross = m.tur === 'o' && w && w2 && w.cur !== w2.cur;
  modal(`${mhead(m.id ? t('edit_tx') : t('new_tx'))}<div class="mb">
   <div class="seg full">${[['x', 'expense'], ['d', 'income'], ['o', 'transfer']].map(([k, l]) => `<button class="${m.tur === k ? 'on' : ''}" data-tur="${k}">${t(l)}</button>`).join('')}</div>
   <div class="amt ${m.tur}"><input id="amt" inputmode="decimal" placeholder="0" value="${esc(fmtInput(m.amt))}" autocomplete="off"><span>${unit(w && w.cur)}</span></div>
   ${m.tur !== 'o' ? `<div class="cg">${cats.map(c => `<button class="${m.c === c.id ? 'on' : ''}" data-pickc="${c.id}"><span>${c.e}</span>${esc(catName(c))}</button>`).join('')}<button data-act="catnew"><span>➕</span>${t('new_cat')}</button></div>` : ''}
   <div><div class="small muted" style="margin-bottom:6px">${m.tur === 'o' ? t('from') : t('wallet')}</div><div class="chips">${W().map(z => `<button class="chip ${m.w === z.id ? 'on' : ''}" data-pickw="${z.id}">${z.e} ${esc(walName(z))}</button>`).join('')}</div></div>
   ${m.tur === 'o' ? `<div><div class="small muted" style="margin-bottom:6px">${t('to_whom')}</div><div class="chips" style="flex-wrap:wrap"><button class="chip ${!m.kimga ? 'on' : ''}" data-kimga="">🙋 ${t('to_me')}</button>${famMembers().map(n => `<button class="chip ${m.kimga === n ? 'on' : ''}" data-kimga="${esc(n)}">👤 ${esc(n)}</button>`).join('')}${famMembers().length ? '' : `<button class="chip" data-kimga="?">👨‍👩‍👧 ${t('fam_member')}</button>`}</div></div>
     <div><div class="small muted" style="margin-bottom:6px">${m.kimga ? t('to_wallet_of', { n: esc(m.kimga) }) : t('to')}</div><div class="chips" style="flex-wrap:wrap">${W().filter(z => z.id !== m.w && (m.kimga ? z.egasi === m.kimga : (!z.egasi || z.egasi === DB.settings.ism))).map(z => `<button class="chip ${m.w2 === z.id ? 'on' : ''}" data-pickw2="${z.id}">${z.e} ${esc(m.kimga ? (z.nom || t('w_' + z.k)) : walName(z))}</button>`).join('')}</div></div>
     ${cross ? `<div class="fld"><label>${t('amt_received', { c: unit(w2.cur) })}</label><input id="amt2" inputmode="decimal" value="${esc(fmtInput(m.amt2))}" placeholder="${esc(fmtInput(String(autoConv(m))))}"></div>` : ''}` : ''}
   <div class="g2"><div class="fld"><label>${t('date')}</label><input type="date" id="txdt" value="${m.dt}"></div><div class="fld"><label>${t('note')}</label><input id="txn" value="${esc(m.n)}" placeholder="${t('note_ph')}" maxlength="80"></div></div>
   ${m.id && m.kim ? `<div class="small muted">👤 ${esc(m.kim)}</div>` : ''}
  </div><div class="mf">${m.id ? `<button class="btn dng" data-del="tx:${m.id}" style="flex:0 0 auto">${ic('trash')}</button>` : ''}<button class="btn" data-act="savetx">${ic('check')}${t('save')}</button></div>`);
}
const fmtInput = s => { s = String(s || '').replace(/\s/g, ''); const [i, f] = s.split(/[.,]/); return (i || '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f !== undefined ? '.' + f : ''); };
function autoConv(m) { const w = walById(m.w), w2 = walById(m.w2), a = parseAmt(m.amt); if (!w || !w2) return a; const r1 = rateOf(w.cur), r2 = rateOf(w2.cur); if (!r1 || !r2) return a; const v = a * r1 / r2; return w2.cur === 'UZS' ? Math.round(v) : Math.round(v * 100) / 100; }
async function saveTx() {
  readTx(); const m = M, s = parseAmt(m.amt);
  if (!(s > 0)) { $('#amt').classList.add('err'); toast(t('e_amt'), 'bd'); return; }
  if (m.tur !== 'o' && !m.c) { toast(t('e_cat'), 'bd'); return; }
  if (!m.w || (m.tur === 'o' && (!m.w2 || m.w2 === m.w))) { toast(t('e_wal'), 'bd'); return; }
  const rec = { id: m.id || uid(), tur: m.tur, s, w: m.w, dt: m.dt || ymd(today()), n: (m.n || '').trim(), kim: m.kim || me() };
  if (m.tur !== 'o') rec.c = m.c; else { rec.w2 = m.w2; const w = walById(m.w), w2 = walById(m.w2); if (w.cur !== w2.cur) rec.s2 = parseAmt(m.amt2) || autoConv(m); }
  if (m.g) rec.g = m.g; if (m.r) rec.r = m.r;
  upsert('tx', rec); await persist(); closeModal(); render();
  if (rec.tur === 'x') { const c = catById(rec.c); if (c && c.limit > 0) { const p = catSpentMonth(c.id) / c.limit * 100; if (p >= 100) return toast(t('al_over', { c: catName(c), p: Math.round(p) }), 'bd'); if (p >= NEAR()) return toast(t('al_near', { c: catName(c), p: Math.round(p) }), 'wn'); } }
  toast(t('saved'));
}

/* ---------- kiçik formalar ---------- */
function formModal(title, fields, onSave, delKey) {
  modal(`${mhead(title)}<div class="mb">${fields}</div><div class="mf">${delKey ? `<button class="btn dng" data-del="${delKey}" style="flex:0 0 auto">${ic('trash')}</button>` : ''}<button class="btn" data-act="formsave">${ic('check')}${t('save')}</button></div>`);
  FORM = onSave;
}
let FORM = null;
const val = id => ($('#' + id) || {}).value || '';
const emojiPicker = (cur, key = 'fe') => `<input type="hidden" id="${key}" value="${esc(cur)}"><div class="emg">${EMOJIS.map(e => `<button class="${e === cur ? 'on' : ''}" data-emoji="${e}" data-for="${key}">${e}</button>`).join('')}</div>`;
const curOpts = sel => CURS().map(c => `<option value="${c}" ${sel === c ? 'selected' : ''}>${c} — ${esc(curName(c))}</option>`).join('');
const walOpts = sel => W().map(w => `<option value="${w.id}" ${sel === w.id ? 'selected' : ''}>${w.e} ${esc(walName(w))}</option>`).join('');
const catOpts = (sel, tur = 'x') => live(DB.cats).filter(c => c.tur === tur).map(c => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${c.e} ${esc(catName(c))}</option>`).join('');

function openLimit(cid) {
  const c = catById(cid);
  formModal(`${c.e} ${esc(catName(c))}`, `<div class="small muted">${t('this_month')}: ${fmt(catSpentMonth(c.id))} · ${t('last_month')}: ${fmt(live(DB.tx).filter(x => x.tur === 'x' && x.c === cid && inR(x, monthRange(-1))).reduce((s, x) => s + txUZS(x), 0))}</div>
   <div class="fld"><label>${t('limit_month')}</label><input id="flim" inputmode="decimal" value="${c.limit ? esc(fmtInput(String(c.limit))) : ''}" placeholder="0"></div><div class="small muted">${t('limit_hint')}</div>`,
    async () => { c.limit = parseAmt(val('flim')); upsert('cats', c); await persist(); closeModal(); render(); toast(t('saved')); });
}
function openNear() {
  const cur = NEAR();
  formModal('🔔 ' + t('near_t'), `<div class="small muted">${t('near_q')}</div><div class="chips" style="flex-wrap:wrap">${[50, 60, 70, 80, 90].map(v => `<button class="chip ${cur === v ? 'on' : ''}" data-pct="${v}">${v}%</button>`).join('')}</div>
   <div class="fld"><label>${t('own_val')} (%)</label><input id="fp" inputmode="numeric" value="${cur}" maxlength="2"></div>`,
    async () => { const v = Math.round(+val('fp')); if (!(v >= 10 && v <= 99)) return toast(t('near_bad'), 'bd'); DB.settings.ogoh = v; await persist(); closeModal(); render(); toast(t('saved')); });
}
function openGoal(id) {
  const g = id ? DB.goals.find(x => x.id === id) : { id: null, nom: '', e: '🎯', maqsad: 0, muddat: '', boshi: 0 };
  formModal(id ? t('goal_edit') : t('goal_new'), `<div class="fld"><label>${t('goal_name')}</label><input id="fn" value="${esc(g.nom)}" placeholder="${t('goal_ph')}"></div>
   <div class="g2"><div class="fld"><label>${t('goal_target')}</label><input id="fs" inputmode="decimal" value="${g.maqsad ? esc(fmtInput(String(g.maqsad))) : ''}"></div><div class="fld"><label>${t('deadline')}</label><input type="date" id="fd" value="${esc(g.muddat || '')}"></div></div>
   ${!id ? `<div class="fld"><label>${t('goal_have')}</label><input id="fb" inputmode="decimal" placeholder="0"></div>` : ''}${emojiPicker(g.e)}`,
    async () => { const nom = val('fn').trim(), s = parseAmt(val('fs')); if (!nom || !(s > 0)) return toast(t('e_fill'), 'bd');
      upsert('goals', { ...g, id: g.id || uid(), nom, maqsad: s, muddat: val('fd'), e: val('fe') || '🎯', boshi: id ? g.boshi : parseAmt(val('fb')) }); await persist(); closeModal(); render(); toast(t('saved')); },
    id ? 'goals:' + id : null);
}
function goalForecast(g) {
  const xs = live(DB.tx).filter(x => x.g === g.id); if (!xs.length) return null;
  const first = xs.map(x => pd(x.dt)).sort((a, b) => a - b)[0], months = Math.max(1, (today() - first) / (864e5 * 30.4));
  const net = xs.reduce((s, x) => s + (x.tur === 'd' ? -1 : 1) * txUZS(x), 0), per = net / months, left = g.maqsad - goalSaved(g);
  if (left <= 0 || per <= 0) return null;
  const m = Math.ceil(left / per), d = new Date(today().getFullYear(), today().getMonth() + m, 1);
  return { per, m, d };
}
function goalSheet(id) {
  const g = DB.goals.find(x => x.id === id); if (!g) return;
  const s = goalSaved(g), p = Math.min(100, s / g.maqsad * 100), F = goalForecast(g);
  const xs = live(DB.tx).filter(x => x.g === id).sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u);
  modal(`${mhead(`${g.e} ${esc(g.nom)}`)}<div class="mb">
   <div class="kp"><div style="display:flex;justify-content:space-between;align-items:baseline"><b class="num" style="font-size:22px">${money(s)}</b><span class="muted small">/ ${money(g.maqsad)}</span></div>
    <div class="bar" style="height:12px;margin:8px 0"><i style="width:${p}%;--c:${p >= 100 ? 'var(--good)' : 'var(--acc)'}"></i></div>
    <small>${p >= 100 ? '🎉 ' + t('goal_done') : `${Math.round(p)}% · ${t('left_s', { s: money(g.maqsad - s) })}`}</small></div>
   ${F && p < 100 ? `<div class="tip"><span>🔮</span><div>${t('goal_fc', { s: money(F.per), m: F.m, d: monName(F.d.getMonth()) + ' ' + F.d.getFullYear() })}</div></div>` : ''}
   ${g.muddat && p < 100 ? `<div class="small muted">📅 ${t('until', { d: fmtDay(pd(g.muddat)) + ' ' + pd(g.muddat).getFullYear() })}</div>` : ''}
   <div class="g2"><button class="btn sm" data-goalmoney="${id}" data-dir="in">${ic('plus')}${t('goal_add')}</button><button class="btn sm alt" data-goalmoney="${id}" data-dir="out">➖ ${t('goal_take')}</button></div>
   <div><div class="small muted" style="margin:4px 0 8px">${t('goal_hist')}${+g.boshi ? ` · ${t('goal_have')}: ${money(+g.boshi)}` : ''}</div>
    ${xs.length ? xs.map((x, i) => txRow(x, i, DB.settings.yashir)).join('') : `<div class="empty" style="padding:14px"><b>${t('goal_nohist')}</b></div>`}</div></div>
   <div class="mf"><button class="btn dng" data-del="goals:${id}" style="flex:0 0 auto">${ic('trash')}${t('delete')}</button><button class="btn alt" data-goaledit="${id}">${ic('edit')}${t('edit')}</button></div>`);
}
function goalSavCat(dir) {
  if (dir === 'in') return (live(DB.cats).find(c => c.k === 'savings' && c.tur === 'x') || live(DB.cats).find(c => c.g === 'j' && c.tur === 'x') || {}).id;
  let c = live(DB.cats).find(c => c.k === 'from_goal');
  if (!c) { c = { id: 'c_from_goal', k: 'from_goal', e: '🏦', tur: 'd', g: 'j', limit: 0 }; upsert('cats', c); }
  return c.id;
}
function openGoalMoney(id, dir, txId) {
  const g = DB.goals.find(x => x.id === id), x = txId ? DB.tx.find(z => z.id === txId) : null;
  const mine = W().filter(w => !w.egasi || w.egasi === DB.settings.ism), wsel = x ? x.w : (mine[0] || W()[0] || {}).id;
  formModal(`${g.e} ${esc(g.nom)} · ${t(dir === 'in' ? 'goal_add' : 'goal_take')}`, `
   <div class="amt ${dir === 'in' ? 'x' : 'd'}"><input id="gma" inputmode="decimal" placeholder="0" value="${x ? esc(fmtInput(String(x.s))) : ''}" autocomplete="off"><span id="gmu">${unit((walById(wsel) || {}).cur)}</span></div>
   ${dir === 'out' ? `<div class="small muted">${t('goal_have_now', { s: money(goalSaved(g)) })}</div>` : ''}
   <div><div class="small muted" style="margin-bottom:6px">${dir === 'in' ? t('from') : t('to')}</div><input type="hidden" id="gmw" value="${wsel}"><div class="chips" style="flex-wrap:wrap">${W().map(z => `<button class="chip ${wsel === z.id ? 'on' : ''}" data-gmw="${z.id}">${z.e} ${esc(walName(z))}</button>`).join('')}</div></div>
   <div class="g2"><div class="fld"><label>${t('date')}</label><input type="date" id="gmd" value="${x ? x.dt : ymd(today())}"></div><div class="fld"><label>${t('note')}</label><input id="gmn" value="${x ? esc(x.n) : ''}" placeholder="${t('note_ph')}" maxlength="80"></div></div>`,
    async () => { const a = parseAmt(val('gma')); if (!(a > 0)) { $('#gma').classList.add('err'); return toast(t('e_amt'), 'bd'); }
      const w = val('gmw'); if (!walById(w)) return toast(t('e_wal'), 'bd');
      upsert('tx', { ...(x || {}), id: x ? x.id : uid(), tur: dir === 'in' ? 'x' : 'd', c: x ? x.c : goalSavCat(dir), g: id, s: a, w, dt: val('gmd') || ymd(today()), n: val('gmn').trim(), kim: x ? x.kim : me() });
      await persist(); render(); goalSheet(id); toast(t('saved')); });
  setTimeout(() => { const e = $('#gma'); if (e && !x) e.focus(); }, 80);
}
function openDebt(id) {
  const x = id ? DB.debts.find(z => z.id === id) : { id: null, tur: 'berdim', kim: '', s: 0, cur: 'UZS', dt: ymd(today()), muddat: '', n: '', qaytdi: [] };
  const left = id ? debtLeft(x) : 0;
  formModal(id ? esc(x.kim) : t('debt_new'), `
   <div class="seg full">${['berdim', 'oldim'].map(k => `<button class="${x.tur === k ? 'on' : ''}" data-dtur="${k}">${t('d_' + k)}</button>`).join('')}</div><input type="hidden" id="ft" value="${x.tur}">
   <div class="fld"><label>${t('debt_who')}</label><input id="fk" value="${esc(x.kim)}" placeholder="${t('debt_who_ph')}"></div>
   <div class="g2"><div class="fld"><label>${t('amount')}</label><input id="fs" inputmode="decimal" value="${x.s ? esc(fmtInput(String(x.s))) : ''}"></div><div class="fld"><label>${t('currency')}</label><select id="fc">${curOpts(x.cur)}</select></div></div>
   <div class="g2"><div class="fld"><label>${t('date')}</label><input type="date" id="fd" value="${esc(x.dt)}"></div><div class="fld"><label>${t('deadline')}</label><input type="date" id="fm" value="${esc(x.muddat || '')}"></div></div>
   <div class="fld"><label>${t('note')}</label><input id="fn" value="${esc(x.n || '')}"></div>
   ${id && !x.yopiq ? `<div class="card" style="box-shadow:none;background:var(--s2)"><b>${t('returned')}</b><div class="small muted">${t('left_s', { s: fmt(left, x.cur) })}</div><div class="g2" style="margin-top:8px"><div class="fld"><input id="fr" inputmode="decimal" placeholder="${esc(fmtInput(String(left)))}"></div><button class="btn sm" data-act="debtret">${t('mark_ret')}</button></div></div>` : ''}
   ${id && (x.qaytdi || []).length ? `<div class="small muted">${x.qaytdi.map(r => `✓ ${fmtDay(pd(r.dt))}: ${fmt(r.s, x.cur)}`).join('<br>')}</div>` : ''}`,
    async () => { const kim = val('fk').trim(), s = parseAmt(val('fs')); if (!kim || !(s > 0)) return toast(t('e_fill'), 'bd');
      const rec = { ...x, id: x.id || uid(), tur: val('ft'), kim, s, cur: val('fc'), dt: val('fd') || ymd(today()), muddat: val('fm'), n: val('fn').trim() };
      rec.yopiq = debtLeft(rec) <= 0; upsert('debts', rec); await persist(); closeModal(); render(); toast(t('saved')); },
    id ? 'debts:' + id : null);
  M = { debt: x };
}
function openRec(id, preset) {
  const r = id ? DB.rec.find(z => z.id === id) : { id: null, nom: '', s: 0, c: (live(DB.cats).find(c => c.k === 'utility') || {}).id, w: (W()[0] || {}).id, kun: today().getDate(), faol: true, paid: [], ...(preset || {}) };
  formModal(id ? esc(r.nom) : t('rec_new'), `<div class="fld"><label>${t('rec_name')}</label><input id="fn" value="${esc(r.nom)}" placeholder="${t('rec_ph')}"></div>
   <div class="g2"><div class="fld"><label>${t('amount')}</label><input id="fs" inputmode="decimal" value="${r.s ? esc(fmtInput(String(r.s))) : ''}"></div><div class="fld"><label>${t('pay_day')}</label><input id="fk" type="number" min="1" max="31" value="${r.kun}"></div></div>
   <div class="fld"><label>${t('category')}</label><select id="fc">${catOpts(r.c)}</select></div>
   <div class="fld"><label>${t('wallet')}</label><select id="fw">${walOpts(r.w)}</select></div>
   ${id ? `<div class="row"><div class="tx"><b>${t('active')}</b></div>${sw('recfaol', r.faol !== false, 'data-fsw')}</div><input type="hidden" id="ff" value="${r.faol !== false ? 1 : 0}">` : ''}`,
    async () => { const nom = val('fn').trim(), s = parseAmt(val('fs')), kun = Math.max(1, Math.min(31, +val('fk') || 1)); if (!nom || !(s > 0)) return toast(t('e_fill'), 'bd');
      upsert('rec', { ...r, id: r.id || uid(), nom, s, kun, c: val('fc'), w: val('fw'), faol: id ? val('ff') === '1' : true }); await persist(); closeModal(); render(); toast(t('saved')); },
    id ? 'rec:' + id : null);
}
async function payRec(id) {
  const r = DB.rec.find(z => z.id === id), d = today();
  upsert('tx', { id: uid(), tur: 'x', s: r.s, c: r.c, w: r.w, dt: ymd(d), n: r.nom, kim: me(), r: r.id });
  r.paid = [...new Set([...(r.paid || []), recKey(d)])]; upsert('rec', r);
  await persist(); render(); toast(t('paid_ok', { n: r.nom }));
}
function openWallet(id) {
  const w = id ? DB.wallets.find(z => z.id === id) : { id: null, nom: '', e: '👛', cur: 'UZS', start: 0 };
  formModal(id ? esc(walName(w)) : t('wal_new'), `<div class="fld"><label>${t('name')}</label><input id="fn" value="${esc(w.nom || (w.k ? t('w_' + w.k) : ''))}" placeholder="${t('wal_ph')}"></div>
   <div class="g2"><div class="fld"><label>${t('currency')}</label><select id="fc" ${id ? 'disabled' : ''}>${curOpts(w.cur)}</select></div>
   <div class="fld"><label>${t('start_bal')}</label><input id="fs" inputmode="decimal" value="${esc(fmtInput(String(w.start || '')))}" placeholder="0"></div></div>${emojiPicker(w.e)}`,
    async () => { const nom = val('fn').trim(); if (!nom) return toast(t('e_fill'), 'bd'); const rec = { ...w, id: w.id || uid(), e: val('fe') || '👛', cur: id ? w.cur : val('fc'), start: parseAmt(val('fs')), egasi: w.egasi || me() };
      if (!w.k || nom !== t('w_' + w.k)) rec.nom = nom; upsert('wallets', rec); await persist(); closeModal(); render(); toast(t('saved')); },
    id && W().length > 1 ? 'wallets:' + id : null);
}
function openCat(id, tur) {
  const c = id ? DB.cats.find(z => z.id === id) : { id: null, nom: '', e: '📦', tur: tur || 'x', g: 'h', limit: 0 };
  formModal(id ? esc(catName(c)) : t('new_cat'), `${!id ? `<div class="seg full">${['x', 'd'].map(k => `<button class="${c.tur === k ? 'on' : ''}" data-ctur="${k}">${t(k === 'x' ? 'expense' : 'income')}</button>`).join('')}</div>` : ''}<input type="hidden" id="ft" value="${c.tur}">
   <div class="fld"><label>${t('name')}</label><input id="fn" value="${esc(c.nom || (c.k ? catName(c) : ''))}"></div>
   <div class="fld" id="fgw" ${c.tur === 'd' ? 'hidden' : ''}><label>${t('cat_group')}</label><select id="fg">${[['z', 'needs'], ['h', 'wants'], ['j', 'savings_g']].map(([k, l]) => `<option value="${k}" ${c.g === k ? 'selected' : ''}>${t(l)}</option>`).join('')}</select></div>${emojiPicker(c.e)}`,
    async () => { const nom = val('fn').trim(); if (!nom) return toast(t('e_fill'), 'bd'); const rec = { ...c, id: c.id || uid(), e: val('fe') || '📦', tur: val('ft'), g: val('ft') === 'd' ? '' : val('fg') };
      if (!c.k || nom !== catName(c)) rec.nom = nom; upsert('cats', rec); await persist();
      if (M && M.tur && !M.debt && M.amt !== undefined) { const keep = M; keep.c = rec.tur === keep.tur ? rec.id : keep.c; M = keep; drawTx(); } else { closeModal(); render(); } toast(t('saved')); },
    id && !live(DB.tx).some(x => x.c === id) ? 'cats:' + id : null);
}

/* =================== Oila sinxronizatsiyasi =================== */
const COLS = ['wallets', 'cats', 'tx', 'rec', 'debts', 'goals', 'lists'];
function merge(other) {
  let n = 0;
  for (const col of COLS) {
    const map = new Map(DB[col].map(x => [x.id, x]));
    for (const r of other[col] || []) { const cur = map.get(r.id); if (!cur || (r.u || 0) > (cur.u || 0)) { map.set(r.id, r); n++; } }
    DB[col] = [...map.values()];
  }
  return n;
}
async function syncSend(full) {
  const data = { format: 'oila-byudjeti', v: 1, kim: me(), at: new Date().toISOString() };
  COLS.forEach(c => data[c] = DB[c]);
  if (full === true) { const { pin, sir_h, sir_q, bio, tg_token, tg_chat_id, pin_err, pin_until, ...rest } = DB.settings; data.settings = rest; }
  const ok = await Platform.saveFile(`oila_byudjeti_${me().replace(/[^\p{L}\p{N}]+/gu, '_')}_${ymd(today())}.json`, 'application/json', JSON.stringify(data), t('app'));
  if (ok) { DB.settings.sync_oxirgi = `${fmtDay(today())}`; DB.settings.sync_ts = Date.now(); await persist(); render(); }
  return ok;
}
async function syncGet() {
  const f = await Platform.pickFile('.json,application/json'); if (!f) return;
  try { const d = JSON.parse(await f.text()); if (d.format !== 'oila-byudjeti') throw 0;
    const n = merge(d); DB.settings.sync_oxirgi = fmtDay(today()); DB.settings.sync_ts = Date.now(); await persist(); render(); toast(t('sync_ok', { n, k: d.kim || '?' }));
  } catch (_) { toast(t('bad_file'), 'bd'); }
}

/* Telegramdan kelgan faylni bosganda ilova oçiladi va maʼlumot qöşiladi (Android) */
async function importFromText(txt) {
  try { const d = JSON.parse(txt); if (d.format !== 'oila-byudjeti') throw 0;
    if (!confirm(t('sync_open_q', { k: d.kim || '?' }))) return;
    const n = merge(d); DB.settings.sync_oxirgi = fmtDay(today()); DB.settings.sync_ts = Date.now(); await persist(); render(); toast(t('sync_ok', { n, k: d.kim || '?' }));
  } catch (_) { toast(t('bad_file'), 'bd'); }
}
let pendingOpen = null;
function handleOpenUrl(url) { if (!url || !/^(content|file):/.test(url)) return; pendingOpen = url; if (DB && DB.settings.ism && !$('#lock').innerHTML) runPendingOpen(); }
async function runPendingOpen() { const u = pendingOpen; pendingOpen = null; if (!u) return; const txt = await Platform.readUrl(u); if (txt) importFromText(txt); else toast(t('bad_file'), 'bd'); }
function syncDue() { const s = DB.settings; if (!(+s.oila_soni > 1 || members().length > 1)) return false;
  const first = live(DB.tx).map(x => x.u || 0).filter(Boolean).sort((a, b) => a - b)[0]; const base = s.sync_ts || first; return !!base && Date.now() - base > 7 * 864e5; }

/* =================== Excel =================== */
async function excelExport(r) {
  const xs = live(DB.tx).filter(x => !r || inR(x, r)).sort((a, b) => a.dt.localeCompare(b.dt));
  if (!xs.length) return toast(t('no_tx'), 'wn');
  const H = I18N[L()].xl_head;
  const rows = xs.map(x => { const w = walById(x.w), c = catById(x.c);
    return [pd(x.dt), t(x.tur === 'x' ? 'expense' : x.tur === 'd' ? 'income' : 'transfer'), x.tur === 'o' ? `${walName(w)} → ${walName(walById(x.w2))}` : catName(c), x.tur === 'x' ? -x.s : x.s, w ? w.cur : '', x.tur === 'o' ? null : Math.round(x.tur === 'x' ? -txUZS(x) : txUZS(x)), walName(w), x.kim || '', x.n || '']; });
  const file = XLSX.writeXlsx(t('app'), H, rows, [12, 12, 22, 14, 8, 15, 16, 14, 30]);
  await Platform.saveFile(`byudjet_${r ? ymd(r.a) : 'hammasi'}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', file, t('app'));
}

/* =================== Telegram =================== */
function weekReport(off) {
  const r = range('week', off), S = stats(r), P = stats(range('week', off - 1));
  const h = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const top = Object.entries(S.byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const ch = P.exp > 0 ? Math.round((S.exp - P.exp) / P.exp * 100) : null;
  const lines = [`💰 <b>${h(t('app'))}</b> — ${h(t('tg_week'))}`, `📅 ${r.label}`, '',
    `↓ ${h(t('income'))}: <b>${fmt(S.inc)}</b>`, `↑ ${h(t('expense'))}: <b>${fmt(S.exp)}</b>${ch === null ? '' : ` (${ch > 0 ? '▲' : '▼'}${Math.abs(ch)}%)`}`, `= ${h(t('left'))}: <b>${fmt(S.inc - S.exp, 'UZS', true)}</b>`];
  if (top.length) { lines.push('', `🍩 <b>${h(t('top_cats'))}</b>:`); top.forEach(([id, v]) => { const c = catById(id); lines.push(`${c ? c.e : ''} ${h(catName(c))} — ${fmt(v)} (${Math.round(v / S.exp * 100)}%)`); }); }
  const SP = savePlan(); if (SP.inc > 0) lines.push('', `🐷 ${h(t('plan_t'))}: <b>${SP.remaining < 0 ? h(t('plan_over', { s: fmt(-SP.remaining) })) : h(t('plan_day', { s: fmt(SP.perDay) }))}</b>`);
  const over = live(DB.cats).filter(c => c.tur === 'x' && c.limit > 0 && catSpentMonth(c.id) > c.limit);
  if (over.length) lines.push('', '⚠️ ' + over.map(c => `${c.e} ${h(catName(c))}`).join(', ') + ' — ' + h(t('tg_over')));
  return lines.join('\n');
}
async function tgWeekly() {
  const s = DB.settings; if (!(s.tg_chat_id && s.tg_token && s.tg_haftalik)) return;
  const key = ymd(weekStart(today())); if (s.tg_oxirgi === key) return;
  try { await Platform.tg(s.tg_token, 'sendMessage', { chat_id: s.tg_chat_id, text: weekReport(-1), parse_mode: 'HTML' }); s.tg_oxirgi = key; await Platform.save(DB); } catch (_) {}
}
const tgErr = e => { e = String(e || ''); return e.startsWith('NET') ? t('tg_e_net') : /unauthorized|not found/i.test(e) ? t('tg_e_token') : t('error') + ': ' + e; };
async function tgLink() {
  const tok = ($('#tgtok') || {}).value?.trim(); if (!tok) return;
  try { const me_ = await Platform.tg(tok, 'getMe'); TG = { phase: 'wait', code: '/ob' + (1000 + Math.floor(Math.random() * 9000)), bot: me_.username, token: tok, until: Date.now() + 300000 }; render(); tgPoll(); }
  catch (e) { toast(tgErr(e.message), 'bd'); }
}
async function tgPoll() {
  clearTimeout(TG.timer); if (TG.phase !== 'wait') return;
  if (Date.now() > TG.until) { TG.phase = 'idle'; render(); return toast(t('tg_timeout'), 'wn'); }
  try { const ups = await Platform.tg(TG.token, 'getUpdates', { timeout: 0, limit: 100 });
    for (const u of ups.reverse()) { const m = u.message || u.channel_post || {}; if (!(m.text || '').toLowerCase().includes(TG.code)) continue;
      const c = m.chat; Object.assign(DB.settings, { tg_token: TG.token, tg_bot: TG.bot, tg_chat_id: c.id, tg_chat_nomi: c.title || [c.first_name, c.last_name].filter(Boolean).join(' ') || String(c.id), tg_oxirgi: '' });
      await persist(); TG.phase = 'idle'; render(); toast(t('tg_ok'));
      Platform.tg(TG.token, 'sendMessage', { chat_id: c.id, text: '✅ ' + t('tg_ok') }).catch(() => {}); return; }
  } catch (_) {}
  TG.timer = setTimeout(tgPoll, 3000);
}

/* =================== Valyuta kurslari =================== */
const CFG = window.APP_CONFIG || {};
const PAGES = CFG.pages || (location.hostname.endsWith('github.io') ? location.origin + location.pathname.replace(/[^/]*$/, '') : '');
function normRates(j) {
  const arr = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : null);
  if (!arr || !arr.length) return null;
  const list = arr.filter(x => x.Ccy && +x.Rate > 0).map(x => { const nom = +x.Nominal || 1;
    return { c: x.Ccy, r: +x.Rate / nom, d: (+x.Diff || 0) / nom, n: { uz: x.CcyNm_UZ, ru: x.CcyNm_RU, en: x.CcyNm_EN } }; });
  return list.length ? { list, date: arr[0].Date || '', fetched: Date.now() } : null;
}
let ratesBusy = false;
async function fetchRates(force) {
  if (ratesBusy) return; const R = DB.rates;
  if (!force && R && Date.now() - R.fetched < 4 * 3600e3) return;
  ratesBusy = true;
  const urls = [PAGES && PAGES + 'rates.json?t=' + Date.now(), 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/', 'rates.json?t=' + Date.now()].filter(Boolean);
  for (const u of urls) {
    try { const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(u, { cache: 'no-store', signal: ctl.signal }); clearTimeout(tm);
      const n = normRates(await r.json());
      if (n) { DB.rates = n; await Platform.save(DB); ratesBusy = false; if (!$('#modal').innerHTML && DB.settings.ism && !$('#lock').innerHTML) render(); return true; }
    } catch (_) {}
  }
  ratesBusy = false; return false;
}

/* =================== Tijorat banklari kurslari =================== */
let banksBusy = false;
async function fetchBanks(force) {
  if (banksBusy) return; const B = DB.banks;
  if (!force && B && Date.now() - B.at < 2 * 3600e3) return;
  banksBusy = true;
  for (const u of [PAGES && PAGES + 'banks.json?t=' + Date.now(), 'banks.json?t=' + Date.now()].filter(Boolean)) {
    try { const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(u, { cache: 'no-store', signal: ctl.signal }); clearTimeout(tm); const j = await r.json();
      if (j && j.cur && Object.keys(j.cur).length) { DB.banks = { at: Date.now(), fetched: j.fetched, src: j.src, cur: j.cur }; await Platform.save(DB); banksBusy = false;
        if (UI.page === 'rates' && !$('#modal').innerHTML && !$('#lock').innerHTML) render(); return true; }
    } catch (_) {}
  }
  banksBusy = false; return false;
}
const CYR_UZ = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 's', ч: 'ç', ш: 'ş', щ: 'ş', ъ: 'ʼ', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'ö', қ: 'q', ғ: 'ğ', ҳ: 'h' };
const bankName = n => L() === 'uz' && /[а-яёўғқҳ]/i.test(n) ? n.replace(/[а-яёўғқҳ]/gi, ch => { const l = CYR_UZ[ch.toLowerCase()] ?? ch; return ch === ch.toLowerCase() ? l : l.charAt(0).toUpperCase() + l.slice(1); }) : n;
const bankList = c => ((DB.banks && DB.banks.cur && DB.banks.cur[c]) || []);
function bankBest(c, side) { const L_ = bankList(c).filter(x => side === 's' ? x.s : x.b); if (!L_.length) return null;
  return L_.reduce((a, x) => side === 's' ? (x.s < a.s ? x : a) : (x.b > a.b ? x : a)); }
function bankTime() { const B = DB.banks; if (!B || !B.fetched) return ''; const d = new Date(B.fetched), td = today();
  const hm = d.toTimeString().slice(0, 5); return (ymd(d) === ymd(td) ? t('today') : fmtDay(d)) + ' ' + hm; }
function banksCard() {
  const B = DB.banks, cs = B && B.cur ? Object.keys(B.cur) : [];
  if (!cs.length) return `<div class="card"><div class="ch"><h2>🏦 ${t('bk_title')}</h2></div><div class="small muted">${t('bk_none')}</div></div>`;
  if (!cs.includes(UI.bkc)) UI.bkc = cs[0];
  const c = UI.bkc, list = bankList(c), sym = SYM[c] || c;
  const buy = list.filter(x => x.s).sort((a, b) => a.s - b.s).slice(0, 3), sell = list.filter(x => x.b).sort((a, b) => b.b - a.b).slice(0, 3);
  const row = (x, v, i) => `<div class="bkr"><span class="bkn">${i + 1}</span><b>${esc(bankName(x.n))}</b><em class="num">${sp(Math.round(v))}</em></div>`;
  return `<div class="card"><div class="ch"><div><h2>🏦 ${t('bk_title')}</h2><p>${t('bk_upd', { d: bankTime() })}</p></div></div>
   <div class="chips" style="margin-bottom:12px">${cs.map(k => `<button class="chip ${k === c ? 'on' : ''}" data-bkc="${k}">${FLAG(k)} ${k}</button>`).join('')}</div>
   <div class="bkg"><div class="bkbox"><small>🛒 ${t('bk_buy', { c: sym })}</small>${buy.map((x, i) => row(x, x.s, i)).join('')}<div class="small muted">${t('bk_buy_s')}</div></div>
    <div class="bkbox"><small>💵 ${t('bk_sell', { c: sym })}</small>${sell.map((x, i) => row(x, x.b, i)).join('')}<div class="small muted">${t('bk_sell_s')}</div></div></div>
   <details style="margin-top:12px"><summary class="lnk" style="cursor:pointer;padding:0">${t('bk_all', { n: list.length })}</summary>
    <div class="bkt"><div class="bkh"><span>${t('bank_col')}</span><span>${t('bk_s')}</span><span>${t('bk_b')}</span></div>${list.slice().sort((a, b) => (a.s || 1e12) - (b.s || 1e12)).map(x => `<div><span>${esc(bankName(x.n))}</span><span class="num">${x.s ? sp(Math.round(x.s)) : '—'}</span><span class="num">${x.b ? sp(Math.round(x.b)) : '—'}</span></div>`).join('')}</div></details>
   <div class="small muted" style="margin-top:10px">${t('bk_note', { s: esc(B.src || 'OnMap.uz') })}</div></div>`;
}

/* =================== Anonim foydalanuvçilar soni =================== */
/* Faqat son: ism, telefon yoki moliyaviy maʼlumot yuborilmaydi */
const COUNTER = 'https://countapi.mileshilliard.com/api/v1/hit/';
function countUsage() {
  if (!CFG.owner || !CFG.repo) return;
  const ns = ('ob-' + CFG.owner + '-' + CFG.repo).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const s = DB.settings, d = ymd(today()), hit = k => fetch(COUNTER + ns + '-' + k, { mode: 'cors' }).catch(() => {});
  if (!s.sanaldi) { hit('installs'); hit('installs-' + (Platform.native ? 'android' : 'web')); s.sanaldi = d; }
  if (s.faol_kun !== d) { hit('dau-' + d); s.faol_kun = d; }
  if (s.yil) { const age = new Date().getFullYear() - s.yil, g = age < 18 ? 'u18' : age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : age < 55 ? '45-54' : '55p';
    if (s.yosh_guruh !== g) { hit('age-' + g); s.yosh_guruh = g; } }
  Platform.save(DB);
}

/* =================== Bildirişnomalar =================== */
function scheduleNotifications() {
  if (!Platform.notify.available) return;
  const s = DB.settings, list = [], nowD = new Date(), d0 = today();
  const [hh, mm] = String(s.eslat_vaqt || '21:00').split(':').map(Number);
  if (s.eslat) for (let i = 0; i < 30; i++) { const at = addDays(d0, i); at.setHours(hh || 21, mm || 0, 0, 0); if (at > nowD) list.push({ id: 1000 + i, title: '📝 ' + t('app'), body: t('n_daily_b'), at }); }
  let k = 0;
  for (const r of live(DB.rec).filter(r => r.faol !== false)) for (let mo = 0; mo < 2; mo++) {
    const md = new Date(d0.getFullYear(), d0.getMonth() + mo, 1), due = recDue(r, md); due.setHours(10, 0, 0, 0);
    if (due > nowD && !recPaid(r, md)) list.push({ id: 2000 + k++, title: '🔁 ' + r.nom, body: t('n_rec_b', { s: fmt(r.s, (walById(r.w) || {}).cur) }), at: due });
  }
  for (const x of live(DB.debts).filter(x => !x.yopiq && x.muddat)) { const at = pd(x.muddat); at.setHours(10, 0, 0, 0); if (at > nowD) list.push({ id: 3000 + k++, title: '🤝 ' + x.kim, body: t(x.tur === 'berdim' ? 'n_debt_in' : 'n_debt_out', { s: fmt(debtLeft(x), x.cur) }), at }); }
  if (s.maosh_eslat && SD() > 1) for (let mo = 0; mo < 3; mo++) { const at = new Date(d0.getFullYear(), d0.getMonth() + mo, SD(), 9, 0, 0); if (at > nowD) list.push({ id: 4000 + mo, title: '💰 ' + t('app'), body: t('n_salary'), at }); }
  Platform.notify.replace(list.sort((a, b) => a.at - b.at));
}

/* =================== PIN =================== */
let PIN = { buf: '', mode: '', first: '', err: '' };
const SQ = 5;
const normAns = v => String(v || '').toLowerCase().replace(/[ʼ'‘’`]/g, '').replace(/\s+/g, ' ').trim();
function showLock(mode) {
  PIN = { buf: '', mode, first: '', err: '' };
  drawLock();
  if (mode === 'unlock' && DB.settings.bio) setTimeout(bioUnlock, 350);
}
function lockWait() { const u = +DB.settings.pin_until || 0; return Math.max(0, Math.ceil((u - Date.now()) / 1000)); }
let lockTimer = null;
function drawLock(shake) {
  clearInterval(lockTimer);
  const st = DB.settings, wait = PIN.mode === 'unlock' || PIN.mode === 'recover' ? lockWait() : 0;
  if (PIN.mode === 'recover') {
    $('#lock').innerHTML = `<div class="lock"><div class="mk">🔑</div><h2>${t('rec_t')}</h2>
     <div class="card" style="width:min(340px,100%);display:grid;gap:12px"><b>${t('sq' + st.sir_q)}</b>
      <div class="fld"><input id="recA" placeholder="${t('sq_ans')}" autocomplete="off" ${wait ? 'disabled' : ''}></div>
      ${wait ? `<div class="neg small" id="lw">${t('pin_wait', { n: wait })}</div>` : PIN.err ? `<div class="neg small">${PIN.err}</div>` : ''}
      <button class="btn w" data-act="pinrec" ${wait ? 'disabled' : ''}>${t('check')}</button>
      <button class="btn alt w sm" data-k="back">← ${t('back')}</button></div></div>`;
  } else {
    const title = PIN.mode === 'unlock' ? t('pin_enter') : PIN.first ? t('pin_repeat') : t('pin_new');
    const bad = shake && PIN.mode === 'unlock';
    $('#lock').innerHTML = `<div class="lock">${PIN.mode === 'unlock' ? `<div class="quote">${quoteOfOpen()}</div>` : ''}<div class="mk">💰</div><h2>${title}</h2><div class="dots ${shake ? 'shake' : ''} ${bad ? 'bad' : ''}">${[0, 1, 2, 3].map(i => `<i class="${i < PIN.buf.length || bad ? 'f' : ''}"></i>`).join('')}</div>
     <div class="lmsg ${wait || PIN.err ? 'neg' : ''}" id="lw">${wait ? t('pin_wait', { n: wait }) : PIN.err || '&nbsp;'}</div>
     <div class="kpad ${wait ? 'off' : ''}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}" ${wait ? 'disabled' : ''}>${n}</button>`).join('')}<button class="e" data-k="x">${PIN.mode === 'unlock' && !LOGOUT_PENDING ? t('pin_forgot') : t('cancel')}</button><button data-k="0" ${wait ? 'disabled' : ''}>0</button><button class="e" data-k="b">${PIN.mode === 'unlock' && st.bio && !PIN.buf ? '👆' : '⌫'}</button></div></div>`;
  }
  if (wait) lockTimer = setInterval(() => { const w = lockWait(); if (!w) { PIN.err = ''; return drawLock(); } const e = $('#lw'); if (e) e.textContent = t('pin_wait', { n: w }); }, 1000);
}
async function pinFail() {
  const st = DB.settings; st.pin_err = (+st.pin_err || 0) + 1; Platform.vibrate(250);
  const left = 3 - st.pin_err;
  if (left <= 0) { const steps = [30, 60, 300, 900]; st.pin_until = Date.now() + steps[Math.min(st.pin_err - 3, 3)] * 1000; PIN.err = ''; }
  else PIN.err = t('pin_bad', { n: left });
  await Platform.save(DB);
}
async function pinOk() { DB.settings.pin_err = 0; DB.settings.pin_until = 0; await Platform.save(DB); }
async function bioUnlock() {
  if (!DB.settings.bio || !$('#lock').innerHTML || PIN.mode !== 'unlock') return;
  const ok = await Platform.bio.auth({ title: t('bio_t'), sub: t('app'), cancel: t('use_pin') });
  if (ok) { await pinOk(); if (LOGOUT_PENDING) return finishLogout(); $('#lock').innerHTML = ''; afterUnlock(); }
}
async function recoverCheck() {
  if (lockWait()) return;
  const a = normAns(($('#recA') || {}).value); if (!a) return;
  if (await Platform.sha256('sq:' + a) === DB.settings.sir_h) { await pinOk(); PIN = { buf: '', mode: 'reset', first: '', err: '' }; toast(t('rec_ok')); return drawLock(); }
  await pinFail(); drawLock(true);
}
async function pinKey(k) {
  if (k === 'back') { PIN.mode = 'unlock'; PIN.err = ''; return drawLock(); }
  if (k === 'x' && LOGOUT_PENDING) { LOGOUT_PENDING = false; $('#lock').innerHTML = ''; return; }
  if (k === 'b') { if (PIN.mode === 'unlock' && DB.settings.bio && !PIN.buf) return bioUnlock(); PIN.buf = PIN.buf.slice(0, -1); return drawLock(); }
  if (k === 'x') {
    if (PIN.mode === 'unlock') {
      if (DB.settings.sir_h) { PIN.mode = 'recover'; PIN.err = ''; return drawLock(); }
      if (confirm(t('pin_forgot_q')) && confirm(t('pin_forgot_q2'))) { DB = newDB(); OB = { step: 1, rol: '', soni: 0 }; await Platform.save(DB); $('#lock').innerHTML = ''; render(); }
      return;
    }
    if (PIN.mode === 'reset') return; // tiklaşda bekor qilib bölmaydi
    $('#lock').innerHTML = ''; return;
  }
  if (lockWait() && PIN.mode === 'unlock') return;
  if (PIN.buf.length >= 4) return;
  PIN.buf += k; if (PIN.mode === 'unlock') PIN.err = ''; drawLock();
  if (PIN.buf.length < 4) return;
  const h = await Platform.sha256('ob:' + PIN.buf);
  if (PIN.mode === 'unlock') { if (h === DB.settings.pin) { await pinOk(); if (LOGOUT_PENDING) return finishLogout(); $('#lock').innerHTML = ''; afterUnlock(); } else { PIN.buf = ''; await pinFail(); setTimeout(() => drawLock(true), 120); } return; }
  if (!PIN.first) { PIN.first = h; PIN.buf = ''; return setTimeout(drawLock, 150); }
  if (PIN.first === h) {
    const wasReset = PIN.mode === 'reset'; DB.settings.pin = h; await pinOk(); await persist(); $('#lock').innerHTML = '';
    if (wasReset) { afterUnlock(); return toast(t('pin_set_ok')); }
    render(); toast(t('pin_set_ok')); if (!DB.settings.sir_h) setTimeout(() => openSecret(true), 400);
  } else { PIN.first = ''; PIN.buf = ''; toast(t('pin_mismatch'), 'bd'); Platform.vibrate(200); setTimeout(() => drawLock(true), 150); }
}
function openSecret(fromPin) {
  const st = DB.settings, cur = +st.sir_q || 1;
  formModal('🔑 ' + t('sq_t'), `<div class="small muted">${t('sq_help')}</div>
   <div class="fld"><label>${t('sq_q')}</label><select id="sqq">${Array.from({ length: SQ }, (_, i) => `<option value="${i + 1}" ${cur === i + 1 ? 'selected' : ''}>${t('sq' + (i + 1))}</option>`).join('')}</select></div>
   <div class="fld"><label>${t('sq_ans')}</label><input id="sqa" autocomplete="off" maxlength="40"></div>
   <div class="fld"><label>${t('sq_ans2')}</label><input id="sqa2" autocomplete="off" maxlength="40"></div>
   ${fromPin ? `<div class="small muted">${t('sq_skip')}</div>` : ''}`,
    async () => { const a = normAns(val('sqa')), a2 = normAns(val('sqa2'));
      if (a.length < 2) return toast(t('sq_short'), 'bd'); if (a !== a2) return toast(t('sq_nomatch'), 'bd');
      st.sir_q = +val('sqq'); st.sir_h = await Platform.sha256('sq:' + a); await persist(); closeModal(); render(); toast(t('saved')); });
}
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (!DB) return;
  if (document.hidden) hiddenAt = Date.now();
  else if (DB.settings.pin && hiddenAt && Date.now() - hiddenAt > 60000 && !$('#lock').innerHTML) showLock('unlock');
});

/* =================== Hodisalar =================== */
document.addEventListener('click', async e => {
  const c = s => e.target.closest(s); let x;
  if ((x = c('[data-k]'))) return pinKey(x.dataset.k);
  if (e.target.classList.contains('ovl')) return closeModal();
  if (c('[data-close]') && c('.mh')) return closeModal();
  if (UI.langOpen && !c('.langpop') && !c('[data-act=langmenu]')) { UI.langOpen = false; render(); }
  if ((x = c('[data-lang]'))) { UI.langOpen = false; if (M && $('#amt')) readTx(); DB.settings.til = x.dataset.lang; await persist(); applyTheme(); if (!DB.settings.ism) return onboarding(); render(); if (M && $('#modal').innerHTML && M.amt !== undefined) drawTx(); return; }
  if ((x = c('[data-setsec]'))) { UI.setSec = x.dataset.setsec; render(); $('#main') && ($('#main').scrollTop = 0); return; }
  if ((x = c('[data-pg]'))) { if ($('#modal').innerHTML) closeModal(); UI.setSec = null; UI.page = x.dataset.pg; render(); $('#main') && ($('#main').scrollTop = 0); return; }
  if ((x = c('[data-per]'))) { UI.per = x.dataset.per; UI.off = 0; return render(); }
  if ((x = c('[data-off]'))) { UI.off = Math.min(0, UI.off + +x.dataset.off); return render(); }
  if ((x = c('[data-hoff]'))) { UI.homeOff = Math.min(0, UI.homeOff + +x.dataset.hoff); return render(); }
  if ((x = c('[data-ttype]'))) { UI.txType = x.dataset.ttype; return render(); }
  if ((x = c('[data-whochip]'))) { UI.who = x.dataset.whochip; return render(); }
  if ((x = c('[data-plan]'))) { UI.plan = x.dataset.plan; return render(); }
  if ((x = c('[data-pct]'))) { $('#fp').value = x.dataset.pct; x.parentElement.querySelectorAll('.chip').forEach(b => b.classList.toggle('on', b === x)); return; }
  if ((x = c('[data-thm]'))) { DB.settings.mavzu = x.dataset.thm; DB.settings.mavzu_tanlandi = 1; await persist(); applyTheme(); return render(); }
  if ((x = c('[data-color]'))) { DB.settings.rang = x.dataset.color; await persist(); applyTheme(); return render(); }
  if ((x = c('[data-sw]'))) { const k = x.dataset.sw; if (k === 'bio' && !DB.settings.bio) { const ok = await Platform.bio.auth({ title: t('bio_t'), sub: t('app'), cancel: t('cancel') }); if (!ok) return toast(t('bio_fail'), 'bd'); } DB.settings[k] = !DB.settings[k]; await persist(); return render(); }
  if ((x = c('[data-fsw]'))) { x.classList.toggle('on'); $('#ff').value = x.classList.contains('on') ? 1 : 0; return; }
  /* amal formasi */
  if ((x = c('[data-tur]'))) { readTx(); M.tur = x.dataset.tur; M.c = ''; return drawTx(); }
  if ((x = c('[data-pickc]'))) { readTx(); M.c = x.dataset.pickc; return drawTx(); }
  if ((x = c('[data-pickw]'))) { readTx(); M.w = x.dataset.pickw; if (M.w2 === M.w) M.w2 = ''; return drawTx(); }
  if ((x = c('[data-kimga]'))) { if (x.dataset.kimga === '?') return toast(t('fam_none'), 'wn'); readTx(); M.kimga = x.dataset.kimga; M.w2 = ''; return drawTx(); }
  if ((x = c('[data-pickw2]'))) { readTx(); M.w2 = x.dataset.pickw2; return drawTx(); }
  if ((x = c('[data-catd]'))) return catSheet(x.dataset.catd, x.dataset.src);
  if ((x = c('[data-setrol]'))) { DB.settings.rol = x.dataset.setrol; await persist(); render(); return toast(t('saved')); }
  if ((x = c('[data-setsoni]'))) { DB.settings.oila_soni = +x.dataset.setsoni; await persist(); render(); return toast(t('saved')); }
  if ((x = c('[data-obrol]'))) { obRead(); OB.rol = x.dataset.obrol; return onboarding(); }
  if ((x = c('[data-obsoni]'))) { obRead(); OB.soni = +x.dataset.obsoni; return onboarding(); }
  if ((x = c('[data-fbt]'))) { FB.type = x.dataset.fbt; FB.t = ($('#fbt') || {}).value || FB.t; return render(); }
  if ((x = c('[data-txv]'))) return txSheet(x.dataset.txv);
  if ((x = c('[data-edit]'))) { const tx = DB.tx.find(z => z.id === x.dataset.edit); if (!tx) return; if (tx.g && DB.goals.find(q => q.id === tx.g)) return openGoalMoney(tx.g, tx.tur === 'd' ? 'out' : 'in', tx.id); openTx(tx.id); return; }
  if ((x = c('[data-dup]'))) { const tx = DB.tx.find(z => z.id === x.dataset.dup); if (!tx) return; const { id: _i, u: _u, ...rest } = tx; if (tx.g) return openGoalMoney(tx.g, tx.tur === 'd' ? 'out' : 'in'); return openTx(null, { ...rest, dt: ymd(today()), kim: me(), amt: String(tx.s), amt2: tx.s2 != null ? String(tx.s2) : '' }); }
  if ((x = c('[data-goalv]')) && !c('[data-goaladd]')) return goalSheet(x.dataset.goalv);
  if ((x = c('[data-goalmoney]'))) return openGoalMoney(x.dataset.goalmoney, x.dataset.dir);
  if ((x = c('[data-gmw]'))) { $('#gmw').value = x.dataset.gmw; document.querySelectorAll('[data-gmw]').forEach(b => b.classList.toggle('on', b === x)); const w = walById(x.dataset.gmw); if ($('#gmu')) $('#gmu').textContent = unit(w && w.cur); return; }
  if ((x = c('[data-emoji]'))) { $('#' + x.dataset.for).value = x.dataset.emoji; x.parentElement.querySelectorAll('.on').forEach(b => b.classList.remove('on')); x.classList.add('on'); return; }
  if ((x = c('[data-dtur]'))) { $('#ft').value = x.dataset.dtur; x.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === x)); return; }
  if ((x = c('[data-ctur]'))) { $('#ft').value = x.dataset.ctur; x.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === x)); $('#fgw').hidden = x.dataset.ctur === 'd'; return; }
  if ((x = c('[data-limit]'))) return openLimit(x.dataset.limit);
  if ((x = c('[data-goaledit]'))) return openGoal(x.dataset.goaledit);
  if ((x = c('[data-goaladd]'))) return openGoalMoney(x.dataset.goaladd, 'in');
  if ((x = c('[data-debt]'))) return openDebt(x.dataset.debt);
  if ((x = c('[data-recedit]'))) return openRec(x.dataset.recedit);
  if ((x = c('[data-recpay]'))) return payRec(x.dataset.recpay);
  if ((x = c('[data-wal]'))) return openWallet(x.dataset.wal);
  if ((x = c('[data-wup]')) || (x = c('[data-wdn]'))) { const ws = W(), id = x.dataset.wup || x.dataset.wdn, i = ws.findIndex(w => w.id === id), j = x.dataset.wup ? i - 1 : i + 1;
    if (j < 0 || j >= ws.length) return; [ws[i], ws[j]] = [ws[j], ws[i]]; ws.forEach((w, k) => { if (w.tartib !== k) { w.tartib = k; touch(w); } }); await persist(); return render(); }
  if ((x = c('[data-lesson]'))) return openLesson(x.dataset.lesson);
  if ((x = c('[data-qa]'))) { if (QZ.picked != null) return; QZ.picked = +x.dataset.qa; const q = (LESSONS[L()] || LESSONS.uz).find(z => z.id === QZ.id).q[QZ.i]; if (QZ.picked === q.c) QZ.score++; return drawQuiz(); }
  if ((x = c('[data-rc]'))) { CONV.f = x.dataset.rc; if (CONV.to === CONV.f) CONV.to = 'UZS'; convSave(); render(); $('#main').scrollTop = 0; return; }
  if ((x = c('[data-bkc]'))) { UI.bkc = x.dataset.bkc; return render(); }
  if ((x = c('[data-cvq]'))) { CONV.f = x.dataset.cvq; if (CONV.to === CONV.f) CONV.to = 'UZS'; convSave(); return render(); }
  if ((x = c('[data-cat]'))) return openCat(x.dataset.cat);
  if ((x = c('[data-del]'))) { const [col, id, sub] = x.dataset.del.split(':'); if (!confirm(col === 'goals' ? t('goal_del_q') : t('del_q'))) return;
    if (col === 'shopit') { const l = DB.lists.find(z => z.id === id); if (l) upsert('lists', { ...l, items: l.items.filter(i => i.id !== sub) }); await persist(); closeModal(); render(); return toast(t('deleted')); }
    if (col === 'lists') UI.shopList = null;
    remove(col, id); await persist(); closeModal(); render(); return toast(t('deleted')); }
  if ((x = c('[data-act]'))) {
    const a = x.dataset.act;
    if (a === 'add') return openTx(null);
    if (a === 'nearedit') return openNear();
    if (a === 'eye') { DB.settings.yashir = !DB.settings.yashir; await Platform.save(DB); return render(); }
    if (a === 'walsheet') return walletSheet();
    if (a === 'incsheet') return typeSheet('d');
    if (a === 'expsheet') return typeSheet('x');
    if (a === 'seeall') { UI.page = 'tx'; UI.per = 'month'; UI.off = UI.homeOff; UI.txType = x.dataset.tt; closeModal(); render(); return; }
    if (a === 'planedit') { const p = DB.settings.tejash_foiz || 20;
      formModal('🐷 ' + t('plan_t'), `<div class="small muted">${t('plan_help')}</div><div class="chips">${[10, 15, 20, 25, 30].map(v => `<button class="chip ${v === p ? 'on' : ''}" data-pct="${v}">${v}%</button>`).join('')}</div>
        <div class="fld"><label>${t('plan_pct')}</label><input id="fp" type="number" min="0" max="90" value="${p}"></div>`, async () => { DB.settings.tejash_foiz = Math.max(0, Math.min(90, +val('fp') || 0)); await persist(); closeModal(); render(); toast(t('saved')); }); return; }
    if (a === 'ratesref') { toast(t('loading')); const ok = await fetchRates(true); await fetchBanks(true); if (!ok) toast(t('rates_fail'), 'bd'); else toast(t('saved')); return; }
    if (a === 'cvswap') { [CONV.f, CONV.to] = [CONV.to, CONV.f]; convSave(); return render(); }
    if (a === 'quizstart') { QZ = { id: x.dataset.lid, i: 0, score: 0, picked: null }; return drawQuiz(); }
    if (a === 'quiznext') { QZ.i++; QZ.picked = null; return drawQuiz(); }
    if (a === 'quizclose') { closeModal(); return render(); }
    if (a === 'transfer') return openTx(null, { tur: 'o' });
    if (a === 'theme') { const cur = document.documentElement.dataset.theme; DB.settings.mavzu = cur === 'dark' ? 'light' : 'dark'; DB.settings.mavzu_tanlandi = 1; await persist(); applyTheme(); return render(); }
    if (a === 'savetx') return saveTx();
    if (a === 'formsave') return FORM && FORM();
    if (a === 'catnew') { if (M && $('#amt')) { readTx(); return openCat(null, M.tur === 'd' ? 'd' : 'x'); } return openCat(null); }
    if (a === 'walnew') return openWallet(null);
    if (a === 'goalnew') return openGoal(null);
    if (a === 'debtnew') return openDebt(null);
    if (a === 'recnew') return openRec(null);
    if (a === 'debtret') { const d = M.debt, v = parseAmt(val('fr')) || debtLeft(d); d.qaytdi = [...(d.qaytdi || []), { dt: ymd(today()), s: Math.min(v, debtLeft(d)) }]; d.yopiq = debtLeft(d) <= 0; upsert('debts', d); await persist(); closeModal(); render(); return toast(d.yopiq ? t('debt_closed') : t('saved')); }
    if (a === 'obnext') return obNext();
    if (a === 'obback') { obRead(); OB.step = Math.max(1, OB.step - 1); return onboarding(); }
    if (a === 'obpin') return obFinish(true);
    if (a === 'obfinish') return obFinish(false);
    if (a === 'secq') return openSecret();
    if (a === 'feedback') { UI.page = 'feedback'; return render(); }
    if (a === 'fbimg') { const f = await Platform.pickFile('image/*'); if (f) { FB.img = f; FB.t = ($('#fbt') || {}).value || FB.t; render(); } return; }
    if (a === 'fbimgx') { FB.img = null; FB.t = ($('#fbt') || {}).value || FB.t; return render(); }
    if (a === 'fbsend') return fbSend();
    if (a === 'pinbio') return bioUnlock();
    if (a === 'pinrec') { const ok = await recoverCheck(); return ok; }
    if (a === 'obdone') { const n = ($('#obName').value || '').trim(); if (!n) { $('#obName').classList.add('err'); return $('#obName').focus(); }
      DB.settings.ism = n; if ($('#obRate')) DB.settings.kurs = parseAmt($('#obRate').value) || DB.settings.kurs;
      document.querySelectorAll('[data-ob]').forEach(i => { const w = walById(i.dataset.ob); if (w) { w.start = parseAmt(i.value); w.egasi = n; touch(w); } });
      await persist(); return render(); }
    if (a === 'famsheet') return famSheet();
    if (a === 'langmenu') { UI.langOpen = !UI.langOpen; return render(); }
    if (a === 'syncsend') { closeModal(); return syncSend(); }
    if (a === 'syncget') return syncGet();
    if (a === 'xlexp') return excelExport(range(UI.per, UI.off));
    if (a === 'xlall') return excelExport(null);
    if (a === 'pinset') return showLock('set');
    if (a === 'pinoff') { DB.settings.pin = ''; DB.settings.bio = false; await persist(); render(); return toast(t('pin_off_ok')); }
    if (a === 'setback') { UI.setSec = null; return render(); }
    if (a === 'backupfull') return syncSend(true);
    if (a === 'logout') return logoutFlow();
    if (a === 'logoutsave') { const ok = await syncSend(true); if (ok === false) return; if (!confirm(t('logout_confirm2'))) return; return doLogout(); }
    if (a === 'logoutnow') { if (!confirm(t('logout_confirm'))) return; return doLogout(); }
    if (a === 'obrestore') return obRestore();
    if (a === 'ntest') { const r = await Platform.notify.test('💰 ' + t('app'), t('n_daily_b')); return toast(r.ok ? t('n_test_ok') : r.denied ? t('n_denied') : t('error'), r.ok ? '' : 'bd'); }
    if (a === 'tglink') return tgLink();
    if (a === 'tgcancel') { TG.phase = 'idle'; clearTimeout(TG.timer); return render(); }
    if (a === 'tgcopy') { try { await navigator.clipboard.writeText(TG.code); } catch (_) {} return toast(t('copied')); }
    if (a === 'tgunlink') { Object.assign(DB.settings, { tg_chat_id: null, tg_chat_nomi: '' }); await persist(); return render(); }
    if (a === 'tgsend') { try { await Platform.tg(DB.settings.tg_token, 'sendMessage', { chat_id: DB.settings.tg_chat_id, text: weekReport(0), parse_mode: 'HTML' }); toast(t('tg_sent')); } catch (err) { toast(tgErr(err.message), 'bd'); } return; }
  }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'rq' || el.id === 'cva') { if (el.id === 'rq') CONV.q = el.value; else CONV.a = el.value.replace(/[^\d.,]/g, ''); const pos = el.selectionStart, id = el.id; render(); const q = $('#' + id); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (_) {} } return; }
  if (el.id === 'q') { UI.q = el.value; const pos = el.selectionStart; render(); const q = $('#q'); q.focus(); q.setSelectionRange(pos, pos); return; }
  if (el.id === 'amt' || el.id === 'amt2' || el.getAttribute('inputmode') === 'decimal') {
    const before = el.value, pos = el.selectionStart, digitsBefore = before.slice(0, pos).replace(/\s/g, '').length;
    const f = fmtInput(before.replace(/[^\d.,]/g, '')); el.value = f;
    let i = 0, n = 0; while (i < f.length && n < digitsBefore) { if (f[i] !== ' ') n++; i++; } el.setSelectionRange(i, i);
    el.classList.remove('err');
  }
});
document.addEventListener('change', async e => {
  const el = e.target;
  if (el.id === 'who') { UI.who = el.value; return render(); }
  if (el.id === 'cvf' || el.id === 'cvt') { CONV[el.id === 'cvf' ? 'f' : 'to'] = el.value; convSave(); return render(); }
  if (el.id === 'setSd') { DB.settings.oy_boshi = +el.value; await persist(); scheduleNotifications(); render(); return toast(t('saved')); }
  if (el.id === 'setYear') { const v = +el.value; if (v >= 1920 && v <= new Date().getFullYear() - 5) { DB.settings.yil = v; await persist(); return toast(t('saved')); } return toast(t('e_year'), 'bd'); }
  if (el.id === 'setCity') { DB.settings.shahar = el.value.trim(); await persist(); return toast(t('saved')); }
  if (el.id === 'setName' && el.value.trim()) { DB.settings.ism = el.value.trim(); await persist(); return toast(t('saved')); }
  if (el.id === 'setRate') { const v = parseAmt(el.value); if (v > 0) { DB.settings.kurs = v; await persist(); render(); toast(t('saved')); } return; }
  if (el.id === 'ntime' && el.value) { DB.settings.eslat_vaqt = el.value; await persist(); return toast(t('saved')); }
  if (el.id === 'txdt' || el.id === 'txn') return;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').innerHTML) closeModal(); if (e.key === 'Enter' && e.target.id === 'amt') saveTx(); });

/* =================== Motivatsion söz =================== */
let QOPEN = null;
function quoteOfOpen() { const Q = (QUOTES[L()] || QUOTES.uz); if (QOPEN == null) { const k = (+DB.settings.qi || 0) % Q.length; QOPEN = k; DB.settings.qi = k + 1; Platform.save(DB); } return esc(Q[QOPEN % Q.length]); }
function splash() {
  const el = document.createElement('div'); el.className = 'splash'; el.innerHTML = `<div class="mk">💰</div><b>${t('app')}</b><div class="quote">${quoteOfOpen()}</div><small>${t('tap_skip')}</small>`;
  document.body.appendChild(el); const go = () => { el.classList.add('out'); setTimeout(() => el.remove(), 350); };
  el.addEventListener('click', go); setTimeout(go, 2300);
}

/* =================== Profildan çiqiş / zaxiradan tiklaş =================== */
function logoutFlow() {
  modal(`${mhead('🚪 ' + t('logout'))}<div class="mb">
   <div class="tip wn"><span>⚠️</span><div>${t('logout_warn')}</div></div>
   <button class="btn w" data-act="logoutsave">💾 ${t('logout_save')}</button>
   <button class="btn dng w" data-act="logoutnow">${t('logout_nosave')}</button>
   <button class="btn alt w" data-close>${t('cancel')}</button></div>`);
}
async function doLogout() {
  if (DB.settings.pin) { closeModal(); PIN = { buf: '', mode: 'unlock', first: '', err: '' }; LOGOUT_PENDING = true; drawLock(); return; }
  await finishLogout();
}
let LOGOUT_PENDING = false;
async function finishLogout() {
  LOGOUT_PENDING = false; const til = DB.settings.til; DB = newDB(); DB.settings.til = til; OB = { step: 1, rol: '', soni: 0 };
  await Platform.save(DB); closeModal(); $('#lock').innerHTML = ''; UI.page = 'home'; UI.setSec = null; render(); toast(t('logged_out'));
}
async function obRestore() {
  const f = await Platform.pickFile('.json,application/json'); if (!f) return;
  try { const d = JSON.parse(await f.text()); if (d.format !== 'oila-byudjeti') throw 0;
    const keep = DB.settings; merge(d);
    if (d.settings && d.settings.ism) DB.settings = { ...keep, ...d.settings };
    else { const owner = d.kim || (W().find(w => w.egasi) || {}).egasi; if (owner) DB.settings.ism = owner; }
    if (!DB.settings.ism) throw 1;
    await persist(); render(); afterUnlock(); toast(t('restored', { k: DB.settings.ism }));
  } catch (_) { toast(t('bad_file'), 'bd'); }
}

/* =================== Orqaga tugmasi =================== */
let lastBack = 0, BIO_OK = false;
function onBack() {
  const lk = $('#lock');
  if (lk && lk.innerHTML) {
    if (PIN.mode === 'recover') { pinKey('back'); return; }
    if (PIN.mode === 'set') { lk.innerHTML = ''; return; }
  } else if ($('#modal').innerHTML) { closeModal(); return; }
  else if (DB && !DB.settings.ism) { if (OB.step > 1) { obRead(); OB.step--; onboarding(); return; } }
  else if (UI.page === 'settings' && UI.setSec) { UI.setSec = null; render(); return; }
  else if (UI.page === 'shop') { if (UI.shopList) UI.shopList = null; else UI.page = 'home'; render(); return; }
  else if (SUB.includes(UI.page)) { UI.page = 'more'; render(); return; }
  else if (UI.page !== 'home') { UI.page = 'home'; render(); $('#main') && ($('#main').scrollTop = 0); return; }
  if (Date.now() - lastBack < 2000) { Platform.exit(); return 'exit'; }
  lastBack = Date.now(); toast(t('back_exit'));
}

/* =================== Işga tuşiriş =================== */
function afterUnlock() { render(); scheduleNotifications(); setTimeout(tgWeekly, 1500); setTimeout(() => fetchRates(false), 300); setTimeout(() => fetchBanks(false), 900); setTimeout(countUsage, 2500); if (pendingOpen && DB.settings.ism) setTimeout(runPendingOpen, 600); }
async function boot() {
  DB = await Platform.load();
  if (!DB || !DB.settings) DB = newDB();
  const def = newDB(); DB.settings = { ...def.settings, ...DB.settings }; COLS.forEach(c => DB[c] = DB[c] || []);
  def.cats.forEach(c => { if (!DB.cats.some(z => z.id === c.id)) DB.cats.push(c); });
  if (DB.settings.mavzu === 'auto' && !DB.settings.mavzu_tanlandi) DB.settings.mavzu = 'light';
  applyTheme();
  Platform.onBack(onBack);
  Platform.onOpenUrl(handleOpenUrl);
  Platform.bio.available().then(r => { BIO_OK = !!r; });
  if (DB.settings.pin) { render(); showLock('unlock'); } else { afterUnlock(); if (DB.settings.ism && DB.settings.splash !== false) splash(); }
  if (!Platform.native && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  setInterval(() => { const k = ymd(today()); if (k !== boot.day) { boot.day = k; render(); } }, 60000); boot.day = ymd(today());
}
window.addEventListener('load', boot);
