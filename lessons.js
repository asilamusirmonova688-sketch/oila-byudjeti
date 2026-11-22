/* ==========================================================
   Moliyaviy savodxonlik: darslar, testlar va kun maslahatlari
   ========================================================== */
const LESSONS = {
uz: [
{ id: 'budget', e: '🧾', t: 'Byudjet tuziş: 50/30/20 qoidasi', min: 2, body: `
<p>Byudjet — bu pulingiz qayerga ketişini <b>oldindan</b> rejalaştiriş. Eng oson usul — <b>50/30/20</b> qoidasi:</p>
<ul><li><b>50%</b> — zarur xarajatlar: oziq-ovqat, kommunal, transport, ijara, kredit.</li><li><b>30%</b> — xohişlar: kafe, kiyim, köngiloçar, sovğalar.</li><li><b>20%</b> — jamğarma va qarzni oldinroq yopiş.</li></ul>
<div class="ex">Misol: oylik daromad 8 000 000 söm → 4 mln zarur, 2,4 mln xohiş, 1,6 mln jamğarma.</div>
<h4>Qanday boşlaş kerak?</h4>
<ul><li>Bir oy davomida <b>barça</b> xarajatlarni yozib boring — ilovaning özi hisoblab beradi.</li><li>Oy oxirida «Hisobot → 50/30/20» qismini köring.</li><li>Eng köp oşib ketgan kategoriyaga <b>limit</b> qöying.</li></ul>
<p>Foizlar qatʼiy emas: daromad kam bölsa, zarur xarajatlar 60–70% bölişi mumkin. Asosiysi — jamğarma <b>har oy</b> bölsin.</p>`,
 q: [
  { q: '50/30/20 qoidasida 20% nimaga ajratiladi?', a: ['Kafe va dam oliş', 'Jamğarma va qarzlarni yopiş', 'Kommunal tölovlar'], c: 1, x: '20% — kelajak uçun: jamğarma va qarzlarni muddatidan oldin yopiş.' },
  { q: 'Daromad 6 000 000 söm. Qoidaga köra zarur xarajatlarga qança?', a: ['1 200 000 söm', '1 800 000 söm', '3 000 000 söm'], c: 2, x: '6 000 000 × 50% = 3 000 000 söm.' },
  { q: 'Byudjet tuzişni nimadan boşlagan maʼqul?', a: ['Bir oy barça xarajatlarni yozib boriş', 'Darhol kredit oliş', 'Faqat katta xaridlarni yoziş'], c: 0, x: 'Avval pul qayerga ketayotganini aniq biliş kerak — buning uçun hamma xarajatni yozasiz.' },
 ] },
{ id: 'emergency', e: '🛟', t: 'Zaxira jamğarma', min: 2, body: `
<p>Zaxira jamğarma — kutilmagan holatlar uçun alohida pul: kasallik, işsiz qoliş, maşina buzilişi, şoşilinç taʼmir.</p>
<h4>Qança bölişi kerak?</h4>
<p>Tavsiya: <b>3–6 oylik zarur xarajatlar</b> miqdorida. Agar oyiga zarur xarajat 4 mln söm bölsa, zaxira 12–24 mln söm.</p>
<div class="ex">Zaxira bölmasa, kutilmagan xarajat köpinça <b>qimmat qarz</b> yoki mikroqarz bilan yopiladi — bu esa byudjetni uzoq vaqt buzadi.</div>
<h4>Qanday yiğiş kerak?</h4>
<ul><li>Kiçikdan boşlang: avval <b>1 oylik</b> xarajatni yiğing.</li><li>Maoş tuşgan kuniyoq belgilangan summani alohida hamyonga ötkazing.</li><li>Zaxirani kundalik kartadan <b>alohida</b> saqlang — qöl tegmasin.</li><li>Zaxiradan foydalansangiz, keyingi oylarda uni qayta töldiring.</li></ul>`,
 q: [
  { q: 'Zaxira jamğarma nima uçun kerak?', a: ['Yangi telefon oliş uçun', 'Kutilmagan holatlar uçun', 'Qimmatbaho sovğalar uçun'], c: 1, x: 'Zaxira — faqat kutilmagan va zarur holatlar uçun (kasallik, iş yöqotiş, şoşilinç taʼmir).' },
  { q: 'Zarur xarajatlar oyiga 5 mln söm. Tavsiya etilgan zaxira qança?', a: ['1–2 mln söm', '15–30 mln söm', '100 mln söm'], c: 1, x: '3–6 oylik zarur xarajat: 5 × 3 = 15 mln, 5 × 6 = 30 mln söm.' },
  { q: 'Zaxirani qayerda saqlagan maʼqul?', a: ['Kundalik karta bilan birga', 'Alohida hamyon yoki hisobda', 'Döstga qarzga berib'], c: 1, x: 'Alohida saqlansa, uni kundalik xarajatlarga sarflab yuboriş xavfi kam böladi.' },
 ] },
{ id: 'credit', e: '💳', t: 'Kredit va mikroqarz', min: 3, body: `
<p>Kredit — vaqtinça pul emas, <b>qimmat xizmat</b>. Olgan pulingizdan köproq qaytarasiz.</p>
<h4>Nimaga qaraş kerak?</h4>
<ul><li><b>Yillik foiz stavkasi</b> va <b>umumiy qaytariladigan summa</b> — oylik tölov kiçik körinsa ham, uzoq muddatda köp böladi.</li><li>Qöşimça tölovlar: suğurta, xizmat haqi, keçikiş jarimasi.</li><li>Şartnomani imzolaşdan oldin tölov jadvalini oling va öqing.</li></ul>
<div class="ex">Qoida: barça oylik kredit tölovlari daromadning <b>30% idan</b> oşmagani maʼqul. Undan köpi — xavfli yuk.</div>
<h4>Mikroqarz va «tez pul»</h4>
<p>Tez beriladigan qarzlarning foizi odatda ança yuqori. Ulardan faqat juda zarur holatda va qisqa muddatga foydalaning. <b>Bir qarzni yopiş uçun boşqa qarz olmang</b> — bu qarz çuqurining boşlanişi.</p>
<h4>Kredit olişdan oldin özingizga savol bering</h4>
<ul><li>Bu narsa hozir <b>zarurmi</b> yoki kutsa böladimi?</li><li>Jamğarib, keyinroq naqd olsam bölmaydimi?</li><li>Daromadim kamaysa ham tölay olamanmi?</li></ul>`,
 q: [
  { q: 'Kreditni soliştirişda eng muhim körsatkiç qaysi?', a: ['Bankning reklamasi', 'Yillik foiz va umumiy qaytariladigan summa', 'Oylik tölovning kiçikligi'], c: 1, x: 'Oylik tölov kiçik bölsa ham, muddat uzun bölsa umumiy summa juda katta böladi.' },
  { q: 'Daromad 7 mln söm. Barça kredit tölovlari tavsiya böyiça oyiga qançadan oşmasin?', a: ['2,1 mln söm', '4 mln söm', '5,5 mln söm'], c: 0, x: '7 mln × 30% = 2,1 mln söm.' },
  { q: 'Bir qarzni yopiş uçun boşqa qarz oliş — bu…', a: ['Aqlli usul', 'Qarz çuquriga tuşiş xavfi', 'Bankka foydali, sizga ham'], c: 1, x: 'Qarz ustiga qarz foizlarni köpaytiradi va çiqiş qiyinlaşadi.' },
 ] },
{ id: 'inflation', e: '📉', t: 'Inflyatsiya: pul nega qadrsizlanadi', min: 2, body: `
<p>Inflyatsiya — narxlarning umumiy ösişi. Narxlar ösganda, xuddi şu pulga <b>kamroq</b> narsa olasiz.</p>
<div class="ex">Misol: inflyatsiya yiliga 10% bölsa, bugun 1 000 000 söm turadigan narsalar bir yildan söng taxminan 1 100 000 söm turadi. «Yostiq ostida» saqlangan 1 mln söm esa qadrini yöqotadi.</div>
<h4>Jamğarmani qanday asraş mumkin?</h4>
<ul><li>Pulni uzoq vaqt <b>naqd holda</b> «ölik» saqlamang.</li><li>Bank omonatining foizi inflyatsiyadan <b>yuqori</b> bölsa, pul real qiymatini saqlaydi.</li><li>Valyutaga ötkazişda kurs farqi va xarajatlarni hisobga oling.</li><li>Narxlarni kuzating: ilovada oydan-oyga xarajatlar qanday özgarayotganini «Hisobot»da köring.</li></ul>`,
 q: [
  { q: 'Inflyatsiya nima?', a: ['Iş haqining ösişi', 'Narxlarning umumiy ösişi', 'Bank foizining tuşişi'], c: 1, x: 'Inflyatsiya — narxlarning umumiy darajasi ösişi, yaʼni pulning xarid quvvati kamayişi.' },
  { q: 'Inflyatsiya 12%, omonat foizi 8%. Pulning real qiymati…', a: ['Ösadi', 'Kamayadi', 'Özgarmaydi'], c: 1, x: 'Foiz inflyatsiyadan past — real qiymat taxminan 4% ga kamayadi.' },
  { q: 'Inflyatsiyadan himoyalanişning eng yaxşi usuli qaysi?', a: ['Pulni uyda naqd saqlaş', 'Foizi inflyatsiyadan yuqori işonçli omonat', 'Hamma pulni darhol sarflaş'], c: 1, x: 'Foizi inflyatsiyadan yuqori bölgan işonçli joyda saqlangan pul qadrini saqlaydi.' },
 ] },
{ id: 'deposit', e: '🏦', t: 'Omonatni qanday tanlaş', min: 2, body: `
<p>Bank omonati — pulni xavfsiz saqlaş va foiz oliş usuli. Banklarni soliştirganda quyidagilarga qarang:</p>
<ul><li><b>Yillik foiz</b> — qançalik yuqori, şunça yaxşi, lekin ğayrioddiy yuqori vaʼdalarga ehtiyot böling.</li><li><b>Muddat</b> — muddatidan oldin yeçsangiz, foiz kamayişi mumkin.</li><li><b>Kapitallaşuv</b> — foizlar har oy omonatga qöşilib, keyingi oy ularga ham foiz hisoblanadi.</li><li><b>Töldiriş va yeçiş</b> imkoniyati.</li><li>Bank <b>litsenziyasi</b> bor-yöqligi — Markaziy bank saytida tekşiriş mumkin.</li></ul>
<div class="ex">Maslahat: zaxira jamğarma uçun — istalgan payt yeçiş mumkin bölgan omonat; uzoq maqsad (uy, maşina) uçun — foizi yuqoriroq muddatli omonat.</div>
<p>Omonatga pul faqat bank filialida yoki bankning <b>rasmiy</b> ilovasida qöyiladi. «Yuqori foiz» vaʼda qilib, şaxsiy kartaga pul söraganlar — firibgarlar.</p>`,
 q: [
  { q: 'Kapitallaşuv nima?', a: ['Foizlarning omonatga qöşilib, ularga ham foiz hisoblanişi', 'Bank kapitalining ösişi', 'Omonatni yopiş'], c: 0, x: 'Kapitallaşuvda foiz ustiga foiz hisoblanadi — pul tezroq ösadi.' },
  { q: 'Zaxira jamğarma uçun qanday omonat qulay?', a: ['5 yillik, yeçib bölmaydigan', 'Istalgan payt yeçiş mumkin bölgan', 'Heç qanday'], c: 1, x: 'Zaxira kutilmaganda kerak böladi, şuning uçun tez yeçiş imkoni muhim.' },
  { q: 'Birov «oyiga 20% foiz» vaʼda qilib, kartasiga pul söramoqda. Bu…', a: ['Yaxşi imkoniyat', 'Firibgarlik belgisi', 'Oddiy bank xizmati'], c: 1, x: 'Haqiqiy banklar şaxsiy kartaga pul söramaydi; ğayrioddiy yuqori foiz — xavf signali.' },
 ] },
{ id: 'fraud', e: '🛡️', t: 'Firibgarlardan himoya', min: 3, body: `
<p>Firibgarlar köpinça <b>şoşiltiriş</b> va <b>qörqitiş</b> bilan işlaydi: «kartangiz bloklandi», «yutuq çiqdi», «qarindoşingiz muammoda».</p>
<h4>Heç qaçon heç kimga aytmang</h4>
<ul><li>Karta raqami va amal qiliş muddati bilan birga <b>CVV</b> (orqasidagi 3 raqam).</li><li><b>SMS-kod</b> — bank xodimiga ham! Haqiqiy bank xodimi kodni sörmaydi.</li><li>Ilova va bank tizimining parollari.</li></ul>
<h4>Xavf belgilari</h4>
<ul><li>«Bank xodimi» qöngiroq qilib, kod yoki ilova örnatişni söraydi.</li><li>Telegramda tanişingiz nomidan «tezda pul ötkazib tur» xabari.</li><li>Notaniş havolalar: «sovğa oling», «kompensatsiya».</li><li>Kafolatlangan juda yuqori daromad vaʼdasi.</li></ul>
<div class="ex">Şubha tuğilsa: qöngiroqni tugating va bankingizga <b>kartaning orqasidagi</b> rasmiy raqam orqali özingiz qöngiroq qiling. Tanişingizga ham boşqa yöl bilan (telefon) qöngiroq qilib tekşiring.</div>`,
 q: [
  { q: '«Bank xodimi» qöngiroq qilib, SMS-kodni sörasa nima qilasiz?', a: ['Aytaman, u bank xodimi-ku', 'Qöngiroqni tugatib, bankka rasmiy raqam orqali özim qöngiroq qilaman', 'Faqat yarmini aytaman'], c: 1, x: 'Haqiqiy bank xodimi heç qaçon SMS-kodni sörmaydi.' },
  { q: 'Qaysi maʼlumotni HEÇ KIMGA aytib bölmaydi?', a: ['Ismingiz', 'Kartaning CVV kodi va SMS-kod', 'Şahringiz'], c: 1, x: 'CVV va SMS-kod bilan firibgar kartangizdan pul yeçişi mumkin.' },
  { q: 'Telegramda döstingiz nomidan pul söraşdi. Töğri yöl?', a: ['Darhol ötkazaman', 'Unga telefon orqali qöngiroq qilib tekşiraman', 'Havolani bosaman'], c: 1, x: 'Akkauntlar buziladi; boşqa kanal orqali tekşiriş — eng işonçli usul.' },
 ] },
{ id: 'habits', e: '🐷', t: 'Jamğariş odatlari', min: 2, body: `
<p>Jamğariş — irodadan köra <b>tizim</b> masalasi. Quyidagi odatlar yordam beradi:</p>
<ul><li><b>Avval özingizga tölang:</b> maoş tuşgan kuniyoq jamğarma qismini ajratib qöying, keyin qolganini sarflang.</li><li><b>48 soat qoidasi:</b> rejada yöq katta xarid uçun ikki kun kuting — köpinça istak ötib ketadi.</li><li><b>Maqsad qöying:</b> «pul yiğiş» emas, «Maşina uçun 50 mln, 2027-yil dekabrgaça». Ilovadagi «Maqsadlar» bunda yordam beradi.</li><li><b>Kiçik xarajatlarni kuzating:</b> kuniga 30 000 söm kafe — oyiga 900 000, yiliga 10 mln dan köp.</li><li><b>Obunalarni tekşiring:</b> foydalanmaydiganlarini öçiring.</li></ul>
<div class="ex">Ilovadagi «Tejaş rejasi» har kuni qança sarflaş mumkinligini körsatadi — undan oşmaslikka harakat qiling.</div>`,
 q: [
  { q: '«Avval özingizga tölang» nimani anglatadi?', a: ['Avval özingizga sovğa oliş', 'Maoş tuşişi bilan jamğarmani ajratiş', 'Qarzlarni kecikib tölaş'], c: 1, x: 'Jamğarma qolgan puldan emas, birinçi navbatda ajratiladi.' },
  { q: 'Kuniga 25 000 söm kafega. Bir oyda (30 kun) qança böladi?', a: ['250 000 söm', '750 000 söm', '2 500 000 söm'], c: 1, x: '25 000 × 30 = 750 000 söm — kiçik xarajatlar yiğilib katta summa böladi.' },
  { q: '48 soat qoidasi nima uçun kerak?', a: ['Rejasiz xaridlarni kamaytiriş uçun', 'Bankka borış uçun', 'Kredit oliş uçun'], c: 0, x: 'Kutiş vaqtida hissiy istak söndi va xarid zarurmi-yöqmi aniq böladi.' },
 ] },
{ id: 'family', e: '👨‍👩‍👧', t: 'Oila va bolalar moliyasi', min: 2, body: `
<p>Oilaviy byudjet — <b>birgalikdagi</b> qaror. Pul haqida oçiq gaplaşiş — janjalning emas, totuvlikning garovi.</p>
<h4>Oilada</h4>
<ul><li>Oyda bir marta birga hisobotni köring: nima köp ketdi, nimani tejaş mumkin.</li><li>Umumiy maqsadlarni birga tanlang: taʼmir, safar, farzand taʼlimi.</li><li>Har bir kişiga kiçik «şaxsiy» summa qoldiring — bu nizolarni kamaytiradi.</li><li>Ilovadagi «Oila bilan ulaşiş» orqali hisobni haftada bir marta birlaştiring.</li></ul>
<h4>Bolalarga pulni örgatiş</h4>
<ul><li>Kiçik «çöntak puli» bering va uni özi boşqarişiga imkon bering.</li><li>Jamğarma idişi: «ikki hafta yiğib, öyinçoq olamiz».</li><li>Dökonda narxlarni birga soliştiring.</li><li>Özingiz misol böling — bolalar gapdan köra harakatdan örganadi.</li></ul>`,
 q: [
  { q: 'Oilaviy hisobotni qançalik tez-tez birga köriş maʼqul?', a: ['Heç qaçon', 'Oyda bir marta', 'Faqat yil oxirida'], c: 1, x: 'Oylik körib çiqiş muammoni erta aniqlaş va birga hal qiliş imkonini beradi.' },
  { q: 'Bolaga pulni örgatişning yaxşi usuli?', a: ['Pul haqida umuman gapirmaslik', 'Kiçik çöntak puli berib, özi boşqarişiga imkon beriş', 'Hamma narsani darhol olib beriş'], c: 1, x: 'Kiçik summani özi boşqarib, bola rejalaş va kutişni örganadi.' },
  { q: 'Oila aʼzolariga kiçik şaxsiy summa qoldiriş…', a: ['Byudjetni buzadi', 'Nizolarni kamaytiradi', 'Taqiqlanadi'], c: 1, x: 'Har kimning özi hisob bermasdan sarflaydigan kiçik summasi bölsa, kelişmovçiliklar kamayadi.' },
 ] },
],

ru: [
{ id: 'budget', e: '🧾', t: 'Бюджет: правило 50/30/20', min: 2, body: `
<p>Бюджет — это <b>заранее</b> спланированное распределение денег. Самый простой способ — правило <b>50/30/20</b>:</p>
<ul><li><b>50%</b> — нужды: продукты, коммунальные, транспорт, аренда, кредит.</li><li><b>30%</b> — желания: кафе, одежда, развлечения, подарки.</li><li><b>20%</b> — накопления и досрочное погашение долгов.</li></ul>
<div class="ex">Пример: доход 8 000 000 сум → 4 млн на нужды, 2,4 млн на желания, 1,6 млн в накопления.</div>
<h4>С чего начать?</h4>
<ul><li>Месяц записывайте <b>все</b> расходы — приложение посчитает само.</li><li>В конце месяца откройте «Отчёт → 50/30/20».</li><li>Поставьте <b>лимит</b> на категорию, где больше всего перерасход.</li></ul>
<p>Проценты не жёсткие: при небольшом доходе нужды могут занимать 60–70%. Главное — откладывать <b>каждый месяц</b>.</p>`,
 q: [
  { q: 'На что идут 20% в правиле 50/30/20?', a: ['Кафе и отдых', 'Накопления и погашение долгов', 'Коммунальные платежи'], c: 1, x: '20% — для будущего: накопления и досрочное погашение долгов.' },
  { q: 'Доход 6 000 000 сум. Сколько по правилу на нужды?', a: ['1 200 000 сум', '1 800 000 сум', '3 000 000 сум'], c: 2, x: '6 000 000 × 50% = 3 000 000 сум.' },
  { q: 'С чего лучше начать составление бюджета?', a: ['Месяц записывать все расходы', 'Сразу взять кредит', 'Записывать только крупные покупки'], c: 0, x: 'Сначала нужно точно знать, куда уходят деньги.' },
 ] },
{ id: 'emergency', e: '🛟', t: 'Подушка безопасности', min: 2, body: `
<p>Подушка безопасности — отдельные деньги на непредвиденное: болезнь, потеря работы, поломка машины, срочный ремонт.</p>
<h4>Сколько нужно?</h4>
<p>Рекомендуется <b>3–6 месяцев обязательных расходов</b>. Если на нужды уходит 4 млн сум в месяц, подушка — 12–24 млн.</p>
<div class="ex">Без подушки непредвиденный расход часто закрывают <b>дорогим долгом</b> или микрозаймом — и бюджет страдает надолго.</div>
<h4>Как накопить?</h4>
<ul><li>Начните с малого: сначала <b>1 месяц</b> расходов.</li><li>В день зарплаты сразу переводите фиксированную сумму в отдельный кошелёк.</li><li>Храните подушку <b>отдельно</b> от повседневной карты.</li><li>Если воспользовались — восполните в следующие месяцы.</li></ul>`,
 q: [
  { q: 'Для чего нужна подушка безопасности?', a: ['Для нового телефона', 'Для непредвиденных ситуаций', 'Для дорогих подарков'], c: 1, x: 'Только для непредвиденных и необходимых трат.' },
  { q: 'Обязательные расходы — 5 млн сум в месяц. Рекомендуемая подушка?', a: ['1–2 млн сум', '15–30 млн сум', '100 млн сум'], c: 1, x: '3–6 месяцев: 5 × 3 = 15 млн, 5 × 6 = 30 млн сум.' },
  { q: 'Где лучше хранить подушку?', a: ['На повседневной карте', 'В отдельном кошельке или на отдельном счёте', 'Одолжить другу'], c: 1, x: 'Отдельно — меньше соблазна потратить на повседневное.' },
 ] },
{ id: 'credit', e: '💳', t: 'Кредиты и микрозаймы', min: 3, body: `
<p>Кредит — не бесплатные деньги, а <b>дорогая услуга</b>. Возвращать придётся больше, чем взяли.</p>
<h4>На что смотреть?</h4>
<ul><li><b>Годовая процентная ставка</b> и <b>общая сумма к возврату</b> — даже небольшой платёж на долгий срок даёт большую переплату.</li><li>Дополнительные платежи: страховка, комиссии, штрафы за просрочку.</li><li>Перед подписанием возьмите и прочитайте график платежей.</li></ul>
<div class="ex">Правило: все ежемесячные платежи по кредитам — не больше <b>30%</b> дохода. Больше — опасная нагрузка.</div>
<h4>Микрозаймы и «быстрые деньги»</h4>
<p>У быстрых займов обычно намного более высокий процент. Пользуйтесь только в крайнем случае и на короткий срок. <b>Не берите новый долг, чтобы закрыть старый</b> — это начало долговой ямы.</p>
<h4>Спросите себя перед кредитом</h4>
<ul><li>Это действительно <b>нужно сейчас</b>?</li><li>Нельзя ли накопить и купить позже?</li><li>Смогу ли платить, если доход снизится?</li></ul>`,
 q: [
  { q: 'Главный показатель при сравнении кредитов?', a: ['Реклама банка', 'Годовая ставка и общая сумма к возврату', 'Маленький ежемесячный платёж'], c: 1, x: 'Маленький платёж на долгий срок может означать огромную переплату.' },
  { q: 'Доход 7 млн сум. Все кредитные платежи желательно не больше…', a: ['2,1 млн сум', '4 млн сум', '5,5 млн сум'], c: 0, x: '7 млн × 30% = 2,1 млн сум.' },
  { q: 'Взять новый долг, чтобы погасить старый, — это…', a: ['Умный ход', 'Риск попасть в долговую яму', 'Выгодно всем'], c: 1, x: 'Долг на долг увеличивает проценты, выбраться всё труднее.' },
 ] },
{ id: 'inflation', e: '📉', t: 'Инфляция: почему деньги дешевеют', min: 2, body: `
<p>Инфляция — общий рост цен. Когда цены растут, на те же деньги можно купить <b>меньше</b>.</p>
<div class="ex">Пример: при инфляции 10% в год то, что сегодня стоит 1 000 000 сум, через год будет стоить около 1 100 000 сум. А 1 млн «под подушкой» теряет ценность.</div>
<h4>Как сохранить накопления?</h4>
<ul><li>Не держите деньги долго <b>наличными</b> без дела.</li><li>Если ставка по вкладу <b>выше</b> инфляции, деньги сохраняют реальную стоимость.</li><li>При покупке валюты учитывайте разницу курсов и комиссии.</li><li>Следите за ценами: в «Отчёте» видно, как меняются расходы от месяца к месяцу.</li></ul>`,
 q: [
  { q: 'Что такое инфляция?', a: ['Рост зарплаты', 'Общий рост цен', 'Снижение ставки банка'], c: 1, x: 'Инфляция — рост общего уровня цен, то есть снижение покупательной силы денег.' },
  { q: 'Инфляция 12%, ставка вклада 8%. Реальная стоимость денег…', a: ['Растёт', 'Снижается', 'Не меняется'], c: 1, x: 'Ставка ниже инфляции — реальная стоимость падает примерно на 4%.' },
  { q: 'Лучший способ защититься от инфляции?', a: ['Хранить наличные дома', 'Надёжный вклад со ставкой выше инфляции', 'Сразу всё потратить'], c: 1, x: 'Деньги в надёжном месте с доходностью выше инфляции сохраняют ценность.' },
 ] },
{ id: 'deposit', e: '🏦', t: 'Как выбрать вклад', min: 2, body: `
<p>Банковский вклад — способ безопасно хранить деньги и получать проценты. При сравнении смотрите:</p>
<ul><li><b>Годовая ставка</b> — чем выше, тем лучше, но остерегайтесь необычно высоких обещаний.</li><li><b>Срок</b> — при досрочном снятии проценты могут уменьшиться.</li><li><b>Капитализация</b> — проценты ежемесячно добавляются к вкладу, и на них тоже начисляются проценты.</li><li>Возможность <b>пополнения и снятия</b>.</li><li>Наличие у банка <b>лицензии</b> — можно проверить на сайте ЦБ.</li></ul>
<div class="ex">Совет: для подушки — вклад с возможностью снятия в любой момент; для долгой цели (жильё, машина) — срочный вклад с более высокой ставкой.</div>
<p>Вклад открывают только в отделении банка или в его <b>официальном</b> приложении. Тот, кто обещает «высокий процент» и просит перевести деньги на личную карту, — мошенник.</p>`,
 q: [
  { q: 'Что такое капитализация?', a: ['Начисление процентов на проценты', 'Рост капитала банка', 'Закрытие вклада'], c: 0, x: 'Проценты добавляются к вкладу, и деньги растут быстрее.' },
  { q: 'Какой вклад подходит для подушки безопасности?', a: ['На 5 лет без снятия', 'С возможностью снять в любой момент', 'Никакой'], c: 1, x: 'Подушка нужна внезапно, поэтому важен быстрый доступ.' },
  { q: 'Человек обещает «20% в месяц» и просит деньги на свою карту. Это…', a: ['Хорошая возможность', 'Признак мошенничества', 'Обычная банковская услуга'], c: 1, x: 'Настоящие банки не просят деньги на личную карту; необычно высокий процент — сигнал опасности.' },
 ] },
{ id: 'fraud', e: '🛡️', t: 'Защита от мошенников', min: 3, body: `
<p>Мошенники давят <b>спешкой</b> и <b>страхом</b>: «карта заблокирована», «вы выиграли», «родственник в беде».</p>
<h4>Никогда никому не сообщайте</h4>
<ul><li><b>CVV</b> (3 цифры на обороте карты) вместе с номером и сроком.</li><li><b>SMS-код</b> — даже «сотруднику банка»! Настоящий сотрудник код не спрашивает.</li><li>Пароли от приложений и банковских систем.</li></ul>
<h4>Признаки опасности</h4>
<ul><li>«Сотрудник банка» звонит и просит код или установить приложение.</li><li>Сообщение в Telegram от имени знакомого: «срочно переведи денег».</li><li>Незнакомые ссылки: «получите подарок», «компенсация».</li><li>Обещание гарантированного очень высокого дохода.</li></ul>
<div class="ex">Если сомневаетесь: положите трубку и сами позвоните в банк по номеру <b>с обратной стороны карты</b>. Знакомому тоже перезвоните по телефону.</div>`,
 q: [
  { q: '«Сотрудник банка» просит SMS-код. Что делать?', a: ['Сказать, он же из банка', 'Положить трубку и самому позвонить в банк по официальному номеру', 'Сказать половину'], c: 1, x: 'Настоящий сотрудник банка никогда не спрашивает SMS-код.' },
  { q: 'Что нельзя сообщать НИКОМУ?', a: ['Ваше имя', 'CVV карты и SMS-код', 'Ваш город'], c: 1, x: 'С CVV и SMS-кодом мошенник может списать деньги с карты.' },
  { q: 'В Telegram от имени друга просят денег. Правильный шаг?', a: ['Сразу перевести', 'Позвонить другу по телефону и проверить', 'Нажать на ссылку'], c: 1, x: 'Аккаунты взламывают; проверка через другой канал — самый надёжный способ.' },
 ] },
{ id: 'habits', e: '🐷', t: 'Привычки накопления', min: 2, body: `
<p>Накопления — вопрос не силы воли, а <b>системы</b>. Помогут привычки:</p>
<ul><li><b>Сначала заплатите себе:</b> в день зарплаты сразу отложите часть, остальное тратьте.</li><li><b>Правило 48 часов:</b> перед незапланированной крупной покупкой подождите два дня — желание часто проходит.</li><li><b>Ставьте цель:</b> не «копить», а «50 млн на машину к декабрю 2027». Поможет раздел «Цели».</li><li><b>Следите за мелочами:</b> 30 000 сум в кафе в день — 900 000 в месяц, больше 10 млн в год.</li><li><b>Проверьте подписки</b> и отключите ненужные.</li></ul>
<div class="ex">«План экономии» в приложении показывает, сколько можно тратить в день, — старайтесь укладываться.</div>`,
 q: [
  { q: 'Что значит «сначала заплатите себе»?', a: ['Сначала купить себе подарок', 'Откладывать сразу после зарплаты', 'Платить долги с опозданием'], c: 1, x: 'Накопления откладывают в первую очередь, а не из остатка.' },
  { q: '25 000 сум в день на кафе. Сколько за месяц (30 дней)?', a: ['250 000 сум', '750 000 сум', '2 500 000 сум'], c: 1, x: '25 000 × 30 = 750 000 сум — мелочи складываются в большие суммы.' },
  { q: 'Зачем правило 48 часов?', a: ['Чтобы сократить спонтанные покупки', 'Чтобы сходить в банк', 'Чтобы взять кредит'], c: 0, x: 'За время ожидания эмоции утихают и становится ясно, нужна ли покупка.' },
 ] },
{ id: 'family', e: '👨‍👩‍👧', t: 'Финансы семьи и детей', min: 2, body: `
<p>Семейный бюджет — <b>совместное</b> решение. Открытый разговор о деньгах — залог согласия, а не ссор.</p>
<h4>В семье</h4>
<ul><li>Раз в месяц вместе смотрите отчёт: на что ушло больше, где можно сэкономить.</li><li>Выбирайте общие цели вместе: ремонт, поездка, образование детей.</li><li>Оставьте каждому небольшую «личную» сумму — это снижает конфликты.</li><li>Объединяйте учёт раз в неделю через «Обмен с семьёй».</li></ul>
<h4>Как учить детей деньгам</h4>
<ul><li>Давайте небольшие карманные деньги и позвольте распоряжаться ими самим.</li><li>Копилка: «копим две недели и покупаем игрушку».</li><li>Сравнивайте цены в магазине вместе.</li><li>Будьте примером — дети учатся по поступкам, а не по словам.</li></ul>`,
 q: [
  { q: 'Как часто стоит вместе смотреть семейный отчёт?', a: ['Никогда', 'Раз в месяц', 'Только в конце года'], c: 1, x: 'Ежемесячный разбор помогает рано заметить проблему и решить её вместе.' },
  { q: 'Хороший способ учить ребёнка деньгам?', a: ['Вообще не говорить о деньгах', 'Давать карманные деньги и позволять распоряжаться ими', 'Сразу покупать всё'], c: 1, x: 'Управляя небольшой суммой, ребёнок учится планировать и ждать.' },
  { q: 'Небольшая личная сумма для каждого члена семьи…', a: ['Ломает бюджет', 'Снижает конфликты', 'Запрещена'], c: 1, x: 'Когда у каждого есть сумма «без отчёта», разногласий меньше.' },
 ] },
],

en: [
{ id: 'budget', e: '🧾', t: 'Budgeting: the 50/30/20 rule', min: 2, body: `
<p>A budget is planning where your money goes <b>in advance</b>. The simplest method is the <b>50/30/20</b> rule:</p>
<ul><li><b>50%</b> — needs: groceries, utilities, transport, rent, loans.</li><li><b>30%</b> — wants: cafés, clothes, entertainment, gifts.</li><li><b>20%</b> — savings and paying debts off early.</li></ul>
<div class="ex">Example: income of 8,000,000 UZS → 4M needs, 2.4M wants, 1.6M savings.</div>
<h4>How to start</h4>
<ul><li>Record <b>all</b> spending for a month — the app does the maths.</li><li>At month end open “Report → 50/30/20”.</li><li>Set a <b>limit</b> on the category that went over the most.</li></ul>
<p>The percentages are flexible: on a small income needs may take 60–70%. What matters is saving <b>every month</b>.</p>`,
 q: [
  { q: 'What is the 20% for in the 50/30/20 rule?', a: ['Cafés and leisure', 'Savings and paying off debts', 'Utility bills'], c: 1, x: '20% is for the future: savings and early debt repayment.' },
  { q: 'Income is 6,000,000 UZS. How much goes to needs?', a: ['1,200,000 UZS', '1,800,000 UZS', '3,000,000 UZS'], c: 2, x: '6,000,000 × 50% = 3,000,000 UZS.' },
  { q: 'What is the best first step in budgeting?', a: ['Track all spending for a month', 'Take a loan right away', 'Record only big purchases'], c: 0, x: 'You first need to know exactly where the money goes.' },
 ] },
{ id: 'emergency', e: '🛟', t: 'Emergency fund', min: 2, body: `
<p>An emergency fund is separate money for the unexpected: illness, job loss, a broken car, urgent repairs.</p>
<h4>How much?</h4>
<p>Aim for <b>3–6 months of essential expenses</b>. If essentials cost 4M UZS a month, the fund is 12–24M.</p>
<div class="ex">Without one, surprises are often covered with <b>expensive debt</b> or micro-loans that hurt the budget for a long time.</div>
<h4>How to build it</h4>
<ul><li>Start small: first save <b>1 month</b> of expenses.</li><li>On payday, move a fixed amount to a separate wallet straight away.</li><li>Keep it <b>apart</b> from your everyday card.</li><li>If you use it, refill it over the next months.</li></ul>`,
 q: [
  { q: 'What is an emergency fund for?', a: ['A new phone', 'Unexpected situations', 'Expensive gifts'], c: 1, x: 'It is only for unexpected, necessary costs.' },
  { q: 'Essential costs are 5M UZS a month. Recommended fund?', a: ['1–2M UZS', '15–30M UZS', '100M UZS'], c: 1, x: '3–6 months: 5 × 3 = 15M, 5 × 6 = 30M UZS.' },
  { q: 'Where should you keep it?', a: ['On your everyday card', 'In a separate wallet or account', 'Lend it to a friend'], c: 1, x: 'Kept apart, it is less likely to be spent on daily things.' },
 ] },
{ id: 'credit', e: '💳', t: 'Loans and micro-loans', min: 3, body: `
<p>A loan is not free money — it is an <b>expensive service</b>. You pay back more than you borrow.</p>
<h4>What to check</h4>
<ul><li>The <b>annual interest rate</b> and the <b>total amount repaid</b> — a small payment over a long term adds up.</li><li>Extra costs: insurance, fees, late-payment penalties.</li><li>Ask for and read the payment schedule before signing.</li></ul>
<div class="ex">Rule of thumb: all monthly loan payments should stay under <b>30%</b> of income. More is a risky burden.</div>
<h4>Micro-loans and “quick cash”</h4>
<p>Fast loans usually carry much higher interest. Use them only in real emergencies and short-term. <b>Never take a new loan to repay an old one</b> — that is how debt spirals start.</p>
<h4>Ask yourself first</h4>
<ul><li>Do I really <b>need it now</b>?</li><li>Could I save and buy it later?</li><li>Could I still pay if my income dropped?</li></ul>`,
 q: [
  { q: 'Most important figure when comparing loans?', a: ['The bank’s advert', 'Annual rate and total amount repaid', 'A small monthly payment'], c: 1, x: 'A small payment over a long term can mean a huge overpayment.' },
  { q: 'Income is 7M UZS. Total loan payments should stay under…', a: ['2.1M UZS', '4M UZS', '5.5M UZS'], c: 0, x: '7M × 30% = 2.1M UZS.' },
  { q: 'Taking a new loan to repay an old one is…', a: ['A smart move', 'A path into a debt spiral', 'Good for everyone'], c: 1, x: 'Debt on debt adds interest and gets harder to escape.' },
 ] },
{ id: 'inflation', e: '📉', t: 'Inflation: why money loses value', min: 2, body: `
<p>Inflation is a general rise in prices. When prices rise, the same money buys <b>less</b>.</p>
<div class="ex">Example: with 10% annual inflation, what costs 1,000,000 UZS today costs about 1,100,000 UZS next year. 1M kept “under the mattress” loses value.</div>
<h4>How to protect savings</h4>
<ul><li>Don’t keep large amounts in <b>cash</b> for a long time.</li><li>If a deposit pays <b>more</b> than inflation, your money keeps its real value.</li><li>When buying foreign currency, consider spreads and fees.</li><li>Watch prices: the Report shows how your spending changes month to month.</li></ul>`,
 q: [
  { q: 'What is inflation?', a: ['Wage growth', 'A general rise in prices', 'A fall in bank rates'], c: 1, x: 'Inflation is a rising price level, i.e. falling purchasing power.' },
  { q: 'Inflation is 12%, the deposit pays 8%. The real value of money…', a: ['Grows', 'Shrinks', 'Stays the same'], c: 1, x: 'The rate is below inflation, so real value drops by roughly 4%.' },
  { q: 'Best protection against inflation?', a: ['Keeping cash at home', 'A reliable deposit paying above inflation', 'Spending everything at once'], c: 1, x: 'Money earning more than inflation in a safe place keeps its value.' },
 ] },
{ id: 'deposit', e: '🏦', t: 'Choosing a savings deposit', min: 2, body: `
<p>A bank deposit keeps money safe and earns interest. When comparing, look at:</p>
<ul><li>The <b>annual rate</b> — higher is better, but be wary of unusually high promises.</li><li>The <b>term</b> — early withdrawal may cut the interest.</li><li><b>Capitalisation</b> — interest is added monthly and then earns interest itself.</li><li>Whether you can <b>top up and withdraw</b>.</li><li>Whether the bank is <b>licensed</b> — check on the Central Bank website.</li></ul>
<div class="ex">Tip: for an emergency fund choose a deposit you can withdraw any time; for long goals (home, car) a fixed-term deposit with a higher rate.</div>
<p>Open deposits only at a bank branch or in the bank’s <b>official</b> app. Anyone promising “high interest” and asking for money on a personal card is a fraudster.</p>`,
 q: [
  { q: 'What is capitalisation?', a: ['Earning interest on interest', 'Growth of the bank’s capital', 'Closing a deposit'], c: 0, x: 'Interest is added to the deposit, so money grows faster.' },
  { q: 'Which deposit suits an emergency fund?', a: ['5 years, no withdrawals', 'One you can withdraw any time', 'None'], c: 1, x: 'Emergencies are sudden, so quick access matters.' },
  { q: 'Someone promises “20% a month” and asks for money on their card. This is…', a: ['A great chance', 'A sign of fraud', 'A normal bank service'], c: 1, x: 'Real banks never ask for money on a personal card; unusually high returns are a red flag.' },
 ] },
{ id: 'fraud', e: '🛡️', t: 'Protecting yourself from fraud', min: 3, body: `
<p>Fraudsters use <b>urgency</b> and <b>fear</b>: “your card is blocked”, “you’ve won”, “a relative is in trouble”.</p>
<h4>Never tell anyone</h4>
<ul><li>Your card <b>CVV</b> (3 digits on the back) together with the number and expiry.</li><li>An <b>SMS code</b> — not even to a “bank employee”! Real staff never ask for it.</li><li>App and online banking passwords.</li></ul>
<h4>Warning signs</h4>
<ul><li>A “bank employee” calls asking for a code or to install an app.</li><li>A Telegram message from a friend’s account: “send money urgently”.</li><li>Unknown links: “claim your gift”, “compensation”.</li><li>Promises of guaranteed, very high returns.</li></ul>
<div class="ex">When in doubt: hang up and call your bank yourself using the number <b>on the back of your card</b>. Call your friend on the phone to check too.</div>`,
 q: [
  { q: 'A “bank employee” asks for your SMS code. What do you do?', a: ['Tell them, they’re from the bank', 'Hang up and call the bank on its official number', 'Tell them half'], c: 1, x: 'Real bank staff never ask for SMS codes.' },
  { q: 'What must you NEVER share?', a: ['Your name', 'Card CVV and SMS codes', 'Your city'], c: 1, x: 'With the CVV and SMS code a fraudster can take money from your card.' },
  { q: 'A friend’s Telegram asks for money. Right move?', a: ['Send it right away', 'Call your friend to check', 'Click the link'], c: 1, x: 'Accounts get hacked; checking through another channel is safest.' },
 ] },
{ id: 'habits', e: '🐷', t: 'Saving habits', min: 2, body: `
<p>Saving is about <b>systems</b>, not willpower. These habits help:</p>
<ul><li><b>Pay yourself first:</b> set savings aside on payday, then spend the rest.</li><li><b>The 48-hour rule:</b> wait two days before an unplanned big purchase — the urge often fades.</li><li><b>Set a goal:</b> not “save money” but “50M for a car by December 2027”. The Goals section helps.</li><li><b>Watch small costs:</b> 30,000 UZS a day at cafés is 900,000 a month, over 10M a year.</li><li><b>Review subscriptions</b> and cancel unused ones.</li></ul>
<div class="ex">The app’s Savings plan shows how much you can spend per day — try to stay within it.</div>`,
 q: [
  { q: 'What does “pay yourself first” mean?', a: ['Buy yourself a gift first', 'Save right after payday', 'Pay debts late'], c: 1, x: 'Savings come first, not from what is left over.' },
  { q: '25,000 UZS a day at cafés. How much in a 30-day month?', a: ['250,000 UZS', '750,000 UZS', '2,500,000 UZS'], c: 1, x: '25,000 × 30 = 750,000 UZS — small costs add up.' },
  { q: 'Why use the 48-hour rule?', a: ['To cut impulse purchases', 'To visit the bank', 'To get a loan'], c: 0, x: 'Waiting lets emotions settle so you can see whether you really need it.' },
 ] },
{ id: 'family', e: '👨‍👩‍👧', t: 'Family and kids’ money', min: 2, body: `
<p>A family budget is a <b>shared</b> decision. Talking openly about money builds harmony, not conflict.</p>
<h4>As a family</h4>
<ul><li>Review the report together once a month: what went up, where to save.</li><li>Choose shared goals together: renovation, a trip, children’s education.</li><li>Give each person a small “personal” amount — it reduces arguments.</li><li>Merge records weekly with “Share with family”.</li></ul>
<h4>Teaching kids about money</h4>
<ul><li>Give small pocket money and let them manage it.</li><li>A savings jar: “we save for two weeks, then buy the toy”.</li><li>Compare prices together in the shop.</li><li>Lead by example — kids learn from actions more than words.</li></ul>`,
 q: [
  { q: 'How often should a family review its report together?', a: ['Never', 'Once a month', 'Only at year end'], c: 1, x: 'A monthly review spots problems early so you can solve them together.' },
  { q: 'A good way to teach a child about money?', a: ['Never talk about money', 'Give pocket money and let them manage it', 'Buy everything at once'], c: 1, x: 'Managing a small amount teaches planning and patience.' },
  { q: 'A small personal amount for each family member…', a: ['Breaks the budget', 'Reduces conflict', 'Is forbidden'], c: 1, x: 'When everyone has a little to spend freely, there are fewer disagreements.' },
 ] },
],
};

const TIPS = {
uz: [
 'Maoş tuşgan kuniyoq jamğarma qismini alohida hamyonga ötkazing — «avval özingizga tölang».',
 'Rejada yöq katta xariddan oldin 48 soat kuting. Köpinça istak ötib ketadi.',
 'Kuniga 30 000 söm kafega — yiliga 10 mln sömdan köp. Kiçik xarajatlarni ham yozib boring.',
 'Zaxira jamğarma — 3–6 oylik zarur xarajat. Hali bölmasa, 1 oylikdan boşlang.',
 'Heç kimga SMS-kod va kartaning CVV kodini aytmang — bank xodimiga ham.',
 'Barça kredit tölovlari daromadning 30% idan oşmasin.',
 'Bozorga röyxat bilan boring — rejasiz xaridlar kamayadi.',
 'Oyda bir marta oila bilan hisobotni birga köring.',
 'Foydalanmaydigan obunalarni (kino, musiqa, internet paketlari) tekşirib, öçiring.',
 'Kommunal xizmatlarni tejaş: ortiqça çiroqlarni öçiring, suvni bekorga oqizmang.',
 'Katta xaridlarda bir neça dökon narxini soliştiring.',
 'Bolalarga kiçik çöntak puli berib, uni özi boşqarişini örgating.',
 'Bir qarzni yopiş uçun boşqa qarz olmang.',
 'Har bir kategoriyaga limit qöyib, 80% ga yetganda xarajatni sekinlaştiring.',
 'Kutilmagan pul (bonus, sovğa) ning kamida yarmini jamğarmaga qöying.',
],
ru: [
 'В день зарплаты сразу переводите часть в накопления — «сначала заплатите себе».',
 'Перед незапланированной крупной покупкой подождите 48 часов. Желание часто проходит.',
 '30 000 сум в день на кафе — больше 10 млн в год. Записывайте и мелкие траты.',
 'Подушка безопасности — 3–6 месяцев обязательных расходов. Начните с одного месяца.',
 'Никому не сообщайте SMS-код и CVV карты — даже «сотруднику банка».',
 'Все платежи по кредитам — не больше 30% дохода.',
 'Ходите на рынок со списком — спонтанных покупок станет меньше.',
 'Раз в месяц смотрите отчёт вместе с семьёй.',
 'Проверьте подписки (кино, музыка, пакеты) и отключите ненужные.',
 'Экономьте на коммунальных: выключайте лишний свет, не оставляйте воду течь.',
 'Перед крупной покупкой сравните цены в нескольких магазинах.',
 'Давайте детям небольшие карманные деньги и учите распоряжаться ими.',
 'Не берите новый долг, чтобы закрыть старый.',
 'Поставьте лимиты на категории и притормозите траты на 80%.',
 'Откладывайте хотя бы половину неожиданных денег (премия, подарок).',
],
en: [
 'On payday move part of your income to savings first — “pay yourself first”.',
 'Wait 48 hours before an unplanned big purchase. The urge often passes.',
 '30,000 UZS a day at cafés is over 10M a year. Track small costs too.',
 'An emergency fund is 3–6 months of essentials. Start with one month.',
 'Never share SMS codes or your card CVV — not even with a “bank employee”.',
 'Keep all loan payments under 30% of income.',
 'Shop with a list — you will make fewer impulse purchases.',
 'Review the report with your family once a month.',
 'Check subscriptions (movies, music, data packages) and cancel unused ones.',
 'Save on utilities: switch off extra lights and don’t leave water running.',
 'Compare prices in several shops before a big purchase.',
 'Give children small pocket money and teach them to manage it.',
 'Never take a new loan to repay an old one.',
 'Set category limits and slow down when you reach 80%.',
 'Save at least half of any unexpected money (bonus, gift).',
],
};
