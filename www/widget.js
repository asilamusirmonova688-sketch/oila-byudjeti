/* =================== 📱 Android bosh ekran vidjeti =================== */
let pendingW = null, wTimer = null;
function widgetData() {
  const d = today(), P = savePlan();
  const spent = live(DB.tx).filter(x => x.tur === 'x' && x.dt === ymd(d)).reduce((s, x) => s + txUZS(x), 0);
  const pc = P.allowed > 0 ? P.spent / P.allowed * 100 : 100;
  const kid = (typeof KIDS === 'function' ? KIDS().filter(kidDue) : []).map(k => `${k.e || '🧒'} ${t('kd_al', { n: k.ism, s: fmt(k.haftalik) })}`)[0] || '';
  return {
    bal: fmt(totalBalance()), today: fmt(spent), zero: fmt(0), day: ymd(d),
    plan: P.inc > 0, rem: P.remaining < 0 ? '−' + fmt(-P.remaining) : fmt(P.remaining), remCol: P.remaining < 0 ? 'bad' : pc >= 85 ? 'warn' : 'good',
    kid, hid: !!DB.settings.yashir, hid_ts: +DB.settings.yashir_ts || 0, lock: !!DB.settings.pin,
    dark: document.documentElement.dataset.theme === 'dark',
    L: { bal: t('total_bal'), today: t('w_today'), rem: P.remaining < 0 ? t('w_over') : t('w_left'), noinc: t('w_noinc'), add: '+ ' + t('w_add'), voice: '🎤 ' + t('w_voice'), shop: '🧺 ' + t('w_shop'), open: t('w_open') },
  };
}
function widgetPush() {
  if (!Platform.native || !DB) return;
  clearTimeout(wTimer); wTimer = setTimeout(() => { try { Platform.widget.set(DB.settings.ism ? widgetData() : { L: { bal: t('app'), open: t('w_open') } }); } catch (_) {} }, 250);
}
// vidjetda köz bosilgan bölsa — ilovaga ham qöllaş
async function widgetPull() {
  const r = await Platform.widget.get(); if (!r || !DB) return false;
  if ((+r.hid_ts || 0) > (+DB.settings.yashir_ts || 0) && !!r.hid !== !!DB.settings.yashir) {
    DB.settings.yashir = !!r.hid; DB.settings.yashir_ts = +r.hid_ts; await Platform.save(DB); return true;
  }
  return false;
}
function widgetOpen(a) {
  pendingW = a;
  if (a === 'eye' && DB && DB.settings.pin && !$('#lock').innerHTML) return showLock('unlock'); // summani ochiş — faqat PIN bilan
  if (DB && DB.settings.ism && !$('#lock').innerHTML) runWidget();
}
async function runWidget() {
  const a = pendingW; pendingW = null; if (!a || !DB) return;
  closeModal(); UI.setSec = null;
  if (a === 'eye') { DB.settings.yashir = false; DB.settings.yashir_ts = Date.now(); await Platform.save(DB); widgetPush(); UI.page = 'home'; return render(); }
  if (a === 'add') { UI.page = 'home'; render(); return openTx(null); }
  if (a === 'voice') { UI.page = 'home'; render(); return voiceAdd(); }
  if (a === 'shop') { UI.page = 'shop'; UI.shopList = shopActive().length === 1 ? shopActive()[0].id : null; SHOP.q = ''; return render(); }
  if (a === 'kid') { UI.page = 'kids'; return render(); }
  UI.page = 'home'; render();
}
