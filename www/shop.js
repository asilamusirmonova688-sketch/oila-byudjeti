/* =================== 🧺 Bozor röyxati =================== */
const BOOT_AT = Date.now();
const UNITS = ['kg', 'dona', 'l', 'bog', 'paket', 'quti'];
let SHOP = { sug: [], q: '' };
const shopLists = () => live(DB.lists || []);
const shopActive = () => shopLists().filter(l => !l.done).sort((a, b) => (b.u || 0) - (a.u || 0));
const shopPending = () => shopActive().reduce((s, l) => s + l.items.filter(i => !i.olindi).length, 0);
const itEst = i => (+i.miq || 0) * (+i.narx || 0);
const itReal = i => (+(i.fmiq ?? i.miq) || 0) * (+(i.fnarx ?? i.narx) || 0);
const lsEst = l => l.items.reduce((s, i) => s + itEst(i), 0);
const lsPlanBought = l => l.items.filter(i => i.olindi).reduce((s, i) => s + itEst(i), 0);
const lsPaid = l => +l.paid || lsReal(l);
const lsReal = l => l.items.filter(i => i.olindi).reduce((s, i) => s + itReal(i), 0);
const catIdByKey = k => (live(DB.cats).find(c => c.k === k && c.tur === 'x') || {}).id;
const foodCat = () => catIdByKey('food') || (live(DB.cats).find(c => c.tur === 'x') || {}).id;
const unitName = b => t('u_' + b);
const unitOf = (b, nom) => nom && isCyr(nom) && L() !== 'ru' ? (UNIT_CYR[b] || b) : unitName(b);
const qtyTxt = (q, b, nom) => `${String(+(+q).toFixed(3)).replace('.', ',')} ${unitOf(b, nom)}`;
const shopCats = () => live(DB.cats).filter(c => c.tur === 'x' && c.g !== 'j' && c.k !== 'credit');
const BASKET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5h19l-1.7 9.1a2 2 0 0 1-2 1.6H6.2a2 2 0 0 1-2-1.6z"/><path d="M7.5 9.5 11 3.5M16.5 9.5 13 3.5"/><path d="M9 13.5v3.5M12 13.5v3.5M15 13.5v3.5"/></svg>';

/* qidiruvda: ö→o, ş→sh, ç→ch, ğ→g, apostroflar olib taşlanadi */
/* kirill ↔ lotin */
const isCyr = v => /[а-яёўғқҳ]/i.test(String(v));
const C2L = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h' };
const cyr2lat = v => String(v).toLowerCase().replace(/[а-яёўғқҳ]/g, ch => C2L[ch] ?? ch);
function lat2cyr(v) {
  let s = String(v).replace(/[ʼ‘’`]/g, "'"), out = '';
  const M = [['sh', 'ш'], ['ş', 'ш'], ['ch', 'ч'], ['ç', 'ч'], ["o'", 'ў'], ['ö', 'ў'], ["g'", 'ғ'], ['ğ', 'ғ'], ['yo', 'ё'], ['yu', 'ю'], ['ya', 'я'], ['ye', 'е'], ['ts', 'ц'],
    ['a', 'а'], ['b', 'б'], ['d', 'д'], ['e', 'е'], ['f', 'ф'], ['g', 'г'], ['h', 'ҳ'], ['i', 'и'], ['j', 'ж'], ['k', 'к'], ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'], ['q', 'қ'], ['r', 'р'], ['s', 'с'], ['t', 'т'], ['u', 'у'], ['v', 'в'], ['x', 'х'], ['y', 'й'], ['z', 'з'], ['c', 'с'], ["'", 'ъ']];
  for (let i = 0; i < s.length;) {
    let hit = null; const low = s.slice(i, i + 2).toLowerCase();
    for (const [a, b] of M) if (low.startsWith(a)) { hit = [a, b]; break; }
    if (!hit) { out += s[i]; i++; continue; }
    let ch = hit[1]; const start = i === 0 || /[\s(-]/.test(s[i - 1]);
    if (hit[0] === 'e' && start) ch = 'э';
    if (s[i] !== s[i].toLowerCase()) ch = ch.toUpperCase();
    out += ch; i += hit[0].length;
  }
  return out;
}
const UNIT_CYR = { kg: 'кг', dona: 'дона', l: 'литр', bog: 'боғ', paket: 'пакет', quti: 'қути' };
const normP = v => cyr2lat(v).replace(/ö/g, 'o').replace(/ğ/g, 'g').replace(/ş/g, 'sh').replace(/ç/g, 'ch').replace(/[ʼ'‘’`]/g, '');
function shopMem() { return DB.settings.bozor || (DB.settings.bozor = {}); }
function remember(i, cid) {
  const m = shopMem(), k = i.nom.trim().toLowerCase(); if (!k) return;
  m[k] = { n: i.nom.trim(), b: i.b, p: +(i.fnarx ?? i.narx) || (m[k] || {}).p || 0, c: cid || i.c || '', u: now() };
}
function prodSuggest(q) {
  const cyr = isCyr(q); q = normP(q.trim()); if (!q) return [];
  const li = { uz: 0, ru: 1, en: 2 }[L()] ?? 0, out = [], seen = new Set(), m = shopMem();
  const dn = p => cyr && L() !== 'ru' ? lat2cyr(p[0]) : p[li];
  const add = (n, b, p, ck, cid, own) => { const k = n.toLowerCase(); if (seen.has(k)) return; seen.add(k); out.push({ n, b, p, ck, cid, own }); };
  const loose = v => v.replace(/q/g, 'k').replace(/h/g, 'x').replace(/o/g, 'u'), lq = loose(q);
  const sc = (n, qq) => n.startsWith(qq) ? 0 : n.split(/[\s(]+/).some(w => w.startsWith(qq)) ? 1 : n.includes(qq) ? 2 : 9;
  const score = n => { n = normP(n); const a = sc(n, q); return a < 9 ? a : Math.min(9, sc(loose(n), lq) + 0.7); };
  const own = Object.values(m).map(x => [score(x.n), x]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0] || (b[1].u || 0) - (a[1].u || 0));
  own.forEach(([, x]) => add(x.n, x.b, x.p, '', x.c, true));
  const base = PRODUCTS.map(p => [Math.min(score(p[li]), score(p[0]) + 0.5, score(p[1]) + 0.5, score(p[2]) + 0.5), p]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0]);
  base.forEach(([, p]) => { const n = dn(p), mm = m[n.toLowerCase()] || m[p[li].toLowerCase()]; add(n, mm ? mm.b : p[3], mm ? mm.p : 0, p[4], mm ? mm.c : '', false); });
  const good = out.filter(o => score(o.n) < 2);
  return (good.length >= 3 ? good : [...good, ...out.filter(o => score(o.n) >= 2).slice(0, 2)]).slice(0, 8);
}

/* ---------- Boş sahifadagi karta va tepadagi savatça ---------- */
function shopHeaderBtn() {
  const n = shopPending();
  const pulse = DB.settings.bsk_pulse && Date.now() - BOOT_AT < 5000 && (n > 0 || !shopLists().length);
  if (pulse) setTimeout(() => document.querySelectorAll('.pulse').forEach(e => e.classList.remove('pulse')), Math.max(0, 5000 - (Date.now() - BOOT_AT)));
  return `<button class="ib bsk ${pulse ? 'pulse' : ''}" data-act="shop" aria-label="${t('pg_shop')}">${BASKET}${n ? `<i class="bdg">${n}</i>` : ''}</button>`;
}
function shopCard() {
  const A = shopActive();
  if (!A.length) return `<div class="card shopc" data-act="shopnew" style="cursor:pointer"><div class="row"><div class="ico bskic">${BASKET}</div><div class="tx"><b>${t('shop_inv')}</b><small>${t('shop_inv_s')}</small></div><span class="muted">${ic('plus')}</span></div></div>`;
  const items = A.reduce((s, l) => s + l.items.length, 0), got = A.reduce((s, l) => s + l.items.filter(i => i.olindi).length, 0), est = A.reduce((s, l) => s + lsEst(l), 0);
  return `<div class="card shopc" data-act="shop" style="cursor:pointer"><div class="row"><div class="ico bskic">${BASKET}</div><div class="tx"><b>${t('pg_shop')}${A.length > 1 ? ` · ${A.length}` : ''}</b><small>${t('shop_sum', { n: items, s: money(est) })}</small>
    <div class="bar" style="margin-top:6px"><i style="width:${items ? got / items * 100 : 0}%;--c:var(--good)"></i></div></div><b class="num small">${got}/${items}</b><span class="muted">${ic('right')}</span></div></div>`;
}

/* ---------- Sahifa ---------- */
function pageShop() {
  const l = UI.shopList && shopLists().find(x => x.id === UI.shopList);
  if (l) return shopListView(l);
  UI.shopList = null;
  const A = shopActive(), H = shopLists().filter(x => x.done).sort((a, b) => (b.dt_done || '').localeCompare(a.dt_done || '') || b.u - a.u).slice(0, 12);
  return `${A.length ? A.map(l => { const n = l.items.length, g = l.items.filter(i => i.olindi).length;
      return `<div class="card shopl" data-shopen="${l.id}"><div class="row"><div class="ico" style="font-size:22px">${l.e}</div><div class="tx"><b>${esc(l.nom)}</b><small>${l.c ? esc(catName(catById(l.c))) : t('shop_general')} · ${t('shop_got', { g, n })}</small>
       <div class="bar" style="margin-top:6px"><i style="width:${n ? g / n * 100 : 0}%;--c:var(--good)"></i></div></div><div style="text-align:right"><b class="num">~${money(lsEst(l))}</b></div><span class="muted">${ic('right')}</span></div></div>`; }).join('')
    : `<div class="empty card"><div class="em bskbig">${BASKET}</div><b>${t('shop_empty')}</b>${t('shop_empty_s')}</div>`}
   <button class="btn w" data-act="shopnew">${ic('plus')}${t('shop_new')}</button>
   ${H.length ? `<div class="card"><div class="ch"><h2>${t('shop_hist')}</h2></div>${H.map(l => { const d = lsPaid(l) - lsPlanBought(l);
     return `<div class="row"><div class="ico sm">${l.e}</div><div class="tx"><b>${esc(l.nom)}</b><small>${l.dt_done ? fmtDay(pd(l.dt_done)) : ''} · ${money(lsPaid(l))}${lsPlanBought(l) ? ` · <span class="${d > 0 ? 'neg' : 'pos'}">${d > 0 ? '+' : ''}${money(d)}</span>` : ''}</small></div><button class="btn sm alt" data-shrep="${l.id}">🔁</button><button class="ib pl" data-shdel="${l.id}" aria-label="delete" style="color:var(--bad)">${ic('trash')}</button></div>`; }).join('')}
     <button class="btn sm alt w" data-act="shopclear" style="margin-top:10px;color:var(--bad)">${ic('trash')}${t('shop_clear')}</button></div>` : ''}`;
}

function shopLimitWarn(l) {
  const by = {}; l.items.filter(i => !i.olindi).forEach(i => { const c = i.c || l.c || foodCat(); by[c] = (by[c] || 0) + itEst(i); });
  const S = stats(monthRange(0)), out = [];
  for (const [cid, est] of Object.entries(by)) { const c = catById(cid); if (!c || !(c.limit > 0)) continue;
    const spent = S.byCat[cid] || 0, after = spent + est, p = after / c.limit * 100;
    if (after > c.limit) out.push(['var(--bad)', t('shop_lim_over', { c: catName(c), s: money(after - c.limit) })]);
    else if (p >= NEAR()) out.push(['var(--warn)', t('shop_lim_near', { c: catName(c), p: Math.round(p) })]); }
  return out.map(([col, m]) => `<div class="alert" style="--c:${col}"><span style="flex:1">⚠️ ${m}</span></div>`).join('');
}

function shopListView(l) {
  const todo = l.items.filter(i => !i.olindi), got = l.items.filter(i => i.olindi), n = l.items.length;
  const row = i => { const c = !l.c && i.c ? catById(i.c) : null, real = i.olindi;
    return `<div class="row shi ${real ? 'got' : ''}" data-shitem="${i.id}"><button class="chk ${real ? 'on' : ''}" data-shchk="${i.id}" aria-label="ok">${real ? ic('check') : ''}</button>
     <div class="tx"><b>${esc(i.nom)}</b><small>${real ? `${qtyTxt(i.fmiq ?? i.miq, i.b, i.nom)} × ${fmt(i.fnarx ?? i.narx)}` : `${qtyTxt(i.miq, i.b, i.nom)}${+i.narx ? ` × ~${fmt(i.narx)}` : ''}`}${c ? ` · ${c.e}` : ''}</small></div>
     <b class="num ${real ? '' : 'muted'}">${real ? fmt(itReal(i)) : +i.narx ? '~' + fmt(itEst(i)) : '—'}</b></div>`; };
  return `<div class="card" style="display:grid;gap:10px">
    <div style="display:flex;align-items:center;gap:10px"><div style="font-size:26px">${l.e}</div><div style="flex:1;min-width:0"><b style="font-size:17px">${esc(l.nom)}</b><div class="small muted">${l.c ? esc(catName(catById(l.c))) : t('shop_general')}</div></div>
     <button class="ib pl" data-act="shopshare" aria-label="share">${ic('share') || '📤'}</button><button class="ib pl" data-act="shopedit" aria-label="edit">${ic('edit')}</button><button class="ib pl" data-shdel="${l.id}" aria-label="delete" style="color:var(--bad)">${ic('trash')}</button></div>
    <div class="g2"><div class="kp"><small>${t('shop_plan')}</small><b class="num">~${money(lsEst(l))}</b><small>${t('shop_n', { n })}</small></div>
     <div class="kp"><small>${t('shop_got_t')}</small><b class="num pos">${money(lsReal(l))}</b><small>${t('shop_got', { g: got.length, n })}</small></div></div>
    <div class="bar" style="height:8px"><i style="width:${n ? got.length / n * 100 : 0}%;--c:var(--good)"></i></div>
    ${got.length ? `<button class="btn w" data-act="shopfinish">${ic('check')}${t('shop_finish')} · ${money(lsReal(l))}</button>` : ''}</div>
   ${shopLimitWarn(l)}
   ${(() => { const np = l.items.filter(i => !i.olindi && !(+i.narx)).length; return np ? `<div class="alert" style="--c:var(--muted)"><span style="flex:1">ℹ️ ${t('shop_noprice', { n: np })}</span></div>` : ''; })()}
   <div class="card" style="padding:12px"><div class="shadd"><input id="shq" placeholder="${t('shop_add_ph')}" autocomplete="off" value="${esc(SHOP.q)}"><button class="btn sm" data-act="shopadd">${ic('plus')}</button></div><div id="shsug" class="shsug"></div></div>
   ${todo.length ? `<div class="card"><div class="ch"><h2>${t('shop_todo')} · ${todo.length}</h2></div>${todo.map(row).join('')}</div>` : n ? `<div class="tip"><span>🎉</span><div>${t('shop_all')}</div></div>` : `<div class="empty"><div class="em bskbig">${BASKET}</div><b>${t('shop_noitems')}</b>${t('shop_noitems_s')}</div>`}
   ${got.length ? `<div class="card"><div class="ch"><h2>✓ ${t('shop_got_t')} · ${got.length}</h2></div>${got.map(row).join('')}<div class="small muted" style="margin-top:6px">${t('shop_tap_fix')}</div></div>` : ''}`;
}

function drawSug() {
  const box = $('#shsug'); if (!box) return;
  const q = ($('#shq') || {}).value || ''; SHOP.q = q; SHOP.sug = prodSuggest(q);
  if (!q.trim()) { box.innerHTML = ''; return; }
  const exact = SHOP.sug.some(s => s.n.toLowerCase() === q.trim().toLowerCase());
  box.innerHTML = SHOP.sug.map((s, k) => `<button data-shsug="${k}"><span>${s.own ? '🕘 ' : ''}${esc(s.n)}</span><small>${s.p ? `~${fmt(s.p)} / ${unitOf(s.b, s.n)}` : unitOf(s.b, s.n)}</small></button>`).join('')
    + (exact ? '' : `<button data-shsug="new"><span>${ic('plus')} «${esc(q.trim())}»</span><small>${t('shop_newprod')}</small></button>`);
}

/* ---------- Röyxat yaratiş / tahrirlaş ---------- */
function shopNew(id) {
  const l = id ? shopLists().find(x => x.id === id) : null, cur = l ? l.c : '';
  formModal(`${BASKET.replace('<svg', '<svg style="width:20px;height:20px;vertical-align:-4px"')} ${l ? t('shop_edit') : t('shop_new')}`, `
   <div><div class="small muted" style="margin-bottom:6px">${t('shop_type')}</div><input type="hidden" id="slc" value="${cur}">
    <div class="chips" style="flex-wrap:wrap"><button class="chip ${!cur ? 'on' : ''}" data-slc="">🧺 ${t('shop_general')}</button>${shopCats().map(c => `<button class="chip ${cur === c.id ? 'on' : ''}" data-slc="${c.id}">${c.e} ${esc(catName(c))}</button>`).join('')}</div></div>
   <div class="fld"><label>${t('shop_name')}</label><input id="sln" value="${l ? esc(l.nom) : ''}" placeholder="${t('shop_name_ph')}" maxlength="40"></div>`,
    async () => { const c = val('slc'), cat = c ? catById(c) : null, nom = val('sln').trim() || (cat ? catName(cat) : t('pg_shop'));
      const rec = l ? { ...l, nom, c, e: cat ? cat.e : '🧺' } : { id: uid(), nom, c, e: cat ? cat.e : '🧺', items: [], done: false, kim: me() };
      upsert('lists', rec); await persist(); closeModal(); UI.page = 'shop'; UI.shopList = rec.id; SHOP.q = ''; render(); if (!l) setTimeout(() => { const q = $('#shq'); if (q) q.focus(); }, 120); }, '');
}

function shopItem(lid, iid, pre) {
  const l = shopLists().find(x => x.id === lid); if (!l) return;
  const it = iid ? l.items.find(i => i.id === iid) : null, p = pre || {};
  const b = it ? it.b : p.b || 'dona', cid = it ? (it.c || '') : (p.cid || (p.ck ? catIdByKey(p.ck) : '') || '');
  const real = it && it.olindi;
  formModal(`${esc(it ? it.nom : p.n || t('shop_item'))}`, `
   <div class="fld"><label>${t('shop_prod')}</label><input id="sin" value="${esc(it ? it.nom : p.n || '')}" maxlength="40"></div>
   <div><div class="small muted" style="margin-bottom:6px">${t('shop_unit')}</div><input type="hidden" id="sib" value="${b}"><div class="chips" style="flex-wrap:wrap">${UNITS.map(u => `<button class="chip ${b === u ? 'on' : ''}" data-sib="${u}">${unitName(u)}</button>`).join('')}</div></div>
   <div class="g2"><div class="fld"><label>${t('shop_qty')}</label><input id="siq" inputmode="decimal" value="${it ? esc(String(it.miq).replace('.', ',')) : '1'}"></div>
    <div class="fld"><label id="sipl">${t('shop_price', { u: unitName(b) })}</label><input id="sip" inputmode="decimal" placeholder="0" value="${it ? (+it.narx ? esc(fmtInput(String(it.narx))) : '') : p.p ? esc(fmtInput(String(p.p))) : ''}"></div></div>
   ${real ? `<div class="kp" style="display:grid;gap:10px"><b>✓ ${t('shop_real')}</b><div class="g2"><div class="fld"><label>${t('shop_qty')}</label><input id="sfq" inputmode="decimal" value="${esc(String(it.fmiq ?? it.miq).replace('.', ','))}"></div>
    <div class="fld"><label>${t('shop_price', { u: unitName(b) })}</label><input id="sfp" inputmode="decimal" value="${esc(fmtInput(String(it.fnarx ?? it.narx ?? '')))}"></div></div></div>` : ''}
   ${!l.c ? `<div class="fld"><label>${t('category')}</label><select id="sic">${shopCats().map(c => `<option value="${c.id}" ${(cid || foodCat()) === c.id ? 'selected' : ''}>${c.e} ${esc(catName(c))}</option>`).join('')}</select></div>` : ''}
   <div class="kp" style="text-align:center"><small>${t('shop_line')}</small><b class="num" id="sit" style="font-size:20px">—</b></div>`,
    async () => { const nom = val('sin').trim(); if (!nom) { $('#sin').classList.add('err'); return toast(t('shop_e_name'), 'bd'); }
      const miq = parseAmt(val('siq')) || 1;
      const rec = { ...(it || { id: uid(), olindi: false }), nom, b: val('sib'), miq, narx: parseAmt(val('sip')), c: l.c ? '' : val('sic') };
      if (real) { rec.fmiq = parseAmt(val('sfq')) || miq; rec.fnarx = parseAmt(val('sfp')); }
      const L2 = { ...l, items: it ? l.items.map(i => i.id === it.id ? rec : i) : [...l.items, rec] };
      remember(rec, rec.c || l.c); upsert('lists', L2); await persist(); closeModal(); SHOP.q = ''; render();
      if (!it) setTimeout(() => { const q = $('#shq'); if (q) q.focus(); }, 80); toast(t('saved')); }, it ? `shopit:${l.id}:${it.id}` : '');
  shopLine();
}
function shopLine() {
  const e = $('#sit'); if (!e) return;
  const q = parseAmt(val('sfq') || val('siq')), pr = parseAmt(val('sfp') || val('sip'));
  e.textContent = q > 0 && pr > 0 ? money(q * pr) : '—';
}

/* ---------- Bozorda: belgilaş va yakunlaş ---------- */
async function shopCheck(lid, iid) {
  const l = shopLists().find(x => x.id === lid); if (!l) return;
  const items = l.items.map(i => i.id !== iid ? i : i.olindi ? { ...i, olindi: false, fmiq: undefined, fnarx: undefined } : { ...i, olindi: true, fmiq: i.miq, fnarx: i.narx });
  upsert('lists', { ...l, items }); await persist(); render(); Platform.vibrate(30);
  const now_ = items.find(i => i.id === iid);
  if (now_ && now_.olindi && !(+now_.narx)) return shopItem(lid, iid);
  if (now_ && now_.olindi && !DB.settings.shop_hint) { DB.settings.shop_hint = 1; await persist(); toast(t('shop_hint')); }
}

function shopFinish() {
  const l = shopLists().find(x => x.id === UI.shopList); if (!l) return;
  const got = l.items.filter(i => i.olindi), todo = l.items.filter(i => !i.olindi);
  if (!got.length) return toast(t('shop_none'), 'bd');
  const plan = lsPlanBought(l), real = lsReal(l), d = real - plan;
  const mine = W().filter(w => !w.egasi || w.egasi === DB.settings.ism), wsel = (mine.find(w => w.k === 'cash') || mine[0] || W()[0] || {}).id;
  const by = {}; got.forEach(i => { const c = i.c || l.c || foodCat(); by[c] = (by[c] || 0) + itReal(i); });
  SHOP.fin = { by, got, l, plan, real };
  formModal(`✓ ${t('shop_finish')}`, `
   <div class="g2"><div class="kp"><small>${t('shop_plan')}</small><b class="num">${money(plan)}</b></div><div class="kp"><small>${t('shop_spent')}</small><b class="num">${money(real)}</b></div></div>
   ${plan > 0 ? `<div class="tip"><span>📊</span><div id="sfdiff">${d > 0 ? t('shop_more', { s: money(d) }) : d < 0 ? t('shop_less', { s: money(-d) }) : t('shop_same')}</div></div>` : ''}
   ${got.some(i => !(+(i.fnarx ?? i.narx))) ? `<div class="alert" style="--c:var(--warn)"><span style="flex:1">⚠️ ${t('shop_fin_np', { n: got.filter(i => !(+(i.fnarx ?? i.narx))).length })}</span></div>` : ''}
   <div class="fld"><label>💵 ${t('shop_total_paid')}</label><input id="sft" inputmode="decimal" value="${real ? esc(fmtInput(String(Math.round(real)))) : ''}" placeholder="0"></div>
   <div class="small muted" style="margin-top:-6px">${t('shop_total_hint')}</div>
   <div class="kvs" id="sfby">${shopByHtml(shopSplit(by, got, l, real))}</div>
   <div><div class="small muted" style="margin-bottom:6px">${t('shop_paid_from')}</div><input type="hidden" id="gmw" value="${wsel}"><div class="chips" style="flex-wrap:wrap">${W().map(z => `<button class="chip ${wsel === z.id ? 'on' : ''}" data-gmw="${z.id}">${z.e} ${esc(walName(z))}</button>`).join('')}</div></div>
   <div class="fld"><label>${t('date')}</label><input type="date" id="sfd" value="${ymd(today())}"></div>
   ${todo.length ? `<div><div class="small muted" style="margin-bottom:6px">${t('shop_left_q', { n: todo.length })}</div><input type="hidden" id="sfk" value="keep"><div class="chips"><button class="chip on" data-sfk="keep">➡️ ${t('shop_keep')}</button><button class="chip" data-sfk="drop">🗑 ${t('shop_drop')}</button></div></div>` : ''}
   <div class="small muted">${t('shop_fin_note')}</div>`,
    async () => { const w = walById(val('gmw')); if (!w) return toast(t('e_wal'), 'bd');
      const paid = parseAmt(val('sft')); if (!(paid > 0)) { $('#sft').classList.add('err'); return toast(t('shop_e_total'), 'bd'); }
      const split = shopSplit(by, got, l, paid);
      const dt = val('sfd') || ymd(today()), rate = w.cur && w.cur !== 'UZS' ? rateOf(w.cur) : 1, ids = [];
      for (const [cid, s] of Object.entries(split)) {
        const names = got.filter(i => (i.c || l.c || foodCat()) === cid).map(i => `${i.nom} ${qtyTxt(i.fmiq ?? i.miq, i.b, i.nom)}`).join(', ');
        const note = (`🧺 ${l.nom}: ${names}`).slice(0, 200), id = uid(); ids.push(id);
        upsert('tx', { id, tur: 'x', c: cid, s: Math.round(s / rate * 100) / 100, w: w.id, dt, n: note, kim: me(), shop: l.id });
      }
      got.forEach(i => remember(i, i.c || l.c));
      upsert('lists', { ...l, done: true, dt_done: dt, tx: ids, items: todo.length && val('sfk') !== 'keep' ? got : got });
      if (todo.length && val('sfk') === 'keep') upsert('lists', { id: uid(), nom: l.nom, c: l.c, e: l.e, done: false, kim: me(), items: todo.map(i => ({ ...i, id: uid() })) });
      const L2 = shopLists().find(x => x.id === l.id); if (L2) upsert('lists', { ...L2, paid });
      await persist(); closeModal(); UI.shopList = null; render(); toast(t('shop_added', { s: money(paid) }));
      setTimeout(() => { if (typeof homeAlerts === 'function') { const a = homeAlerts().find(x => x[0] === 'var(--bad)'); if (a) toast(a[1].replace(/<[^>]+>/g, ''), 'wn'); } }, 2800); });
}

/* jami tölangan summani kategoriyalarga taqsimlaş */
function shopSplit(by, got, l, total) {
  const sum = Object.values(by).reduce((a, b) => a + b, 0), out = {};
  if (!(total > 0)) return by;
  if (sum > 0) { let acc = 0; const ks = Object.keys(by); ks.forEach((k, j) => { const v = j === ks.length - 1 ? total - acc : Math.round(total * by[k] / sum); acc += v; out[k] = v; }); return out; }
  const cnt = {}; got.forEach(i => { const c = i.c || l.c || foodCat(); cnt[c] = (cnt[c] || 0) + 1; });
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]; out[top ? top[0] : foodCat()] = total; return out;
}
function shopByHtml(sp) { return Object.entries(sp).map(([cid, s]) => { const c = catById(cid); return `<div class="kv"><span>${c ? c.e + ' ' + esc(catName(c)) : '—'}</span><b>${money(s)}</b></div>`; }).join(''); }
function listTx(l) { const ids = new Set(l.tx || []); return live(DB.tx).filter(x => ids.has(x.id) || x.shop === l.id); }
async function shopDelete(id) {
  const l = shopLists().find(x => x.id === id); if (!l) return;
  const txs = listTx(l), sum = txs.reduce((s, x) => s + txUZS(x), 0);
  if (!confirm(txs.length ? t('shop_del_q_tx', { n: l.nom, s: fmt(sum) }) : t('shop_del_q', { n: l.nom }))) return;
  txs.forEach(x => remove('tx', x.id)); remove('lists', id);
  await persist(); if (UI.shopList === id) UI.shopList = null; closeModal(); render(); toast(t('deleted'));
}
async function shopClear() {
  const H = shopLists().filter(x => x.done); if (!H.length) return;
  const txs = H.flatMap(listTx), sum = txs.reduce((s, x) => s + txUZS(x), 0);
  if (!confirm(t('shop_clear_q', { n: H.length, s: fmt(sum) }))) return;
  txs.forEach(x => remove('tx', x.id)); H.forEach(l => remove('lists', l.id));
  await persist(); render(); toast(t('deleted'));
}
async function shopRepeat(id) {
  const l = shopLists().find(x => x.id === id); if (!l) return;
  const m = shopMem(), rec = { id: uid(), nom: l.nom, c: l.c, e: l.e, done: false, kim: me(),
    items: l.items.map(i => { const mm = m[i.nom.toLowerCase()]; return { id: uid(), nom: i.nom, b: i.b, miq: i.miq, narx: mm && mm.p ? mm.p : +(i.fnarx ?? i.narx) || 0, c: i.c, olindi: false }; }) };
  upsert('lists', rec); await persist(); UI.shopList = rec.id; render(); toast(t('shop_repeated'));
}

async function shopShare() {
  const l = shopLists().find(x => x.id === UI.shopList); if (!l) return;
  const lines = l.items.filter(i => !i.olindi).map(i => `☐ ${i.nom} — ${qtyTxt(i.miq, i.b, i.nom)}${+i.narx ? ` (~${fmt(itEst(i))})` : ''}`);
  const txt = `🧺 ${l.nom}\n\n${lines.join('\n') || '—'}\n\n${t('shop_plan')}: ~${fmt(l.items.filter(i => !i.olindi).reduce((s, i) => s + itEst(i), 0))}\n— ${me()} · ${t('app')}`;
  if (await Platform.shareText(l.nom, txt)) return;
  await Platform.copy(txt); toast(t('copied'));
}

/* ---------- Hodisalar ---------- */
document.addEventListener('click', async e => {
  const c = s => e.target.closest(s); let x;
  if ((x = c('[data-act]'))) { const a = x.dataset.act;
    if (a === 'shop') { UI.page = 'shop'; UI.shopList = shopActive().length === 1 ? shopActive()[0].id : null; SHOP.q = ''; closeModal(); return render(); }
    if (a === 'shopback') { if (UI.shopList) UI.shopList = null; else UI.page = 'home'; return render(); }
    if (a === 'shopnew') return shopNew();
    if (a === 'shopedit') return shopNew(UI.shopList);
    if (a === 'shopfinish') return shopFinish();
    if (a === 'shopshare') return shopShare();
    if (a === 'shopclear') return shopClear();
    if (a === 'shopadd') { const q = (($('#shq') || {}).value || '').trim(); if (!q) return $('#shq').focus(); const s = prodSuggest(q).find(z => z.n.toLowerCase() === q.toLowerCase()); return shopItem(UI.shopList, null, s || { n: q[0].toUpperCase() + q.slice(1) }); }
    return; }
  if ((x = c('[data-shopen]'))) { UI.shopList = x.dataset.shopen; SHOP.q = ''; return render(); }
  if ((x = c('[data-shdel]'))) return shopDelete(x.dataset.shdel);
  if ((x = c('[data-shrep]'))) return shopRepeat(x.dataset.shrep);
  if ((x = c('[data-shsug]'))) { const k = x.dataset.shsug, q = (($('#shq') || {}).value || '').trim();
    return shopItem(UI.shopList, null, k === 'new' ? { n: q[0].toUpperCase() + q.slice(1) } : SHOP.sug[+k]); }
  if ((x = c('[data-shchk]'))) return shopCheck(UI.shopList, x.dataset.shchk);
  if ((x = c('[data-shitem]'))) return shopItem(UI.shopList, x.dataset.shitem);
  if ((x = c('[data-slc]'))) { $('#slc').value = x.dataset.slc; document.querySelectorAll('[data-slc]').forEach(b => b.classList.toggle('on', b === x)); return; }
  if ((x = c('[data-sib]'))) { $('#sib').value = x.dataset.sib; document.querySelectorAll('[data-sib]').forEach(b => b.classList.toggle('on', b === x));
    const lb = $('#sipl'); if (lb) lb.textContent = t('shop_price', { u: unitName(x.dataset.sib) }); return; }
  if ((x = c('[data-sfk]'))) { $('#sfk').value = x.dataset.sfk; document.querySelectorAll('[data-sfk]').forEach(b => b.classList.toggle('on', b === x)); return; }
});
document.addEventListener('input', e => {
  if (e.target.id === 'shq') return drawSug();
  if (['siq', 'sip', 'sfq', 'sfp'].includes(e.target.id)) setTimeout(shopLine, 0);
  if (e.target.id === 'sft' && SHOP.fin) setTimeout(() => { const v = parseAmt(e.target.value), F = SHOP.fin; const box = $('#sfby'); if (box) box.innerHTML = shopByHtml(shopSplit(F.by, F.got, F.l, v || F.real));
    const d = (v || 0) - F.plan, tp = $('#sfdiff'); if (tp && F.plan > 0) tp.innerHTML = d > 0 ? t('shop_more', { s: money(d) }) : d < 0 ? t('shop_less', { s: money(-d) }) : t('shop_same'); }, 0);
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'shq') { e.preventDefault(); const b = document.querySelector('[data-act=shopadd]'); if (b) b.click(); } });
