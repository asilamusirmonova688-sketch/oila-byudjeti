/* ==========================================================
   Platforma: saqlaş, fayllar, bildirişnomalar, Telegram
   Android (Capacitor) va brauzer (iPhone / PWA) uçun
   ========================================================== */
const Platform = (() => {
  const Cap = window.Capacitor;
  const native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const P = (Cap && Cap.Plugins) || {};
  const FILE = 'byudjet.json';

  /* ---------- saqlaş ---------- */
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open('oila-byudjeti', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  async function idbGet(k) { const db = await idb(); return new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
  async function idbSet(k, v) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }

  async function load() {
    try {
      if (native && P.Filesystem) { const r = await P.Filesystem.readFile({ path: FILE, directory: 'DATA', encoding: 'utf8' }); return JSON.parse(r.data); }
      return (await idbGet('db')) || null;
    } catch (_) { try { return JSON.parse(localStorage.getItem('ob-db') || 'null'); } catch (__) { return null; } }
  }
  let saving = Promise.resolve();
  function save(db) {
    const data = JSON.stringify(db);
    saving = saving.then(async () => {
      try {
        if (native && P.Filesystem) await P.Filesystem.writeFile({ path: FILE, directory: 'DATA', encoding: 'utf8', data });
        else await idbSet('db', JSON.parse(data));
      } catch (_) { try { localStorage.setItem('ob-db', data); } catch (__) {} }
    });
    return saving;
  }

  /* ---------- fayllar ---------- */
  function pickFile(accept) {
    return new Promise(res => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.style.display = 'none';
      inp.onchange = () => { res(inp.files[0] || null); inp.remove(); };
      inp.addEventListener('cancel', () => { res(null); inp.remove(); });
      document.body.appendChild(inp); inp.click();
    });
  }
  const toB64 = data => { const u = typeof data === 'string' ? new TextEncoder().encode(data) : data; let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  async function saveFile(name, mime, data, shareTitle) {
    if (native && P.Filesystem && P.Share) {
      const w = await P.Filesystem.writeFile({ path: name, directory: 'CACHE', data: toB64(data) });
      try { await P.Share.share({ title: shareTitle || name, files: [w.uri] }); } catch (_) { try { await P.Share.share({ title: shareTitle || name, url: w.uri }); } catch (__) {} }
      return true;
    }
    const file = new File([data], name, { type: mime });
    if (shareTitle && navigator.canShare && navigator.canShare({ files: [file] }) && /iphone|ipad|android/i.test(navigator.userAgent)) {
      try { await navigator.share({ files: [file], title: shareTitle }); return true; } catch (e) { if (e && e.name === 'AbortError') return false; }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    return true;
  }

  /* ---------- bildirişnomalar (faqat Android) ---------- */
  const LN = P.LocalNotifications;
  const notify = {
    available: native && !!LN,
    async permission() {
      if (!this.available) return false;
      let p = await LN.checkPermissions(); if (p.display !== 'granted') p = await LN.requestPermissions();
      return p.display === 'granted';
    },
    async replace(list) {
      if (!this.available) return;
      try {
        const pend = await LN.getPending();
        if (pend.notifications && pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
        if (!list.length) return;
        if (!(await this.permission())) return;
        await LN.schedule({ notifications: list.slice(0, 60).map(n => ({ ...n, largeBody: n.body, schedule: { at: n.at, allowWhileIdle: true } })) });
      } catch (e) { console.warn('notify', e); }
    },
    async test(title, body) {
      if (!this.available) return { ok: false };
      if (!(await this.permission())) return { ok: false, denied: true };
      await LN.schedule({ notifications: [{ id: 99999, title, body, schedule: { at: new Date(Date.now() + 3000), allowWhileIdle: true } }] });
      return { ok: true };
    },
  };

  /* ---------- Telegram ---------- */
  async function tg(token, method, params) {
    let r;
    try { r = await fetch(`https://api.telegram.org/bot${String(token).trim()}/${method}`, { method: 'POST', body: new URLSearchParams(params || {}) }); }
    catch (e) { throw new Error('NET: ' + e.message); }
    let j; try { j = await r.json(); } catch (_) { throw new Error('HTTP ' + r.status); }
    if (!j.ok) throw new Error(j.description || 'error');
    return j.result;
  }


  /* ---------- orqaga tugmasi, titraş, biometriya, havola ---------- */
  function onBack(fn) {
    if (native && P.App) { P.App.addListener('backButton', () => fn()); return; }
    // brauzer (PWA): tarix orqali
    try { history.pushState({ ob: 1 }, ''); window.addEventListener('popstate', () => { if (fn() !== 'exit') history.pushState({ ob: 1 }, ''); else history.back(); }); } catch (_) {}
  }
  function exit() { if (native && P.App) P.App.exitApp(); }
  function vibrate(ms) { try { if (native && P.Haptics) P.Haptics.vibrate({ duration: ms || 200 }); else if (navigator.vibrate) navigator.vibrate(ms || 200); } catch (_) {} }
  const BIO = P.BiometricAuthNative;
  const bio = {
    async available() { if (!native || !BIO) return null; try { const r = await BIO.checkBiometry(); return r && r.isAvailable ? r : null; } catch (_) { return null; } },
    async auth(o) { if (!native || !BIO) return false; try { await BIO.internalAuthenticate({ reason: o.title, cancelTitle: o.cancel, androidTitle: o.title, androidSubtitle: o.sub || '', androidConfirmationRequired: false, androidBiometryStrength: 0, allowDeviceCredential: false }); return true; } catch (_) { return false; } },
  };
  function openUrl(u) { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
  async function copy(text) { try { await navigator.clipboard.writeText(text); return true; } catch (_) { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (__) {} t.remove(); return ok; } }
  async function shareText(title, text, file) {
    if (native && P.Share) {
      const o = { title, text, dialogTitle: title };
      if (file) { try { const w = await P.Filesystem.writeFile({ path: file.name, directory: 'CACHE', data: toB64(new Uint8Array(await file.arrayBuffer())) }); o.files = [w.uri]; } catch (_) {} }
      try { await P.Share.share(o); return true; } catch (_) { return false; }
    }
    if (navigator.share) { const o = { title, text }; if (file && navigator.canShare && navigator.canShare({ files: [file] })) o.files = [file]; try { await navigator.share(o); return true; } catch (_) { return false; } }
    return false;
  }

  /* ---------- PIN uçun xeş ---------- */
  async function sha256(s) {
    if (crypto && crypto.subtle) {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
    }
    let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'x' + (h >>> 0).toString(16);
  }

  return { native, load, save, pickFile, saveFile, notify, tg, sha256, onBack, exit, vibrate, bio, openUrl, copy, shareText };
})();
