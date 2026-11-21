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
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  import: '<path d="M12 3v12M7 10l5 5 5-5M5 15v5h14v-5"/>', export: '<path d="M12 15V3M7 8l5-5 5 5M5 15v5h14v-5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  bell: '<path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16z"/><path d="M10 21h4"/>', swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
};
const ic = (k, st = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${st ? `style="${st}"` : ''}>${IC[k] || ''}</svg>`;

/* =================== Boşlangiç maʼlumotlar =================== */
const DEF_CATS = [
  ['food', '🛒', 'x', 'z'], ['transport', '🚕', 'x', 'z'], ['utility', '💡', 'x', 'z'], ['home', '🏠', 'x', 'z'], ['phone', '📱', 'x', 'z'],
  ['health', '💊', 'x', 'z'], ['kids', '🧸', 'x', 'z'], ['edu', '📚', 'x', 'z'], ['credit', '🏦', 'x', 'z'], ['household', '🧺', 'x', 'z'],
  ['clothes', '👕', 'x', 'h'], ['cafe', '☕', 'x', 'h'], ['fun', '🎬', 'x', 'h'], ['gifts', '🎁', 'x', 'h'], ['beauty', '💇', 'x', 'h'], ['other', '📦', 'x', 'h'],
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
    settings: { til: 'uz', mavzu: 'auto', rang: 'green', ism: '', kurs: 12800, pin: '', eslat: true, eslat_vaqt: '21:00',
      tg_token: '', tg_bot: '', tg_chat_id: null, tg_chat_nomi: '', tg_haftalik: true, tg_oxirgi: '', sync_oxirgi: '' },
    /* hamyonlar har bir telefonda alohida (id takrorlanmaydi); standart kategoriyalar u:0 —
       şunda sinxronizatsiyada boşqa telefonning standart nusxasi sizning özgarişlaringizni bosib ketmaydi */
    wallets: [['cash', '💵', 'UZS'], ['card', '💳', 'UZS'], ['usd', '💲', 'USD']].map(([k, e, cur]) => ({ id: 'w_' + k + '_' + uid(), k, e, cur, start: 0, u: 0 })),
    cats: DEF_CATS.map(([k, e, tur, g]) => ({ id: 'c_' + k, k, e, tur, g, limit: 0, u: 0 })),
    tx: [], rec: [], debts: [], goals: [],
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

async function persist() { await Platform.save(DB); scheduleNotifications(); }
function touch(o) { o.u = now(); return o; }
function upsert(col, rec) { touch(rec); const i = DB[col].findIndex(x => x.id === rec.id); if (i >= 0) DB[col][i] = rec; else DB[col].push(rec); }
function remove(col, id) { const r = DB[col].find(x => x.id === id); if (r) { r.d = true; touch(r); } }

/* =================== Pul =================== */
const rate = () => +DB.settings.kurs || 0;
const toUZS = (n, cur) => cur === 'USD' ? n * rate() : n;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
function fmt(n, cur = 'UZS', sign = false) {
  const neg = n < 0; n = Math.abs(n);
  let s = cur === 'USD' ? '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' ') : sp(Math.round(n)) + ' ' + t('sum');
  return (neg ? '−' : sign ? '+' : '') + s;
}
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
function range(per, off) {
  const d = today(); let a, b, label;
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
const totalBalance = () => live(DB.wallets).reduce((s, w) => s + toUZS(balance(w), w.cur), 0);
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
const members = () => [...new Set(live(DB.tx).map(x => x.kim).filter(Boolean))];

/* doimiy tölovlar */
function recDue(r, monthDate) { const y = monthDate.getFullYear(), m = monthDate.getMonth(); const last = new Date(y, m + 1, 0).getDate(); return new Date(y, m, Math.min(r.kun, last)); }
const recKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const recPaid = (r, d) => (r.paid || []).includes(recKey(d));
function recUnpaidThisMonth() { const d = today(); return live(DB.rec).filter(r => r.faol !== false && !recPaid(r, d)); }

/* kuniga qancha */
function allowance() {
  const r = monthRange(0), S = stats(r), d = today();
  const daysLeft = Math.round((r.b - d) / 864e5);
  const recLeft = recUnpaidThisMonth().reduce((s, x) => s + toUZS(x.s, (walById(x.w) || {}).cur), 0);
  const avail = S.inc - S.exp - recLeft;
  return { avail, daysLeft, perDay: daysLeft > 0 ? Math.max(0, avail) / daysLeft : 0, inc: S.inc, recLeft };
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
const perNav = r => `<div class="mnav"><button class="ib" data-off="-1">${ic('left')}</button><b>${r.label}</b><button class="ib" data-off="1" ${r.off >= 0 ? 'disabled style="opacity:.35"' : ''}>${ic('right')}</button></div>`;
const perSeg = () => `<div class="seg full">${['week', 'month', 'quarter', 'year'].map(p => `<button class="${UI.per === p ? 'on' : ''}" data-per="${p}">${t('per_' + p)}</button>`).join('')}</div>`;

function render() {
  if (!DB) return;
  if (!DB.settings.ism) return onboarding();
  const pages = { home: pageHome, tx: pageTx, report: pageReport, plan: pagePlan, settings: pageSettings };
  const th = document.documentElement.dataset.theme;
  $('#root').innerHTML = `<div class="app"><main class="main" id="main">
   <header class="top"><h1>${t('pg_' + UI.page)}</h1>
    <div class="seg">${LANGS.map(([k]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}">${k.toUpperCase()}</button>`).join('')}</div>
    <button class="ib" data-act="theme">${ic(th === 'dark' ? 'sun' : 'moon')}</button></header>
   <div class="page">${pages[UI.page]()}</div></main>
   ${['home', 'tx', 'report'].includes(UI.page) ? `<button class="fab" data-act="add" aria-label="${t('add')}">${ic('plus')}</button>` : ''}
   <nav class="nav">${[['home', 'home'], ['tx', 'list'], ['report', 'chart'], ['plan', 'target'], ['settings', 'gear']].map(([p, i]) => `<button class="${UI.page === p ? 'on' : ''}" data-pg="${p}">${ic(i)}${t('nav_' + p)}</button>`).join('')}</nav></div>`;
}

/* ---------- Boşlaş (birinçi marta) ---------- */
function onboarding() {
  $('#root').innerHTML = `<div class="app"><main class="main"><div class="page" style="padding-top:calc(30px + env(safe-area-inset-top))">
   <div style="text-align:center"><div class="lock" style="position:static;background:none;padding:0;gap:12px"><div class="mk">💰</div><h2>${t('app')}</h2></div><p class="muted">${t('ob_sub')}</p></div>
   <div class="seg full">${LANGS.map(([k, n]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}">${n}</button>`).join('')}</div>
   <div class="card" style="display:grid;gap:14px">
    <div class="fld"><label>${t('ob_name')}</label><input id="obName" placeholder="${t('ob_name_ph')}" maxlength="30"></div>
    <div class="fld"><label>${t('rate')}</label><input id="obRate" inputmode="decimal" value="${sp(DB.settings.kurs)}"></div>
    <div class="small muted">${t('ob_start')}</div>
    ${live(DB.wallets).map(w => `<div class="fld"><label>${w.e} ${walName(w)} (${w.cur === 'USD' ? '$' : t('sum')})</label><input data-ob="${w.id}" inputmode="decimal" placeholder="0"></div>`).join('')}
   </div>
   <button class="btn w" data-act="obdone">${t('ob_go')} →</button></div></main></div>`;
}

/* ---------- Boş sahifa ---------- */
function pageHome() {
  const r = monthRange(UI.homeOff), S = stats(r), A = allowance(), H = health(), cur = UI.homeOff === 0;
  const wal = live(DB.wallets);
  const alerts = [];
  if (cur) {
    for (const c of live(DB.cats).filter(c => c.tur === 'x' && c.limit > 0)) {
      const s = catSpentMonth(c.id), p = s / c.limit * 100;
      if (p >= 100) alerts.push(['var(--bad)', `${c.e} ${t('al_over', { c: catName(c), p: Math.round(p) })}`]);
      else if (p >= 80) alerts.push(['var(--warn)', `${c.e} ${t('al_near', { c: catName(c), p: Math.round(p) })}`]);
    }
    const d = today();
    for (const x of recUnpaidThisMonth()) { const due = recDue(x, d), n = Math.round((due - d) / 864e5); if (n <= 3) alerts.push([n < 0 ? 'var(--bad)' : 'var(--warn)', `🔁 ${t(n < 0 ? 'al_rec_late' : n === 0 ? 'al_rec_today' : 'al_rec_soon', { n: esc(x.nom), d: n })} — ${fmt(x.s, (walById(x.w) || {}).cur)}`]); }
    for (const x of live(DB.debts).filter(x => !x.yopiq && x.muddat)) { const n = Math.round((pd(x.muddat) - d) / 864e5); if (n <= 3) alerts.push([n < 0 ? 'var(--bad)' : 'var(--warn)', `🤝 ${t(x.tur === 'berdim' ? 'al_debt_in' : 'al_debt_out', { k: esc(x.kim) })}: ${fmt(debtLeft(x), x.cur)} — ${n < 0 ? t('overdue') : fmtDay(pd(x.muddat))}`]); }
  }
  const recent = live(DB.tx).sort((a, b) => b.dt.localeCompare(a.dt) || b.u - a.u).slice(0, 5);
  return `
  <div class="hero"><small>${t('total_bal')}</small><div class="big num">${fmt(totalBalance())}</div>
   <div class="mnav" style="margin:-4px 0 10px;position:relative;z-index:1;color:#fff"><button class="ib pl" style="color:#fff" data-hoff="-1">${ic('left')}</button><b style="font-size:13.5px">${r.label}</b><button class="ib pl" style="color:#fff;${cur ? 'opacity:.3' : ''}" data-hoff="1" ${cur ? 'disabled' : ''}>${ic('right')}</button></div>
   <div class="two"><div><small>↓ ${t('income')}</small><b class="num">${fmt(S.inc)}</b></div><div><small>↑ ${t('expense')}</small><b class="num">${fmt(S.exp)}</b></div></div></div>
  ${wal.length ? `<div class="wl">${wal.map(w => `<div class="wc"><span>${w.e}</span><small>${esc(walName(w))}</small><b class="num ${balance(w) < 0 ? 'neg' : ''}">${fmt(balance(w), w.cur)}</b></div>`).join('')}</div>` : ''}
  ${alerts.length ? `<div style="display:grid;gap:8px">${alerts.map(([c, m]) => `<div class="alert" style="--c:${c}">${m}</div>`).join('')}</div>` : ''}
  ${cur ? `<div class="card"><div class="allow"><div class="em">📅</div><div style="flex:1">
    ${A.inc > 0 ? `<small class="muted">${t('allow_t')}</small><b class="num ${A.avail < 0 ? 'neg' : ''}">${A.avail < 0 ? t('allow_over') : fmt(A.perDay)}</b><small class="muted">${t('allow_s', { d: A.daysLeft, s: fmt(Math.max(0, A.avail)) })}${A.recLeft ? ' · ' + t('allow_rec', { s: fmt(A.recLeft) }) : ''}</small>`
      : `<b style="font-size:16px">${t('allow_noinc')}</b><small class="muted">${t('allow_noinc_s')}</small>`}</div></div></div>` : ''}
  ${cur && H ? `<div class="card"><div class="health">${ringSvg(H.score, H.col)}<div><div class="small muted">${t('health')}</div><div class="lbl" style="color:${H.col}">${t(H.lvl)}</div><div class="tip" style="padding:0;border:0;background:none;margin-top:4px">${H.tip}</div></div></div></div>` : ''}
  <div class="card"><div class="ch"><h2>${t('recent')}</h2><button class="lnk" data-pg="tx">${t('all')} →</button></div>
   ${recent.length ? recent.map((x, i) => txRow(x, i)).join('') : `<div class="empty"><div class="em">🧾</div><b>${t('no_tx')}</b>${t('no_tx_s')}</div>`}</div>`;
}
function ringSvg(v, col) {
  const R = 36, C = 2 * Math.PI * R;
  return `<div class="ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="${R}" fill="none" stroke="var(--s3)" stroke-width="8"/><circle cx="42" cy="42" r="${R}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C * v / 100} ${C}"/></svg><b>${v}</b></div>`;
}
function txRow(x, i = 0) {
  const w = walById(x.w), c = catById(x.c);
  let icon, title, sub, am, cls;
  if (x.tur === 'o') { const w2 = walById(x.w2); icon = '🔄'; title = t('transfer'); sub = `${walName(w)} → ${walName(w2)}`; am = fmt(x.s, w && w.cur); cls = ''; }
  else { icon = c ? c.e : '❓'; title = catName(c); sub = [x.n, walName(w)].filter(Boolean).map(esc).join(' · '); am = fmt(x.s, w && w.cur, x.tur === 'd'); cls = x.tur === 'd' ? 'pos' : ''; if (x.tur === 'x') am = '−' + am; }
  const who = members().length > 1 && x.kim ? ` · 👤 ${esc(x.kim)}` : '';
  return `<div class="tr" style="--i:${i}" data-edit="${x.id}"><div class="ico sm" style="--c:${c ? catColor(c) : 'var(--acc)'}">${icon}</div><div class="tx"><b>${esc(title)}</b><small>${sub}${who}</small></div><div class="am num ${cls}">${am}<small>${fmtDay(pd(x.dt))}</small></div></div>`;
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
function pageReport() {
  const r = range(UI.per, UI.off), S = stats(r, UI.who), P = stats(range(UI.per, UI.off - 1), UI.who), mem = members();
  const bal = S.inc - S.exp, saveP = S.inc > 0 ? Math.round((bal + S.byGroup.j) / S.inc * 100) : null;
  const chg = (a, b) => b > 0 ? Math.round((a - b) / b * 100) : null;
  const ce = chg(S.exp, P.exp), ci = chg(S.inc, P.inc);
  const cats = Object.entries(S.byCat).sort((a, b) => b[1] - a[1]);
  const R = 80, C = 2 * Math.PI * R; let off = 0;
  const donut = cats.length ? `<div class="donut"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="${R}" fill="none" stroke="var(--s3)" stroke-width="26"/>${cats.map(([id, v]) => { const len = v / S.exp * C; const el = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${catColor(catById(id))}" stroke-width="26" stroke-dasharray="${Math.max(0, len - 1.5)} ${C}" stroke-dashoffset="${-off}"/>`; off += len; return el; }).join('')}</svg><div class="ctr"><div><b class="num">${short(S.exp)}</b><small>${t('expense')}</small></div></div></div>` : '';
  const pill = (v, invert) => v === null ? '' : `<em style="color:${(v > 0) !== !!invert ? 'var(--bad)' : 'var(--good)'}">${v > 0 ? '▲' : v < 0 ? '▼' : '='} ${Math.abs(v)}%</em>`;
  return `${perSeg()}${perNav(r)}
  ${mem.length > 1 ? `<div class="chips">${['', ...mem].map(m => `<button class="chip ${UI.who === m ? 'on' : ''}" data-whochip="${esc(m)}">${m ? '👤 ' + esc(m) : '👥 ' + t('everyone')}</button>`).join('')}</div>` : ''}
  <div class="sum3">
   <div class="kp"><small>${t('income')}</small><b class="num pos">${fmt(S.inc)}</b>${pill(ci, true)}</div>
   <div class="kp"><small>${t('expense')}</small><b class="num neg">${fmt(S.exp)}</b>${pill(ce)}</div>
   <div class="kp"><small>${t('left')}</small><b class="num ${bal < 0 ? 'neg' : ''}">${fmt(bal, 'UZS', true)}</b></div>
   <div class="kp"><small>${t('save_rate')}</small><b class="num">${saveP === null ? '—' : saveP + '%'}</b></div></div>
  <div class="card"><div class="ch"><h2>🍩 ${t('by_cat')}</h2>${ce !== null ? `<span class="small muted">${t('vs_prev')}</span>` : ''}</div>
   ${cats.length ? donut + `<div class="cl">${cats.map(([id, v]) => { const c = catById(id), p = v / S.exp * 100, pv = P.byCat[id] || 0, d = chg(v, pv);
      return `<div class="row"><div class="ico sm" style="--c:${catColor(c)}">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))}</b><div class="bar" style="margin-top:5px"><i style="width:${p}%;--c:${catColor(c)}"></i></div></div><div class="pct num">${fmt(v)}<small>${p.toFixed(1)}% ${d === null ? '' : `<span style="color:${d > 0 ? 'var(--bad)' : 'var(--good)'}">${d > 0 ? '▲' : '▼'}${Math.abs(d)}%</span>`}</small></div></div>`; }).join('')}</div>`
      : `<div class="empty"><div class="em">📊</div><b>${t('no_exp')}</b></div>`}</div>
  <div class="card"><div class="ch"><h2>📈 ${t('dynamics')}</h2><span class="small"><span class="pos">■</span> ${t('income')} &nbsp;<span class="neg">■</span> ${t('expense')}</span></div>${barChart(r, UI.who)}</div>
  ${S.inc > 0 ? `<div class="card rule"><div class="ch"><div><h2>⚖️ ${t('rule_t')}</h2><p>${t('rule_s')}</p></div></div>
   ${[['z', 50, 'needs'], ['h', 30, 'wants'], ['j', 20, 'savings_g']].map(([g, target, l]) => { const v = g === 'j' ? Math.max(0, S.inc - S.exp + S.byGroup.j) : S.byGroup[g]; const p = Math.round(v / S.inc * 100); const good = g === 'j' ? p >= target : p <= target;
      return `<div class="r"><span>${t(l)}</span><div class="bar"><i style="width:${Math.min(100, p)}%;--c:${good ? 'var(--good)' : 'var(--warn)'}"></i></div><b class="num">${p}% <span class="muted small">/${target}</span></b></div>`; }).join('')}</div>` : ''}
  ${Object.keys(S.byInc).length ? `<div class="card"><div class="ch"><h2>💼 ${t('inc_src')}</h2></div>${Object.entries(S.byInc).sort((a, b) => b[1] - a[1]).map(([id, v]) => { const c = catById(id); return `<div class="row"><div class="ico sm" style="--c:var(--good)">${c ? c.e : '❓'}</div><div class="tx"><b>${esc(catName(c))}</b></div><div class="pct num pos">${fmt(v)}<small>${Math.round(v / S.inc * 100)}%</small></div></div>`; }).join('')}</div>` : ''}
  ${mem.length > 1 && !UI.who && S.exp ? `<div class="card"><div class="ch"><h2>👥 ${t('by_who')}</h2></div>${Object.entries(S.byWho).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="row"><div class="ico sm">👤</div><div class="tx"><b>${esc(k)}</b><div class="bar" style="margin-top:5px"><i style="width:${v / S.exp * 100}%"></i></div></div><div class="pct num">${fmt(v)}<small>${Math.round(v / S.exp * 100)}%</small></div></div>`).join('')}</div>` : ''}
  <button class="btn alt w" data-act="xlexp">📊 ${t('xl_period')}</button>`;
}
function barChart(r, who) {
  let buckets = [];
  if (r.per === 'week' || r.per === 'month') for (let d = new Date(r.a); d < r.b; d = addDays(d, 1)) buckets.push({ a: new Date(d), b: addDays(d, 1), l: r.per === 'week' ? I18N[L()].wd[(d.getDay() + 6) % 7] : String(d.getDate()) });
  else for (let d = new Date(r.a); d < r.b; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) buckets.push({ a: new Date(d), b: new Date(d.getFullYear(), d.getMonth() + 1, 1), l: monName(d.getMonth()).slice(0, 3) });
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
  return `<div class="tip"><span>💡</span><div>${t('bud_tip')}</div></div>
  ${withL.length ? `<div class="card"><div class="ch"><div><h2>${t('bud_month', { m: monthRange(0).label })}</h2><p>${fmt(spent)} / ${fmt(tot)}</p></div></div>
   ${withL.map(c => { const s = catSpentMonth(c.id), p = s / c.limit * 100, col = p >= 100 ? 'var(--bad)' : p >= 80 ? 'var(--warn)' : 'var(--good)';
     return `<div class="row" data-limit="${c.id}" style="cursor:pointer"><div class="ico sm" style="--c:${catColor(c)}">${c.e}</div><div class="tx"><b>${esc(catName(c))}</b><div class="bar" style="margin:6px 0 3px"><i style="width:${Math.min(100, p)}%;--c:${col}"></i></div><small>${fmt(s)} / ${fmt(c.limit)} · ${p >= 100 ? `<span class="neg">${t('over_by', { s: fmt(s - c.limit) })}</span>` : t('left_s', { s: fmt(c.limit - s) })}</small></div><b class="num" style="color:${col}">${Math.round(p)}%</b></div>`; }).join('')}</div>` : ''}
  <div class="card"><div class="ch"><h2>${t('bud_set')}</h2></div>${noL.map(c => `<div class="row" data-limit="${c.id}" style="cursor:pointer"><div class="ico sm" style="--c:${catColor(c)}">${c.e}</div><div class="tx"><b>${esc(catName(c))}</b><small>${t('this_month')}: ${fmt(catSpentMonth(c.id))}</small></div><span class="lnk">+ ${t('limit')}</span></div>`).join('') || `<div class="small muted">${t('bud_all')}</div>`}</div>`;
}
const goalSaved = g => live(DB.tx).filter(x => x.g === g.id).reduce((s, x) => s + txUZS(x), 0) + (+g.boshi || 0);
function planGoals() {
  const gs = live(DB.goals);
  return `${gs.map(g => { const s = goalSaved(g), p = Math.min(100, s / g.maqsad * 100); let per = '';
      if (g.muddat && s < g.maqsad) { const m = Math.max(1, Math.round((pd(g.muddat) - today()) / (864e5 * 30.4))); per = t('goal_per', { s: fmt((g.maqsad - s) / m), m }); }
      return `<div class="card"><div class="ch"><h2>${g.e} ${esc(g.nom)}</h2><button class="ib pl" data-goaledit="${g.id}">${ic('edit')}</button></div>
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
function pageSettings() {
  const s = DB.settings;
  return `
  <div class="card"><div class="ch"><h2>👤 ${t('profile')}</h2></div>
   <div class="fld"><label>${t('ob_name')}</label><input id="setName" value="${esc(s.ism)}" maxlength="30"></div>
   <div class="small muted" style="margin-top:6px">${t('name_hint')}</div></div>
  <div class="card"><div class="ch"><h2>🎨 ${t('look')}</h2></div>
   <div style="display:grid;gap:12px"><div class="seg full">${LANGS.map(([k, n]) => `<button class="${L() === k ? 'on' : ''}" data-lang="${k}">${n}</button>`).join('')}</div>
   <div class="seg full">${[['light', 'sun', 'th_l'], ['dark', 'moon', 'th_d'], ['auto', 'gear', 'th_a']].map(([k, i, l]) => `<button class="${s.mavzu === k ? 'on' : ''}" data-thm="${k}">${t(l)}</button>`).join('')}</div>
   <div class="sws">${COLORS.map(([k, a, b]) => `<button class="swc ${s.rang === k ? 'on' : ''}" data-color="${k}" style="--x1:${a};--x2:${b}"></button>`).join('')}</div></div></div>
  <div class="card"><div class="ch"><h2>💲 ${t('currency')}</h2></div>
   <div class="fld"><label>${t('rate')}</label><input id="setRate" inputmode="decimal" value="${sp(s.kurs)}"></div></div>
  <div class="card"><div class="ch"><h2>👛 ${t('wallets')}</h2><button class="lnk" data-act="walnew">+ ${t('add_s')}</button></div>
   ${live(DB.wallets).map(w => `<div class="row" data-wal="${w.id}" style="cursor:pointer"><div class="ico sm">${w.e}</div><div class="tx"><b>${esc(walName(w))}</b><small>${w.cur}</small></div><b class="num">${fmt(balance(w), w.cur)}</b></div>`).join('')}
   ${live(DB.wallets).length > 1 ? `<button class="btn sm alt w" style="margin-top:8px" data-act="transfer">${ic('swap')}${t('transfer')}</button>` : ''}</div>
  <div class="card"><div class="ch"><h2>🏷️ ${t('categories')}</h2><button class="lnk" data-act="catnew">+ ${t('add_s')}</button></div>
   ${['x', 'd'].map(tp => `<div class="small muted" style="margin:6px 0">${t(tp === 'x' ? 'expenses' : 'incomes')}</div><div class="chips" style="flex-wrap:wrap">${live(DB.cats).filter(c => c.tur === tp).map(c => `<button class="chip" data-cat="${c.id}">${c.e} ${esc(catName(c))}</button>`).join('')}</div>`).join('')}</div>
  <div class="card"><div class="ch"><div><h2>👨‍👩‍👧 ${t('family')}</h2><p>${t('family_s')}</p></div></div>
   <div class="g2"><button class="btn sm" data-act="syncsend">${ic('share')}${t('sync_send')}</button><button class="btn sm alt" data-act="syncget">${ic('import')}${t('sync_get')}</button></div>
   <div class="small muted" style="margin-top:10px">${s.sync_oxirgi ? t('sync_last', { d: s.sync_oxirgi }) : t('sync_never')}${members().length ? ' · 👥 ' + members().map(esc).join(', ') : ''}</div>
   <details style="margin-top:10px"><summary class="lnk" style="cursor:pointer;padding:0">${t('how')}</summary><ol class="small muted" style="padding-left:18px;margin:8px 0 0;line-height:1.6">${t('sync_how')}</ol></details></div>
  ${Platform.notify.available ? `<div class="card"><div class="ch"><h2>🔔 ${t('notif')}</h2><button class="lnk" data-act="ntest">${t('test')}</button></div>
   <div class="row"><div class="tx"><b>${t('n_daily')}</b><small>${t('n_daily_s')}</small></div>${sw('eslat', s.eslat)}</div>
   <div class="row"><div class="tx"><b>${t('n_time')}</b></div><div class="fld" style="width:120px"><input type="time" id="ntime" value="${esc(s.eslat_vaqt)}"></div></div>
   <div class="small muted">${t('n_auto')}</div></div>` : ''}
  ${tgCard()}
  <div class="card"><div class="ch"><h2>🔒 ${t('security')}</h2></div>
   <div class="row"><div class="tx"><b>${t('pin')}</b><small>${s.pin ? t('pin_on') : t('pin_off')}</small></div><button class="btn sm ${s.pin ? 'alt' : ''}" data-act="${s.pin ? 'pinoff' : 'pinset'}">${s.pin ? t('turn_off') : t('turn_on')}</button></div></div>
  <div class="card"><div class="ch"><h2>💾 ${t('data')}</h2></div>
   <div class="row"><div class="tx"><b>📊 ${t('xl_all')}</b><small>${t('xl_all_s')}</small></div><button class="btn sm alt" data-act="xlall">${ic('export')}</button></div>
   <div class="row"><div class="tx"><b>🗄️ ${t('backup')}</b><small>${t('backup_s')}</small></div><button class="btn sm alt" data-act="syncsend">${ic('export')}</button></div>
   <div class="row"><div class="tx"><b class="neg">🗑️ ${t('wipe')}</b><small>${t('wipe_s')}</small></div><button class="btn sm dng" data-act="wipe">${ic('trash')}</button></div></div>
  <div class="small muted" style="text-align:center;padding:4px 0 10px">${t('app')} · v1.0</div>`;
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
function openTx(id, preset) {
  const x = id ? DB.tx.find(z => z.id === id) : null;
  const mine = live(DB.wallets).filter(w => !w.egasi || w.egasi === DB.settings.ism);
  const lastW = (live(DB.tx).filter(x => x.kim === me() && walById(x.w) && !walById(x.w).d).slice(-1)[0] || {}).w || (mine[0] || live(DB.wallets)[0] || {}).id;
  M = x ? { ...x, amt: String(x.s), amt2: x.s2 != null ? String(x.s2) : '' } : { id: null, tur: 'x', amt: '', c: '', w: lastW, w2: '', dt: ymd(today()), n: '', kim: me(), amt2: '', ...(preset || {}) };
  drawTx();
  setTimeout(() => { const a = $('#amt'); if (a && !x) a.focus(); }, 80);
}
function readTx() { if (!$('#amt')) return; M.amt = $('#amt').value; M.dt = $('#txdt').value; M.n = $('#txn').value; if ($('#amt2')) M.amt2 = $('#amt2').value; }
function drawTx() {
  const m = M, w = walById(m.w), w2 = walById(m.w2), cats = live(DB.cats).filter(c => c.tur === m.tur);
  const recent = [...new Set(live(DB.tx).filter(x => x.tur === m.tur).slice(-40).reverse().map(x => x.c))];
  cats.sort((a, b) => { const ia = recent.indexOf(a.id), ib = recent.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  const cross = m.tur === 'o' && w && w2 && w.cur !== w2.cur;
  modal(`${mhead(m.id ? t('edit_tx') : t('new_tx'))}<div class="mb">
   <div class="seg full">${[['x', 'expense'], ['d', 'income'], ['o', 'transfer']].map(([k, l]) => `<button class="${m.tur === k ? 'on' : ''}" data-tur="${k}">${t(l)}</button>`).join('')}</div>
   <div class="amt ${m.tur}"><input id="amt" inputmode="decimal" placeholder="0" value="${esc(fmtInput(m.amt))}" autocomplete="off"><span>${w && w.cur === 'USD' ? '$' : t('sum')}</span></div>
   ${m.tur !== 'o' ? `<div class="cg">${cats.map(c => `<button class="${m.c === c.id ? 'on' : ''}" data-pickc="${c.id}"><span>${c.e}</span>${esc(catName(c))}</button>`).join('')}<button data-act="catnew"><span>➕</span>${t('new_cat')}</button></div>` : ''}
   <div><div class="small muted" style="margin-bottom:6px">${m.tur === 'o' ? t('from') : t('wallet')}</div><div class="chips">${live(DB.wallets).map(z => `<button class="chip ${m.w === z.id ? 'on' : ''}" data-pickw="${z.id}">${z.e} ${esc(walName(z))}</button>`).join('')}</div></div>
   ${m.tur === 'o' ? `<div><div class="small muted" style="margin-bottom:6px">${t('to')}</div><div class="chips">${live(DB.wallets).filter(z => z.id !== m.w).map(z => `<button class="chip ${m.w2 === z.id ? 'on' : ''}" data-pickw2="${z.id}">${z.e} ${esc(walName(z))}</button>`).join('')}</div></div>
     ${cross ? `<div class="fld"><label>${t('amt_received', { c: w2.cur === 'USD' ? '$' : t('sum') })}</label><input id="amt2" inputmode="decimal" value="${esc(fmtInput(m.amt2))}" placeholder="${esc(fmtInput(String(autoConv(m))))}"></div>` : ''}` : ''}
   <div class="g2"><div class="fld"><label>${t('date')}</label><input type="date" id="txdt" value="${m.dt}"></div><div class="fld"><label>${t('note')}</label><input id="txn" value="${esc(m.n)}" placeholder="${t('note_ph')}" maxlength="80"></div></div>
   ${m.id && m.kim ? `<div class="small muted">👤 ${esc(m.kim)}</div>` : ''}
  </div><div class="mf">${m.id ? `<button class="btn dng" data-del="tx:${m.id}" style="flex:0 0 auto">${ic('trash')}</button>` : ''}<button class="btn" data-act="savetx">${ic('check')}${t('save')}</button></div>`);
}
const fmtInput = s => { s = String(s || '').replace(/\s/g, ''); const [i, f] = s.split(/[.,]/); return (i || '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f !== undefined ? '.' + f : ''); };
function autoConv(m) { const w = walById(m.w), w2 = walById(m.w2), a = parseAmt(m.amt); if (!w || !w2 || !rate()) return a; if (w.cur === 'UZS' && w2.cur === 'USD') return Math.round(a / rate() * 100) / 100; if (w.cur === 'USD' && w2.cur === 'UZS') return Math.round(a * rate()); return a; }
async function saveTx() {
  readTx(); const m = M, s = parseAmt(m.amt);
  if (!(s > 0)) { $('#amt').classList.add('err'); toast(t('e_amt'), 'bd'); return; }
  if (m.tur !== 'o' && !m.c) { toast(t('e_cat'), 'bd'); return; }
  if (!m.w || (m.tur === 'o' && (!m.w2 || m.w2 === m.w))) { toast(t('e_wal'), 'bd'); return; }
  const rec = { id: m.id || uid(), tur: m.tur, s, w: m.w, dt: m.dt || ymd(today()), n: (m.n || '').trim(), kim: m.kim || me() };
  if (m.tur !== 'o') rec.c = m.c; else { rec.w2 = m.w2; const w = walById(m.w), w2 = walById(m.w2); if (w.cur !== w2.cur) rec.s2 = parseAmt(m.amt2) || autoConv(m); }
  if (m.g) rec.g = m.g; if (m.r) rec.r = m.r;
  upsert('tx', rec); await persist(); closeModal(); render();
  if (rec.tur === 'x') { const c = catById(rec.c); if (c && c.limit > 0) { const p = catSpentMonth(c.id) / c.limit * 100; if (p >= 100) return toast(t('al_over', { c: catName(c), p: Math.round(p) }), 'bd'); if (p >= 80) return toast(t('al_near', { c: catName(c), p: Math.round(p) }), 'wn'); } }
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
const walOpts = sel => live(DB.wallets).map(w => `<option value="${w.id}" ${sel === w.id ? 'selected' : ''}>${w.e} ${esc(walName(w))}</option>`).join('');
const catOpts = (sel, tur = 'x') => live(DB.cats).filter(c => c.tur === tur).map(c => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${c.e} ${esc(catName(c))}</option>`).join('');

function openLimit(cid) {
  const c = catById(cid);
  formModal(`${c.e} ${esc(catName(c))}`, `<div class="small muted">${t('this_month')}: ${fmt(catSpentMonth(c.id))} · ${t('last_month')}: ${fmt(live(DB.tx).filter(x => x.tur === 'x' && x.c === cid && inR(x, monthRange(-1))).reduce((s, x) => s + txUZS(x), 0))}</div>
   <div class="fld"><label>${t('limit_month')}</label><input id="flim" inputmode="decimal" value="${c.limit ? esc(fmtInput(String(c.limit))) : ''}" placeholder="0"></div><div class="small muted">${t('limit_hint')}</div>`,
    async () => { c.limit = parseAmt(val('flim')); upsert('cats', c); await persist(); closeModal(); render(); toast(t('saved')); });
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
function openGoalAdd(id) {
  const g = DB.goals.find(x => x.id === id);
  const sav = live(DB.cats).find(c => c.k === 'savings' && c.tur === 'x') || live(DB.cats).find(c => c.g === 'j');
  openTx(null, { tur: 'x', c: sav ? sav.id : '', g: id, n: g.nom });
}
function openDebt(id) {
  const x = id ? DB.debts.find(z => z.id === id) : { id: null, tur: 'berdim', kim: '', s: 0, cur: 'UZS', dt: ymd(today()), muddat: '', n: '', qaytdi: [] };
  const left = id ? debtLeft(x) : 0;
  formModal(id ? esc(x.kim) : t('debt_new'), `
   <div class="seg full">${['berdim', 'oldim'].map(k => `<button class="${x.tur === k ? 'on' : ''}" data-dtur="${k}">${t('d_' + k)}</button>`).join('')}</div><input type="hidden" id="ft" value="${x.tur}">
   <div class="fld"><label>${t('debt_who')}</label><input id="fk" value="${esc(x.kim)}" placeholder="${t('debt_who_ph')}"></div>
   <div class="g2"><div class="fld"><label>${t('amount')}</label><input id="fs" inputmode="decimal" value="${x.s ? esc(fmtInput(String(x.s))) : ''}"></div><div class="fld"><label>${t('currency')}</label><select id="fc"><option ${x.cur === 'UZS' ? 'selected' : ''} value="UZS">${t('sum')}</option><option ${x.cur === 'USD' ? 'selected' : ''} value="USD">$</option></select></div></div>
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
function openRec(id) {
  const r = id ? DB.rec.find(z => z.id === id) : { id: null, nom: '', s: 0, c: (live(DB.cats).find(c => c.k === 'utility') || {}).id, w: (live(DB.wallets)[0] || {}).id, kun: today().getDate(), faol: true, paid: [] };
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
   <div class="g2"><div class="fld"><label>${t('currency')}</label><select id="fc" ${id ? 'disabled' : ''}><option value="UZS" ${w.cur === 'UZS' ? 'selected' : ''}>${t('sum')}</option><option value="USD" ${w.cur === 'USD' ? 'selected' : ''}>$</option></select></div>
   <div class="fld"><label>${t('start_bal')}</label><input id="fs" inputmode="decimal" value="${esc(fmtInput(String(w.start || '')))}" placeholder="0"></div></div>${emojiPicker(w.e)}`,
    async () => { const nom = val('fn').trim(); if (!nom) return toast(t('e_fill'), 'bd'); const rec = { ...w, id: w.id || uid(), e: val('fe') || '👛', cur: id ? w.cur : val('fc'), start: parseAmt(val('fs')), egasi: w.egasi || me() };
      if (!w.k || nom !== t('w_' + w.k)) rec.nom = nom; upsert('wallets', rec); await persist(); closeModal(); render(); toast(t('saved')); },
    id && live(DB.wallets).length > 1 ? 'wallets:' + id : null);
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
const COLS = ['wallets', 'cats', 'tx', 'rec', 'debts', 'goals'];
function merge(other) {
  let n = 0;
  for (const col of COLS) {
    const map = new Map(DB[col].map(x => [x.id, x]));
    for (const r of other[col] || []) { const cur = map.get(r.id); if (!cur || (r.u || 0) > (cur.u || 0)) { map.set(r.id, r); n++; } }
    DB[col] = [...map.values()];
  }
  return n;
}
async function syncSend() {
  const data = { format: 'oila-byudjeti', v: 1, kim: me(), at: new Date().toISOString() };
  COLS.forEach(c => data[c] = DB[c]);
  const ok = await Platform.saveFile(`oila_byudjeti_${me().replace(/[^\p{L}\p{N}]+/gu, '_')}_${ymd(today())}.json`, 'application/json', JSON.stringify(data), t('app'));
  if (ok) { DB.settings.sync_oxirgi = `${fmtDay(today())}`; await persist(); render(); }
}
async function syncGet() {
  const f = await Platform.pickFile('.json,application/json'); if (!f) return;
  try { const d = JSON.parse(await f.text()); if (d.format !== 'oila-byudjeti') throw 0;
    const n = merge(d); DB.settings.sync_oxirgi = fmtDay(today()); await persist(); render(); toast(t('sync_ok', { n, k: d.kim || '?' }));
  } catch (_) { toast(t('bad_file'), 'bd'); }
}

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
  const A = allowance(); if (A.inc > 0) lines.push('', `📅 ${h(t('allow_t'))}: <b>${A.avail < 0 ? h(t('allow_over')) : fmt(A.perDay)}</b>`);
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
  Platform.notify.replace(list.sort((a, b) => a.at - b.at));
}

/* =================== PIN =================== */
let PIN = { buf: '', mode: '', first: '' };
function showLock(mode) {
  PIN = { buf: '', mode, first: '' };
  drawLock();
}
function drawLock(shake) {
  const title = PIN.mode === 'unlock' ? t('pin_enter') : PIN.first ? t('pin_repeat') : t('pin_new');
  $('#lock').innerHTML = `<div class="lock"><div class="mk">💰</div><h2>${title}</h2><div class="dots ${shake ? 'shake' : ''}">${[0, 1, 2, 3].map(i => `<i class="${i < PIN.buf.length ? 'f' : ''}"></i>`).join('')}</div>
   <div class="kpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button class="e" data-k="x">${PIN.mode === 'unlock' ? t('pin_forgot') : t('cancel')}</button><button data-k="0">0</button><button class="e" data-k="b">⌫</button></div></div>`;
}
async function pinKey(k) {
  if (k === 'b') { PIN.buf = PIN.buf.slice(0, -1); return drawLock(); }
  if (k === 'x') { if (PIN.mode === 'unlock') { if (confirm(t('pin_forgot_q'))) { DB = newDB(); await Platform.save(DB); $('#lock').innerHTML = ''; render(); } return; } $('#lock').innerHTML = ''; return; }
  if (PIN.buf.length >= 4) return;
  PIN.buf += k; drawLock();
  if (PIN.buf.length < 4) return;
  const h = await Platform.sha256('ob:' + PIN.buf);
  if (PIN.mode === 'unlock') { if (h === DB.settings.pin) { $('#lock').innerHTML = ''; afterUnlock(); } else { PIN.buf = ''; setTimeout(() => drawLock(true), 150); } return; }
  if (!PIN.first) { PIN.first = h; PIN.buf = ''; return setTimeout(drawLock, 150); }
  if (PIN.first === h) { DB.settings.pin = h; await persist(); $('#lock').innerHTML = ''; render(); toast(t('pin_set_ok')); }
  else { PIN.first = ''; PIN.buf = ''; toast(t('pin_mismatch'), 'bd'); setTimeout(() => drawLock(true), 150); }
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
  if ((x = c('[data-lang]'))) { if (M && $('#amt')) readTx(); DB.settings.til = x.dataset.lang; await persist(); applyTheme(); if (!DB.settings.ism) return onboarding(); render(); if (M && $('#modal').innerHTML && M.amt !== undefined) drawTx(); return; }
  if ((x = c('[data-pg]'))) { UI.page = x.dataset.pg; render(); $('#main') && ($('#main').scrollTop = 0); return; }
  if ((x = c('[data-per]'))) { UI.per = x.dataset.per; UI.off = 0; return render(); }
  if ((x = c('[data-off]'))) { UI.off = Math.min(0, UI.off + +x.dataset.off); return render(); }
  if ((x = c('[data-hoff]'))) { UI.homeOff = Math.min(0, UI.homeOff + +x.dataset.hoff); return render(); }
  if ((x = c('[data-ttype]'))) { UI.txType = x.dataset.ttype; return render(); }
  if ((x = c('[data-whochip]'))) { UI.who = x.dataset.whochip; return render(); }
  if ((x = c('[data-plan]'))) { UI.plan = x.dataset.plan; return render(); }
  if ((x = c('[data-thm]'))) { DB.settings.mavzu = x.dataset.thm; await persist(); applyTheme(); return render(); }
  if ((x = c('[data-color]'))) { DB.settings.rang = x.dataset.color; await persist(); applyTheme(); return render(); }
  if ((x = c('[data-sw]'))) { const k = x.dataset.sw; DB.settings[k] = !DB.settings[k]; await persist(); return render(); }
  if ((x = c('[data-fsw]'))) { x.classList.toggle('on'); $('#ff').value = x.classList.contains('on') ? 1 : 0; return; }
  /* amal formasi */
  if ((x = c('[data-tur]'))) { readTx(); M.tur = x.dataset.tur; M.c = ''; return drawTx(); }
  if ((x = c('[data-pickc]'))) { readTx(); M.c = x.dataset.pickc; return drawTx(); }
  if ((x = c('[data-pickw]'))) { readTx(); M.w = x.dataset.pickw; if (M.w2 === M.w) M.w2 = ''; return drawTx(); }
  if ((x = c('[data-pickw2]'))) { readTx(); M.w2 = x.dataset.pickw2; return drawTx(); }
  if ((x = c('[data-edit]'))) { const tx = DB.tx.find(z => z.id === x.dataset.edit); if (tx) openTx(tx.id); return; }
  if ((x = c('[data-emoji]'))) { $('#' + x.dataset.for).value = x.dataset.emoji; x.parentElement.querySelectorAll('.on').forEach(b => b.classList.remove('on')); x.classList.add('on'); return; }
  if ((x = c('[data-dtur]'))) { $('#ft').value = x.dataset.dtur; x.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === x)); return; }
  if ((x = c('[data-ctur]'))) { $('#ft').value = x.dataset.ctur; x.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === x)); $('#fgw').hidden = x.dataset.ctur === 'd'; return; }
  if ((x = c('[data-limit]'))) return openLimit(x.dataset.limit);
  if ((x = c('[data-goaledit]'))) return openGoal(x.dataset.goaledit);
  if ((x = c('[data-goaladd]'))) return openGoalAdd(x.dataset.goaladd);
  if ((x = c('[data-debt]'))) return openDebt(x.dataset.debt);
  if ((x = c('[data-recedit]'))) return openRec(x.dataset.recedit);
  if ((x = c('[data-recpay]'))) return payRec(x.dataset.recpay);
  if ((x = c('[data-wal]'))) return openWallet(x.dataset.wal);
  if ((x = c('[data-cat]'))) return openCat(x.dataset.cat);
  if ((x = c('[data-del]'))) { const [col, id] = x.dataset.del.split(':'); if (!confirm(t('del_q'))) return; remove(col, id); await persist(); closeModal(); render(); return toast(t('deleted')); }
  if ((x = c('[data-act]'))) {
    const a = x.dataset.act;
    if (a === 'add') return openTx(null);
    if (a === 'transfer') return openTx(null, { tur: 'o' });
    if (a === 'theme') { const cur = document.documentElement.dataset.theme; DB.settings.mavzu = cur === 'dark' ? 'light' : 'dark'; await persist(); applyTheme(); return render(); }
    if (a === 'savetx') return saveTx();
    if (a === 'formsave') return FORM && FORM();
    if (a === 'catnew') { if (M && $('#amt')) { readTx(); return openCat(null, M.tur === 'd' ? 'd' : 'x'); } return openCat(null); }
    if (a === 'walnew') return openWallet(null);
    if (a === 'goalnew') return openGoal(null);
    if (a === 'debtnew') return openDebt(null);
    if (a === 'recnew') return openRec(null);
    if (a === 'debtret') { const d = M.debt, v = parseAmt(val('fr')) || debtLeft(d); d.qaytdi = [...(d.qaytdi || []), { dt: ymd(today()), s: Math.min(v, debtLeft(d)) }]; d.yopiq = debtLeft(d) <= 0; upsert('debts', d); await persist(); closeModal(); render(); return toast(d.yopiq ? t('debt_closed') : t('saved')); }
    if (a === 'obdone') { const n = ($('#obName').value || '').trim(); if (!n) { $('#obName').classList.add('err'); return $('#obName').focus(); }
      DB.settings.ism = n; DB.settings.kurs = parseAmt($('#obRate').value) || DB.settings.kurs;
      document.querySelectorAll('[data-ob]').forEach(i => { const w = walById(i.dataset.ob); if (w) { w.start = parseAmt(i.value); w.egasi = n; touch(w); } });
      await persist(); return render(); }
    if (a === 'syncsend') return syncSend();
    if (a === 'syncget') return syncGet();
    if (a === 'xlexp') return excelExport(range(UI.per, UI.off));
    if (a === 'xlall') return excelExport(null);
    if (a === 'pinset') return showLock('set');
    if (a === 'pinoff') { DB.settings.pin = ''; await persist(); render(); return toast(t('pin_off_ok')); }
    if (a === 'wipe') { if (confirm(t('wipe_q'))) { DB = newDB(); await Platform.save(DB); UI.page = 'home'; render(); } return; }
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
  if (el.id === 'setName' && el.value.trim()) { DB.settings.ism = el.value.trim(); await persist(); return toast(t('saved')); }
  if (el.id === 'setRate') { const v = parseAmt(el.value); if (v > 0) { DB.settings.kurs = v; await persist(); render(); toast(t('saved')); } return; }
  if (el.id === 'ntime' && el.value) { DB.settings.eslat_vaqt = el.value; await persist(); return toast(t('saved')); }
  if (el.id === 'txdt' || el.id === 'txn') return;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').innerHTML) closeModal(); if (e.key === 'Enter' && e.target.id === 'amt') saveTx(); });

/* =================== Işga tuşiriş =================== */
function afterUnlock() { render(); scheduleNotifications(); setTimeout(tgWeekly, 1500); }
async function boot() {
  DB = await Platform.load();
  if (!DB || !DB.settings) DB = newDB();
  const def = newDB(); DB.settings = { ...def.settings, ...DB.settings }; COLS.forEach(c => DB[c] = DB[c] || []);
  applyTheme();
  if (DB.settings.pin) { render(); showLock('unlock'); } else afterUnlock();
  if (!Platform.native && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  setInterval(() => { const k = ymd(today()); if (k !== boot.day) { boot.day = k; render(); } }, 60000); boot.day = ymd(today());
}
window.addEventListener('load', boot);
