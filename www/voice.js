/* =================== 🎤 Ovoz bilan kiritiş =================== */
const VNUM = {
  // özbekça (lotin va kirill, apostrofsiz ham)
  bir: 1, ikki: 2, uch: 3, tort: 4, "to'rt": 4, besh: 5, olti: 6, yetti: 7, sakkiz: 8, toqqiz: 9, "to'qqiz": 9,
  on: 10, "o'n": 10, yigirma: 20, ottiz: 30, "o'ttiz": 30, qirq: 40, ellik: 50, oltmish: 60, yetmish: 70, sakson: 80, toqson: 90, "to'qson": 90,
  бир: 1, икки: 2, уч: 3, тўрт: 4, турт: 4, беш: 5, олти: 6, етти: 7, саккиз: 8, тўққиз: 9, туккиз: 9, ўн: 10, ун: 10, йигирма: 20, ўттиз: 30, уттиз: 30, қирқ: 40, кирк: 40, эллик: 50, олтмиш: 60, етмиш: 70, саксон: 80, тўқсон: 90, туксон: 90,
  // ruscha
  один: 1, одна: 1, два: 2, две: 2, три: 3, четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8, девять: 9, десять: 10, одиннадцать: 11, двенадцать: 12, тринадцать: 13, четырнадцать: 14, пятнадцать: 15,
  шестнадцать: 16, семнадцать: 17, восемнадцать: 18, девятнадцать: 19, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50, шестьдесят: 60, семьдесят: 70, восемьдесят: 80, девяносто: 90,
  сто: 100, двести: 200, триста: 300, четыреста: 400, пятьсот: 500, шестьсот: 600, семьсот: 700, восемьсот: 800, девятьсот: 900,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const VMUL = { yuz: 100, юз: 100, hundred: 100, ming: 1e3, минг: 1e3, тысяча: 1e3, тысячи: 1e3, тысяч: 1e3, тыщ: 1e3, thousand: 1e3, k: 1e3,
  million: 1e6, mln: 1e6, миллион: 1e6, миллиона: 1e6, миллионов: 1e6, млн: 1e6, milliard: 1e9, mlrd: 1e9, миллиард: 1e9 };
const VHALF = { yarim: 0.5, ярим: 0.5, половина: 0.5, half: 0.5 };

/* «yuz ellik ming», «150 ming», «1,5 million», «полтора миллиона» → son */
function parseSpokenAmount(text) {
  const toks = String(text).toLowerCase().replace(/[ʼ‘’`]/g, "'").replace(/(\d)\s+(?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2').split(/[\s\-–]+/).filter(Boolean);
  let total = 0, cur = 0, found = false, best = 0;
  const flush = () => { total += cur; cur = 0; };
  for (let raw of toks) {
    const w = raw.replace(/[.,!?;:]+$/, '');
    if (/^\d+(\.\d+)?$/.test(w)) { cur += +w; found = true; continue; }
    const mk = w.match(/^(\d+(?:\.\d+)?)(k|ming|mln|млн)$/); if (mk) { cur += +mk[1] * VMUL[mk[2]]; found = true; flush(); continue; }
    if (w === 'полтора' || w === 'полторы') { cur += 1.5; found = true; continue; }
    if (w in VNUM) { cur += VNUM[w]; found = true; continue; }
    if (w in VHALF) { cur += cur ? 0.5 : 0.5; found = true; continue; }
    if (w in VMUL) { const m = VMUL[w]; if (m === 100) cur = (cur || 1) * 100; else { cur = (cur || 1) * m; flush(); } found = true; continue; }
    if (found && (total + cur) > best) best = total + cur;  // son tugadi
    if (found) { total = 0; cur = 0; found = false; }
  }
  return Math.max(best, total + cur);
}

/* matndan kategoriya, tur va izohni topiş */
const VKEY = [
  ['income', /(maoş|maosh|oylik|ish ?haqi|avans|tuşdi|tushdi|keldi|daromad|зарплат|аванс|пришл|доход|маош|ойлик|salary|income)/i],
  ['c_food', /(bozor|бозор|ovqat|oziq|non|göşt|gosht|meva|sabzavot|korzinka|makro|havas|базар|продукт|еда|хлеб|мясо|овқат|нон|гўшт|groceries|food)/i],
  ['c_transport', /(taksi|taxi|yandex|benzin|metan|propan|avtobus|metro|yöl kira|yo'l kira|такси|бензин|метро|автобус|транспорт|taksi|ёқилғи|fuel|bus)/i],
  ['c_cafe', /(kafe|cafe|restoran|\bosh\b|lavaş|lavash|kofe|choy|кафе|ресторан|кофе|ош|coffee)/i],
  ['c_utility', /(svet|elektr|gaz|suv|kommunal|internet|telefon|свет|газ|вода|коммунал|интернет|свет|сув|электр|utility|internet)/i],
  ['c_health', /(dori|apteka|dorixona|vrach|shifokor|klinika|аптек|лекарств|врач|дори|клиник|pharmacy|doctor)/i],
  ['c_clothes', /(kiyim|oyoq kiyim|ko'ylak|şim|shim|одежд|обув|кийим|clothes|shoes)/i],
  ['c_kids', /(bola|farzand|maktab|bog'ça|bogcha|детск|школ|сад|бола|kids|school)/i],
  ['c_gifts', /(sovğa|sovga|tug'ilgan kun|töy|toy|подар|той|совға|gift)/i],
  ['c_home', /(uy|remont|mebel|ремонт|мебел|ijara|аренд|rent)/i],
];
function parseSpoken(text) {
  const res = { tur: 'x', amt: '', c: '', n: '' };
  const v = parseSpokenAmount(text); if (v > 0) res.amt = String(Math.round(v));
  for (const [k, re] of VKEY) if (re.test(text)) { if (k === 'income') { res.tur = 'd'; res.c = (live(DB.cats).find(c => c.k === 'salary') || {}).id || 'c_salary'; break; } else if (!res.c) res.c = catById(k) ? k : ''; }
  // izoh: raqam va son sözlaridan tozalangan matn
  const note = String(text).replace(/\d[\d\s.,]*/g, ' ').split(/\s+/).filter(w => w && !(w.toLowerCase() in VNUM) && !(w.toLowerCase() in VMUL) && !(w.toLowerCase() in VHALF) && !/^(söm|so'm|som|сўм|сум|сумов|суммы|uzs|ga|га|uchun|учун|за|на|полтора|полторы)$/i.test(w)).join(' ').trim();
  res.n = note.slice(0, 80);
  return res;
}

const VLANG = () => ({ uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' })[L()] || 'uz-UZ';
async function voiceListen() {
  const SR = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SpeechRecognition;
  if (Platform.native && SR) {
    try {
      const av = await SR.available(); if (!av || !av.available) throw new Error('na');
      const p = await SR.checkPermissions(); if (!p || p.speechRecognition !== 'granted') { const r = await SR.requestPermissions(); if (!r || r.speechRecognition !== 'granted') { toast(t('v_perm'), 'bd'); return null; } }
      const r = await SR.start({ language: VLANG(), maxResults: 3, prompt: t('v_prompt'), popup: true, partialResults: false });
      return (r && r.matches && r.matches[0]) || null;
    } catch (e) { if (String(e && e.message).includes('na')) { toast(t('v_na'), 'bd'); return null; } return null; }
  }
  const W_SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!W_SR) { toast(t('v_na'), 'bd'); return null; }
  return await new Promise(res => {
    const r = new W_SR(); r.lang = VLANG(); r.interimResults = false; r.maxAlternatives = 3; let done = false;
    modal(`${mhead('🎤 ' + t('v_title'))}<div class="mb" style="text-align:center"><div class="vpulse">${ic('mic')}</div><b>${t('v_prompt')}</b><div class="small muted">${t('v_ex')}</div></div><div class="mf"><button class="btn alt" data-close>${t('cancel')}</button></div>`);
    r.onresult = e => { done = true; closeModal(); res(e.results[0][0].transcript); };
    r.onerror = () => { if (!done) { done = true; closeModal(); res(null); } };
    r.onend = () => { if (!done) { done = true; closeModal(); res(null); } };
    try { r.start(); } catch (_) { res(null); }
  });
}
async function voiceAdd() {
  const txt = await voiceListen(); if (!txt) return;
  const p = parseSpoken(txt);
  openTx(null, { tur: p.tur, amt: p.amt, c: p.c, n: p.n });
  toast(`🎤 «${txt}»`);
}
document.addEventListener('click', e => { const x = e.target.closest('[data-act="voice"]'); if (x) { closeModal(); voiceAdd(); } });
