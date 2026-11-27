/* =================== 🏦 Kredit kalkulyatori =================== */
let LOAN = { s: '50 000 000', r: '24', m: '24', type: 'ann', extra: '', all: false };
function loanCalc(S, rate, M, type, extra) {
  const i = rate / 1200, rows = []; let bal = S, k = 0, tot = 0, int = 0;
  const ann = i ? S * i / (1 - Math.pow(1 + i, -M)) : S / M;
  while (bal > 0.5 && k < 600) {
    k++; const pi = bal * i; let pr = type === 'ann' ? ann - pi : S / M; pr = Math.min(bal, pr + (extra || 0));
    const pay = pr + pi; bal -= pr; tot += pay; int += pi; rows.push({ k, pay, pr, pi, bal: Math.max(0, bal) });
    if (k >= M && !extra) break;
  }
  return { rows, tot, int, ann, first: rows[0] ? rows[0].pay : 0, last: rows.length ? rows[rows.length - 1].pay : 0, n: rows.length };
}
function pageLoan() {
  const S = parseAmt(LOAN.s), R = parseAmt(LOAN.r), M = Math.round(parseAmt(LOAN.m)), X = parseAmt(LOAN.extra);
  const ok = S > 0 && R >= 0 && M > 0 && M <= 360;
  const base = ok ? loanCalc(S, R, M, LOAN.type, 0) : null, ex = ok && X > 0 ? loanCalc(S, R, M, LOAN.type, X) : null;
  const rows = base ? (LOAN.all ? base.rows : base.rows.slice(0, 12)) : [];
  return `<div class="card" style="display:grid;gap:12px">
   <div class="fld"><label>${t('ln_sum')}</label><input id="lns" inputmode="decimal" value="${esc(LOAN.s)}"></div>
   <div class="g2"><div class="fld"><label>${t('ln_rate')}</label><input id="lnr" inputmode="decimal" value="${esc(LOAN.r)}"></div><div class="fld"><label>${t('ln_months')}</label><input id="lnm" inputmode="numeric" value="${esc(LOAN.m)}"></div></div>
   <div class="seg full"><button class="${LOAN.type === 'ann' ? 'on' : ''}" data-lnt="ann">${t('ln_ann')}</button><button class="${LOAN.type === 'diff' ? 'on' : ''}" data-lnt="diff">${t('ln_diff')}</button></div>
   <div class="small muted">${t(LOAN.type === 'ann' ? 'ln_ann_s' : 'ln_diff_s')}</div></div>
  ${base ? `<div class="card"><div class="g2">
    <div class="kp"><small>${t(LOAN.type === 'ann' ? 'ln_month_pay' : 'ln_first_pay')}</small><b class="num" style="font-size:22px">${money(LOAN.type === 'ann' ? base.ann : base.first)}</b>${LOAN.type === 'diff' ? `<small>${t('ln_last_pay', { s: money(base.last) })}</small>` : ''}</div>
    <div class="kp"><small>${t('ln_over')}</small><b class="num neg" style="font-size:22px">${money(base.int)}</b><small>${Math.round(base.int / S * 100)}% ${t('ln_of_sum')}</small></div></div>
    <div class="kv" style="border:0;padding:12px 2px 0"><span>${t('ln_total')}</span><b>${money(base.tot)}</b></div>
    <button class="btn alt w sm" style="margin-top:12px" data-act="loanrec">🔁 ${t('ln_to_rec')}</button></div>
  <div class="card" style="display:grid;gap:10px"><div class="ch"><div><h2>⚡ ${t('ln_early')}</h2><p>${t('ln_early_s')}</p></div></div>
   <div class="fld"><label>${t('ln_extra')}</label><input id="lnx" inputmode="decimal" value="${esc(LOAN.extra)}" placeholder="0"></div>
   ${ex ? `<div class="tip"><span>🎯</span><div>${t('ln_early_r', { m: base.n - ex.n, s: money(base.int - ex.int), n: ex.n })}</div></div>` : ''}</div>
  <div class="card"><div class="ch"><h2>📋 ${t('ln_sched')}</h2></div>
   <div class="bkt lnt"><div class="bkh"><span>№</span><span>${t('ln_pay')}</span><span>${t('ln_int')}</span><span>${t('ln_left')}</span></div>
   ${rows.map(x => `<div><span>${x.k}</span><span class="num">${sp(Math.round(x.pay))}</span><span class="num">${sp(Math.round(x.pi))}</span><span class="num">${sp(Math.round(x.bal))}</span></div>`).join('')}</div>
   ${base.rows.length > 12 ? `<button class="lnk" data-act="loanall" style="margin-top:8px">${LOAN.all ? t('ln_less') : t('ln_more', { n: base.rows.length })}</button>` : ''}
   <div class="small muted" style="margin-top:8px">${t('ln_note')}</div></div>` : `<div class="tip wn"><span>⚠️</span><div>${t('ln_bad')}</div></div>`}`;
}

/* =================== 📈 Bozor narxlari tarixi =================== */
function priceHistory() {
  const H = {};
  for (const l of shopLists().filter(x => x.done && x.dt_done)) for (const i of l.items) {
    const p = +(i.fnarx ?? i.narx); if (!i.olindi || !(p > 0)) continue;
    const k = normP(i.nom); (H[k] = H[k] || { n: i.nom, b: i.b, pts: [] }).pts.push({ d: l.dt_done, p });
  }
  return Object.values(H).map(h => { h.pts.sort((a, b) => a.d.localeCompare(b.d)); const f = h.pts[0].p, last = h.pts[h.pts.length - 1].p; h.last = last; h.ch = f ? (last - f) / f * 100 : 0; return h; })
    .sort((a, b) => b.pts.length - a.pts.length || Math.abs(b.ch) - Math.abs(a.ch));
}
function priceCard() {
  const H = priceHistory().filter(h => h.pts.length >= 2).slice(0, 8);
  if (!H.length) return '';
  return `<div class="card"><div class="ch"><div><h2>📈 ${t('ph_title')}</h2><p>${t('ph_sub')}</p></div></div>
   ${H.map(h => `<div class="row" data-phk="${esc(normP(h.n))}" style="cursor:pointer"><div class="tx"><b>${esc(h.n)}</b><small>${fmt(h.last)} / ${unitOf(h.b, h.n)} · ${h.pts.length} ${t('ph_times')}</small></div>
     <b class="num ${h.ch > 0 ? 'neg' : h.ch < 0 ? 'pos' : 'muted'}">${h.ch > 0 ? '▲' : h.ch < 0 ? '▼' : ''} ${Math.abs(Math.round(h.ch))}%</b></div>`).join('')}</div>`;
}
function priceSheet(key) {
  const h = priceHistory().find(x => normP(x.n) === key); if (!h) return;
  const W_ = 320, H_ = 140, ps = h.pts.map(x => x.p), mn = Math.min(...ps), mx = Math.max(...ps), rg = mx - mn || 1;
  const pts = h.pts.map((x, j) => [36 + j * (W_ - 72) / Math.max(1, h.pts.length - 1), H_ - 22 - (x.p - mn) / rg * (H_ - 44)]);
  modal(`${mhead('📈 ' + esc(h.n))}<div class="mb">
   <div class="g2"><div class="kp"><small>${t('ph_now')}</small><b class="num">${money(h.last)}</b><small>/ ${unitOf(h.b, h.n)}</small></div>
    <div class="kp"><small>${t('ph_change')}</small><b class="num ${h.ch > 0 ? 'neg' : 'pos'}">${h.ch > 0 ? '+' : ''}${Math.round(h.ch)}%</b><small>${t('ph_since', { d: fmtDay(pd(h.pts[0].d)) })}</small></div></div>
   <svg viewBox="0 0 ${W_} ${H_}" style="width:100%;height:auto"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--acc)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map((p, j) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--acc)"/><text x="${p[0]}" y="${p[1] - 9}" text-anchor="middle" style="font:700 10px var(--fb);fill:var(--ink2)">${short(h.pts[j].p)}</text>`).join('')}</svg>
   <div class="kvs">${h.pts.slice().reverse().map(x => `<div class="kv"><span>${fmtDay(pd(x.d))} ${pd(x.d).getFullYear()}</span><b>${money(x.p)}</b></div>`).join('')}</div></div>`);
}
function lastPriceHint(nom) {
  const h = priceHistory().find(x => normP(x.n) === normP(nom)); if (!h) return '';
  const lp = h.pts[h.pts.length - 1]; return t('ph_last', { s: fmt(lp.p), d: fmtDay(pd(lp.d)) });
}

/* =================== 🎉 Yil yakuni =================== */
function yearData(off) {
  const r = range('year', off || 0), S = stats(r);
  const months = []; for (let d = new Date(r.a); d < r.b; d = new Date(d.getFullYear(), d.getMonth() + 1, r.a.getDate())) {
    const rr = { a: new Date(d), b: new Date(d.getFullYear(), d.getMonth() + 1, r.a.getDate()) }; const s2 = stats(rr); months.push({ m: d.getMonth(), exp: s2.exp, inc: s2.inc }); }
  const top = Object.entries(S.byCat).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, v]) => ({ c: catById(id), v }));
  const big = months.filter(m => m.exp > 0).sort((a, b) => b.exp - a.exp)[0];
  const goals = live(DB.tx).filter(x => x.g && inR(x, r)).reduce((s, x) => s + (x.tur === 'd' ? -1 : 1) * txUZS(x), 0);
  const saved = S.inc - S.exp + S.byGroup.j;
  const shops = shopLists().filter(l => l.done && l.dt_done && pd(l.dt_done) >= r.a && pd(l.dt_done) < r.b).length;
  return { r, S, top, big, goals, saved, rate: S.inc ? saved / S.inc * 100 : 0, n: S.list.length, shops, year: r.label };
}
function yearSheet(off) {
  const Y = yearData(off);
  if (!Y.n) return toast(t('ys_empty'), 'wn');
  const stat = (e, l, v, cls) => `<div class="ysb"><span>${e}</span><small>${l}</small><b class="num ${cls || ''}">${v}</b></div>`;
  modal(`${mhead('🎉 ' + t('ys_title', { y: Y.year }))}<div class="mb">
   <div class="ysh"><div class="em">🎉</div><b>${t('ys_hello', { n: esc(DB.settings.ism || '') })}</b><span>${t('ys_lead', { n: Y.n })}</span></div>
   <div class="ysg">${stat('💰', t('income'), money(Y.S.inc), 'pos')}${stat('🧾', t('expense'), money(Y.S.exp), 'neg')}${stat('🐷', t('ys_saved'), money(Y.saved), Y.saved >= 0 ? 'pos' : 'neg')}${stat('📈', t('ys_rate'), Math.round(Y.rate) + '%')}</div>
   ${Y.top.length ? `<div class="card" style="margin:0"><div class="ch"><h2>🏆 ${t('ys_top')}</h2></div>${Y.top.map((x, j) => `<div class="row"><div class="ico sm">${x.c ? x.c.e : '❓'}</div><div class="tx"><b>${j + 1}. ${esc(catName(x.c))}</b></div><b class="num">${money(x.v)}</b></div>`).join('')}</div>` : ''}
   <div class="kvs">${Y.big ? `<div class="kv"><span>🔥 ${t('ys_big')}</span><b>${monName(Y.big.m)} · ${money(Y.big.exp)}</b></div>` : ''}${Y.goals > 0 ? `<div class="kv"><span>🎯 ${t('ys_goals')}</span><b>${money(Y.goals)}</b></div>` : ''}${Y.shops ? `<div class="kv"><span>🧺 ${t('ys_shops')}</span><b>${Y.shops}</b></div>` : ''}</div>
   <div class="tip"><span>💡</span><div>${Y.rate >= 20 ? t('ys_good') : Y.rate >= 0 ? t('ys_ok') : t('ys_bad')}</div></div></div>
   <div class="mf"><button class="btn alt" data-ysoff="${(off || 0) - 1}">◀ ${+Y.year - 1}</button><button class="btn" data-act="ysshare">${ic('share')}${t('ys_share')}</button></div>`);
  YS_OFF = off || 0;
}
let YS_OFF = 0;
async function yearImage() {
  const Y = yearData(YS_OFF), cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350; const g = cv.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 1080, 1350); grd.addColorStop(0, '#12a37a'); grd.addColorStop(1, '#0e5e6f'); g.fillStyle = grd; g.fillRect(0, 0, 1080, 1350);
  const F = (w, s) => `${w} ${s}px Manrope, Inter, sans-serif`;
  g.fillStyle = '#fff'; g.font = F(800, 44); g.fillText(t('app'), 80, 120);
  g.font = F(800, 96); g.fillText(t('ys_title', { y: Y.year }), 80, 250);
  const box = (x, y, l, v) => { g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.roundRect(x, y, 440, 190, 36); g.fill(); g.fillStyle = 'rgba(255,255,255,.8)'; g.font = F(700, 34); g.fillText(l, x + 36, y + 66); g.fillStyle = '#fff'; g.font = F(800, 54); g.fillText(v, x + 36, y + 146); };
  box(80, 330, t('income'), short(Y.S.inc)); box(560, 330, t('expense'), short(Y.S.exp)); box(80, 550, t('ys_saved'), short(Y.saved)); box(560, 550, t('ys_rate'), Math.round(Y.rate) + '%');
  g.fillStyle = '#fff'; g.font = F(800, 44); g.fillText('🏆 ' + t('ys_top'), 80, 840);
  g.font = F(700, 40); Y.top.forEach((x, j) => { g.fillText(`${j + 1}. ${catName(x.c)}`, 80, 920 + j * 70); g.textAlign = 'right'; g.fillText(short(x.v), 1000, 920 + j * 70); g.textAlign = 'left'; });
  g.fillStyle = 'rgba(255,255,255,.85)'; g.font = F(600, 34); g.fillText('«' + (QUOTES[L()] || QUOTES.uz)[0].replace(/\.$/, '') + '»', 80, 1260);
  return await new Promise(res => cv.toBlob(b => res(new File([b], `yil-yakuni-${Y.year}.png`, { type: 'image/png' })), 'image/png'));
}

/* =================== Hodisalar =================== */
document.addEventListener('click', async e => {
  const c = s => e.target.closest(s); let x;
  if ((x = c('[data-act]'))) { const a = x.dataset.act;
    if (a === 'loanall') { LOAN.all = !LOAN.all; return render(); }
    if (a === 'loanrec') { const S = parseAmt(LOAN.s), b = loanCalc(S, parseAmt(LOAN.r), Math.round(parseAmt(LOAN.m)), LOAN.type, 0);
      return openRec(null, { nom: t('ln_rec_name'), s: Math.round(LOAN.type === 'ann' ? b.ann : b.first), c: (live(DB.cats).find(z => z.k === 'credit') || {}).id }); }
    if (a === 'yearsum') return yearSheet(0);
    if (a === 'ysshare') { const f = await yearImage(); const Y = yearData(YS_OFF); const txt = `🎉 ${t('ys_title', { y: Y.year })} — ${t('app')}\n${t('income')}: ${fmt(Y.S.inc)}\n${t('expense')}: ${fmt(Y.S.exp)}\n${t('ys_saved')}: ${fmt(Y.saved)}`;
      if (await Platform.shareText(t('ys_title', { y: Y.year }), txt, f)) return; const u = URL.createObjectURL(f), aa = document.createElement('a'); aa.href = u; aa.download = f.name; aa.click(); return; }
    return; }
  if ((x = c('[data-lnt]'))) { LOAN.type = x.dataset.lnt; return render(); }
  if ((x = c('[data-phk]'))) return priceSheet(x.dataset.phk);
  if ((x = c('[data-ysoff]'))) return yearSheet(+x.dataset.ysoff);
});
document.addEventListener('change', e => { const m = { lns: 's', lnr: 'r', lnm: 'm', lnx: 'extra' }[e.target.id]; if (m) { LOAN[m] = e.target.value; render(); } });
