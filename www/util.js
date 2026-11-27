/* =================== 🧾 Kommunal hisoblagiç =================== */
// Tariflar: VMQ-243 (15.05.2026), 2026-yil 1-iyundan. [yuqori chegara, 1 birlik narxi]
const TARIF0 = {
  el: [[200, 650], [500, 900], [1000, 1100], [5000, 1600], [10000, 1900], [0, 2200]],
  elp: [[200, 325], [500, 450], [1000, 550], [5000, 1600], [10000, 1900], [0, 2200]],
  gasW: [[500, 1100], [2500, 2000], [5000, 2300], [10000, 2700], [0, 3300]],
  gasS: [[100, 1100], [2500, 2000], [5000, 2300], [10000, 2700], [0, 3300]],
  suv: [[0, 0]],
};
const KOM = { el: { e: '💡', u: 'kvt' }, gas: { e: '🔥', u: 'm3' }, suv: { e: '💧', u: 'm3' } };
const komSet = () => DB.settings.kom || (DB.settings.kom = { el: { on: true, plita: false }, gas: { on: true }, suv: { on: true } });
const tarifs = () => ({ ...TARIF0, ...(DB.settings.tarif || {}) });
const heating = d => { const m = d.getMonth(); return m >= 9 || m <= 2; }; // oktyabr–mart
function tierKey(x, d) { if (x === 'el') return komSet().el.plita ? 'elp' : 'el'; if (x === 'gas') return heating(d) ? 'gasW' : 'gasS'; return 'suv'; }
function tierCost(units, tiers) {
  let rest = units, prev = 0, sum = 0; const parts = [];
  for (const [lim, price] of tiers) { if (rest <= 0) break; const cap = lim ? lim - prev : Infinity, q = Math.min(rest, cap);
    if (q > 0) { sum += q * price; parts.push([q, price]); } rest -= q; prev = lim || prev; }
  return { sum, parts };
}
const readings = x => live(DB.meters || []).filter(r => r.x === x).sort((a, b) => a.dt.localeCompare(b.dt) || a.u - b.u);
function komCalc(x, val, dt) {
  const R = readings(x), last = R[R.length - 1]; if (!last || !(val >= last.v)) return null;
  const units = val - last.v, d = pd(dt || ymd(today())), c = tierCost(units, tarifs()[tierKey(x, d)]);
  const prevU = R.length >= 2 ? last.v - R[R.length - 2].v : null;
  return { units, ...c, prevU, last };
}
const unitTxt = x => t(KOM[x].u === 'kvt' ? 'u_kvt' : 'u_m3');

function pageUtil() {
  const ks = komSet();
  return Object.keys(KOM).filter(x => ks[x] && ks[x].on).map(x => {
    const R = readings(x), last = R[R.length - 1], noT = x === 'suv' && !(tarifs().suv[0][1] > 0);
    return `<div class="card kom" data-kom="${x}"><div class="ch"><div><h2>${KOM[x].e} ${t('k_' + x)}</h2><p>${last ? t('k_last', { v: sp(last.v), u: unitTxt(x), d: fmtDay(pd(last.dt)) }) : t('k_first')}</p></div>
      <button class="lnk" data-komt="${x}">${t('k_tarif')}</button></div>
     ${noT ? `<div class="tip"><span>ℹ️</span><div>${t('k_suv_t')}</div></div>` : ''}
     <div class="g2"><div class="fld"><label>${last ? t('k_new') : t('k_start')} (${unitTxt(x)})</label><input id="mr-${x}" inputmode="decimal" placeholder="${last ? sp(last.v) : '0'}"></div>
      <div class="fld"><label>${t('date')}</label><input type="date" id="md-${x}" value="${ymd(today())}"></div></div>
     <div class="kres" id="kr-${x}"></div>
     <div class="g2" style="margin-top:10px"><button class="btn alt sm" data-komsave="${x}">${t('save')}</button>${last ? `<button class="btn sm" data-komsave="${x}" data-tx="1">${ic('plus')}${t('k_to_exp')}</button>` : ''}</div>
     ${R.length > 1 ? `<details style="margin-top:10px"><summary class="lnk" style="cursor:pointer;padding:0">${t('k_hist')}</summary><div class="kvs" style="margin-top:8px">${R.slice(-7).reverse().map((r, j, arr) => { const p = arr[j + 1]; return `<div class="kv"><span>${fmtDay(pd(r.dt))} ${pd(r.dt).getFullYear()}</span><b>${sp(r.v)}${p ? ` <small class="muted">(+${sp(+(r.v - p.v).toFixed(2))})</small>` : ''}</b></div>`; }).join('')}</div></details>` : ''}</div>`;
  }).join('') + `<div class="card"><div class="ch"><h2>⚙️ ${t('k_services')}</h2></div>
    ${Object.keys(KOM).map(x => `<div class="row"><div class="tx"><b>${KOM[x].e} ${t('k_' + x)}</b></div>${sw('kom_' + x, ks[x] && ks[x].on)}</div>`).join('')}
    <div class="row"><div class="tx"><b>🍳 ${t('k_plita')}</b><small>${t('k_plita_s')}</small></div>${sw('kom_plita', ks.el && ks.el.plita)}</div>
    <div class="small muted" style="margin-top:6px">${t('k_note')}</div></div>`;
}
function komResult(x) {
  const el = $('#kr-' + x); if (!el) return;
  const v = parseAmt(val('mr-' + x)), R = komCalc(x, v, val('md-' + x));
  if (!v || !R) { el.innerHTML = v && readings(x).length ? `<span class="neg small">${t('k_less')}</span>` : ''; return; }
  const ch = R.prevU ? Math.round((R.units - R.prevU) / R.prevU * 100) : null;
  el.innerHTML = `<div class="kp"><small>${t('k_used', { n: sp(+R.units.toFixed(2)), u: unitTxt(x) })}</small><b class="num" style="font-size:22px">${money(R.sum)}</b>
    <small>${R.parts.map(([q, p]) => `${sp(+q.toFixed(2))} × ${sp(p)}`).join(' + ')}</small>
    ${ch != null ? `<small class="${ch > 0 ? 'neg' : 'pos'}">${t('k_prev', { n: sp(+R.prevU.toFixed(2)), u: unitTxt(x) })} · ${ch > 0 ? '+' : ''}${ch}%</small>` : ''}</div>`;
}
async function komSave(x, toTx) {
  const v = parseAmt(val('mr-' + x)), dt = val('md-' + x) || ymd(today()); if (!(v > 0)) { $('#mr-' + x).classList.add('err'); return toast(t('k_enter'), 'bd'); }
  const R = readings(x); if (R.length && v < R[R.length - 1].v) return toast(t('k_less'), 'bd');
  const calc = komCalc(x, v, dt);
  upsert('meters', { id: uid(), x, dt, v, kim: me() });
  if (toTx && calc && calc.sum > 0) {
    const w = (W().find(z => z.k === 'card' && (!z.egasi || z.egasi === DB.settings.ism)) || W()[0] || {}).id;
    upsert('tx', { id: uid(), tur: 'x', c: (live(DB.cats).find(c => c.k === 'utility') || {}).id, s: Math.round(calc.sum), w, dt, n: `${KOM[x].e} ${t('k_' + x)}: ${sp(+calc.units.toFixed(2))} ${unitTxt(x)}`, kim: me() });
  }
  await persist(); render(); toast(toTx && calc ? t('k_saved_tx', { s: money(calc.sum) }) : t('saved'));
}
function komTarif(x) {
  const keys = x === 'el' ? [komSet().el.plita ? 'elp' : 'el'] : x === 'gas' ? ['gasW', 'gasS'] : ['suv'], T = tarifs();
  const rows = k => T[k].map(([lim, p], j) => `<div class="g2 trow"><div class="fld"><label>${j === T[k].length - 1 ? t('k_above') : t('k_upto')}</label><input data-tk="${k}" data-tj="${j}" data-tf="lim" inputmode="numeric" value="${lim || ''}" ${j === T[k].length - 1 ? 'disabled placeholder="∞"' : ''}></div>
    <div class="fld"><label>${t('k_price')} (${unitTxt(x)})</label><input data-tk="${k}" data-tj="${j}" data-tf="p" inputmode="decimal" value="${p || ''}"></div></div>`).join('');
  formModal(`${KOM[x].e} ${t('k_tarif')} — ${t('k_' + x)}`, keys.map(k => `${keys.length > 1 ? `<b>${t('k_' + k)}</b>` : ''}${rows(k)}`).join('') + `<div class="small muted">${t('k_tnote')}</div>
    <button class="lnk" data-komreset="${x}">${t('k_reset')}</button>`,
    async () => { const nt = { ...(DB.settings.tarif || {}) };
      for (const k of keys) { const arr = T[k].map(r => r.slice()); document.querySelectorAll(`[data-tk="${k}"]`).forEach(i => { const j = +i.dataset.tj; if (i.dataset.tf === 'lim') arr[j][0] = j === arr.length - 1 ? 0 : (parseAmt(i.value) || 0); else arr[j][1] = parseAmt(i.value) || 0; }); nt[k] = arr; }
      DB.settings.tarif = nt; await persist(); closeModal(); render(); toast(t('saved')); });
}

document.addEventListener('input', e => { const m = e.target.id && e.target.id.match(/^(mr|md)-(el|gas|suv)$/); if (m) komResult(m[2]); });
document.addEventListener('change', e => { const m = e.target.id && e.target.id.match(/^md-(el|gas|suv)$/); if (m) komResult(m[1]); });
document.addEventListener('click', async e => {
  const c = s => e.target.closest(s); let x;
  if ((x = c('[data-komsave]'))) return komSave(x.dataset.komsave, !!x.dataset.tx);
  if ((x = c('[data-komt]'))) return komTarif(x.dataset.komt);
  if ((x = c('[data-komreset]'))) { const k = x.dataset.komreset, nt = { ...(DB.settings.tarif || {}) }; (k === 'el' ? ['el', 'elp'] : k === 'gas' ? ['gasW', 'gasS'] : ['suv']).forEach(z => delete nt[z]); DB.settings.tarif = nt; await persist(); closeModal(); render(); return toast(t('saved')); }
  if ((x = c('[data-sw^="kom_"]'))) { e.stopImmediatePropagation(); e.preventDefault();
    const k = x.dataset.sw.slice(4), ks = komSet();
    if (k === 'plita') ks.el.plita = !ks.el.plita; else ks[k] = { ...(ks[k] || {}), on: !(ks[k] && ks[k].on) };
    await persist(); render(); }
}, true);
