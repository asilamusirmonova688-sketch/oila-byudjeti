// Markaziy bank kurslarini olib, www/rates.json ga yozadi (GitHub Actions içida)
const fs = require('fs');
const urls = ['https://cbu.uz/uz/arkhiv-kursov-valyut/json/', 'https://cbu.uz/ru/arkhiv-kursov-valyut/json/', 'https://cbu.uz/oz/arkhiv-kursov-valyut/json/'];
(async () => {
  for (const u of urls) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (oila-byudjeti)', Accept: 'application/json' } });
        const j = await r.json();
        if (Array.isArray(j) && j.length && j.find(x => x.Ccy === 'USD')) {
          fs.writeFileSync('www/rates.json', JSON.stringify({ fetched: new Date().toISOString(), data: j }));
          console.log('Kurslar olindi:', j.length, 'ta valyuta. USD =', j.find(x => x.Ccy === 'USD').Rate, '(' + j[0].Date + ')');
          return;
        }
        console.log('Notöğri javob:', u);
      } catch (e) { console.log('Xato', attempt, u, e.message); await new Promise(r => setTimeout(r, 3000)); }
    }
  }
  console.log('Kurslarni olib bölmadi');
  process.exit(1);
})();
