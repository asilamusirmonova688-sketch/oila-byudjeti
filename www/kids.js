/* =================== 🧒 Bolalar ço'ntak puli =================== */
// DB.kids: { id, ism, e, haftalik, kun (0=yakşanba..6), maqsad, maqsad_n, paid:[hafta kaliti] }
// DB.kidtx: { id, kid, tur: 'b' (berildi) | 's' (sarfladi) | 'q' (sovg'a/qoşimça), s, dt, n }
const KIDS = () => live(DB.kids || []);
const kidTx = id => live(DB.kidtx || []).filter(x => x.kid === id).sort((a, b) => b.dt.localeCompare(a.dt) || (b.u || 0) - (a.u || 0));
const kidBal = id => kidTx(id).reduce((s, x) => s + (x.tur === 's' ? -x.s : x.s), 0);
const kidWeek = (d = today()) => ymd(weekStart(d));
const kidDue = k => { if (!(k.haftalik > 0)) return false; const pos = n => (n + 6) % 7; return pos(today().getDay()) >= pos(+k.kun) && !(k.paid || []).includes(kidWeek()); };
const WDAYS = () => [1, 2, 3, 4, 5, 6, 0].map(i => [i, t('wd_' + i)]);

function pageKids() {
  const ks = KIDS();
  return (ks.length ? ks.map(k => {
    const b = kidBal(k.id), due = kidDue(k), pc = k.maqsad > 0 ? Math.min(100, Math.max(0, b / k.maqsad * 100)) : 0, H = kidTx(k.id).slice(0, 5);
    return `<div class="card kid"><div class="ch"><div style="display:flex;gap:10px;align-items:center"><div class="ico">${k.e || '🧒'}</div><div><h2>${esc(k.ism)}</h2><p>${k.haftalik > 0 ? t('kd_weekly_s', { s: money(k.haftalik), d: t('wd_' + k.kun) }) : t('kd_nowk')}</p></div></div>
      <button class="ib pl" data-kidedit="${k.id}">${ic('edit')}</button></div>
     <div class="kbal"><small>${t('kd_bal')}</small><b class="num ${b < 0 ? 'neg' : ''}">${money(b)}</b></div>
     ${k.maqsad > 0 ? `<div style="margin:8px 0 2px"><div class="small" style="display:flex;justify-content:space-between"><span>🎯 ${esc(k.maqsad_n || t('kd_goal'))}</span><b>${Math.round(pc)}%</b></div>
       <div class="bar" style="height:10px;margin-top:5px"><i style="width:${pc}%;--c:var(--good)"></i></div>
       <div class="small muted" style="margin-top:4px">${b >= k.maqsad ? '🎉 ' + t('kd_goal_ok') : t('kd_goal_left', { s: money(k.maqsad - b) })}</div></div>` : ''}
     ${due ? `<div class="tip" style="margin-top:10px"><span>⏰</span><div>${t('kd_due', { s: money(k.haftalik) })}</div></div>` : ''}
     <div class="g2" style="margin-top:10px">
      <button class="btn sm" data-kidgive="${k.id}">${ic('plus')}${due ? t('kd_give_wk') : t('kd_give')}</button>
      <button class="btn alt sm" data-kidspend="${k.id}">🛍️ ${t('kd_spent')}</button></div>
     ${H.length ? `<div class="kvs" style="margin-top:10px">${H.map(x => `<div class="kv" data-kidtx="${x.id}"><span>${fmtDay(pd(x.dt))} · ${x.tur === 's' ? '🛍️' : x.tur === 'q' ? '🎁' : '💵'} ${esc(x.n || t('kd_t_' + x.tur))}</span><b class="${x.tur === 's' ? 'neg' : 'pos'}">${x.tur === 's' ? '−' : '+'}${money(x.s)}</b></div>`).join('')}</div>` : ''}
    </div>`;
  }).join('') : `<div class="card" style="text-align:center"><div style="font-size:44px">🧒</div><h2 style="margin:6px 0">${t('kd_empty')}</h2><p class="small muted">${t('kd_empty_s')}</p></div>`)
   + `<button class="btn w" data-act="kidnew">${ic('plus')}${t('kd_add')}</button>
   <div class="tip"><span>💡</span><div>${t('kd_tip')}</div></div>`;
}
function openKid(id) {
  const k = id ? DB.kids.find(z => z.id === id) : { id: null, ism: '', e: '🧒', haftalik: 0, kun: 1, maqsad: 0, maqsad_n: '', paid: [] };
  formModal(id ? esc(k.ism) : t('kd_add'), `<div class="fld"><label>${t('kd_name')}</label><input id="kn" value="${esc(k.ism)}" placeholder="${t('kd_name_ph')}"></div>
   <div class="chips" style="flex-wrap:wrap">${['🧒', '👦', '👧', '👶', '🧑', '🐻', '🦁', '⭐'].map(e => `<button class="chip ${k.e === e ? 'on' : ''}" data-kide="${e}">${e}</button>`).join('')}</div><input type="hidden" id="ke" value="${k.e}">
   <div class="g2"><div class="fld"><label>${t('kd_weekly')}</label><input id="kw" inputmode="decimal" value="${k.haftalik ? fmtInput(String(k.haftalik)) : ''}" placeholder="0"></div>
    <div class="fld"><label>${t('kd_day')}</label><select id="kd">${WDAYS().map(([i, n]) => `<option value="${i}" ${+k.kun === i ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
   <div class="g2"><div class="fld"><label>🎯 ${t('kd_goal')}</label><input id="kgn" value="${esc(k.maqsad_n || '')}" placeholder="${t('kd_goal_ph')}"></div>
    <div class="fld"><label>${t('amount')}</label><input id="kg" inputmode="decimal" value="${k.maqsad ? fmtInput(String(k.maqsad)) : ''}" placeholder="0"></div></div>
   ${!id ? `<div class="fld"><label>${t('kd_start')}</label><input id="ks" inputmode="decimal" placeholder="0"></div>` : ''}`,
    async () => { const ism = val('kn').trim(); if (!ism) { $('#kn').classList.add('err'); return toast(t('e_fill'), 'bd'); }
      const rec = { ...k, id: k.id || uid(), ism, e: val('ke') || '🧒', haftalik: parseAmt(val('kw')), kun: +val('kd'), maqsad: parseAmt(val('kg')), maqsad_n: val('kgn').trim() };
      upsert('kids', rec); const st = !id ? parseAmt(val('ks')) : 0;
      if (st > 0) upsert('kidtx', { id: uid(), kid: rec.id, tur: 'q', s: st, dt: ymd(today()), n: t('start_bal') });
      await persist(); closeModal(); render(); toast(t('saved')); },
    id ? 'kids:' + id : null);
}
function kidMoney(id, tur) {
  const k = DB.kids.find(z => z.id === id); if (!k) return;
  const wk = tur === 'b' && kidDue(k), mine = W().filter(w => !w.egasi || w.egasi === DB.settings.ism), uzs = mine.filter(w => w.cur === 'UZS');
  formModal(`${k.e} ${esc(k.ism)} — ${t(tur === 's' ? 'kd_spent' : 'kd_give')}`, `<div class="fld"><label>${t('amount')}</label><input id="km" inputmode="decimal" value="${wk ? fmtInput(String(k.haftalik)) : ''}" placeholder="0"></div>
   <div class="fld"><label>${t('note')}</label><input id="kc" placeholder="${t(tur === 's' ? 'kd_spent_ph' : 'kd_give_ph')}"></div>
   ${tur !== 's' ? `<div class="fld"><label>${t('kd_from')}</label><select id="kf"><option value="">${t('kd_from_none')}</option>${(uzs.length ? uzs : mine).map((w, j) => `<option value="${w.id}" ${j === 0 ? 'selected' : ''}>${w.e} ${esc(walName(w))}</option>`).join('')}</select></div>
    <div class="small muted">${t('kd_from_s')}</div>` : ''}`,
    async () => { const s = parseAmt(val('km')); if (!(s > 0)) { $('#km').classList.add('err'); return toast(t('e_amt'), 'bd'); }
      const dt = ymd(today()), n = val('kc').trim();
      if (tur === 's' && s > kidBal(k.id)) toast(t('kd_minus'), 'bd');
      upsert('kidtx', { id: uid(), kid: k.id, tur: tur === 's' ? 's' : (wk ? 'b' : 'q'), s, dt, n: n || (wk ? t('kd_t_b') : '') });
      if (tur !== 's') { const w = val('kf'); if (w) upsert('tx', { id: uid(), tur: 'x', c: (live(DB.cats).find(c => c.k === 'kids') || {}).id, s, w, dt, n: `${k.e} ${k.ism}: ${n || t('kd_t_b')}`, kim: me() });
        if (wk) { k.paid = [...new Set([...(k.paid || []), kidWeek()])].slice(-20); upsert('kids', k); } }
      await persist(); closeModal(); render(); toast(t('saved')); });
}
function kidAlerts() {
  return KIDS().filter(kidDue).map(k => ['var(--acc)', `${k.e || '🧒'} ${t('kd_al', { n: esc(k.ism), s: money(k.haftalik) })}`, `data-kidgive="${k.id}"`]);
}

document.addEventListener('click', async e => {
  const c = s => e.target.closest(s); let x;
  if ((x = c('[data-kidgive]'))) { e.stopImmediatePropagation(); return kidMoney(x.dataset.kidgive, 'b'); }
  if ((x = c('[data-kidspend]'))) return kidMoney(x.dataset.kidspend, 's');
  if ((x = c('[data-kidedit]'))) return openKid(x.dataset.kidedit);
  if ((x = c('[data-act="kidnew"]'))) { e.stopImmediatePropagation(); return openKid(); }
  if ((x = c('[data-kide]'))) { document.querySelectorAll('[data-kide]').forEach(b => b.classList.toggle('on', b === x)); $('#ke').value = x.dataset.kide; return; }
  if ((x = c('[data-kidtx]'))) { const r = DB.kidtx.find(z => z.id === x.dataset.kidtx); if (r && confirm(t('kd_del_q'))) { r.d = 1; touch(r); await persist(); render(); } }
}, true);
