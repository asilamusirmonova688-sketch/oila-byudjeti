// Android loyihasini sozlaş: ruxsatlar, versiya, imzo (GitHub Actions içida işlaydi)
const fs = require('fs');
const man = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(man, 'utf8');
for (const p of ['POST_NOTIFICATIONS', 'RECEIVE_BOOT_COMPLETED', 'WAKE_LOCK', 'USE_BIOMETRIC', 'VIBRATE', 'RECORD_AUDIO']) {
  if (!m.includes(`android.permission.${p}"`)) m = m.replace('</manifest>', `    <uses-permission android:name="android.permission.${p}" />\n</manifest>`);
}
// Telegram va boşqa ilovalardan .json faylni «Oila byudjeti bilan oçiş»
if (!m.includes('application/json')) {
  m = m.replace('</intent-filter>', `</intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:scheme="content" />
                <data android:scheme="file" />
                <data android:mimeType="application/json" />
            </intent-filter>`);
}
if (!m.includes('android.speech.RecognitionService')) m = m.replace('<application', `<queries>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n    </queries>\n    <application`);
fs.writeFileSync(man, m);

const gr = 'android/app/build.gradle';
let g = fs.readFileSync(gr, 'utf8');
const code = process.env.GITHUB_RUN_NUMBER || '1';
const ver = require('../package.json').version;
g = g.replace(/versionCode\s*=?\s*\d+/, `versionCode ${code}`).replace(/versionName\s*=?\s*"[^"]*"/, `versionName "${ver}"`);
if (!g.includes('signingConfigs {')) {
  g = g.replace(/buildTypes\s*\{/, `signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "release.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias "tugilgankunlar"
            keyPassword System.getenv("KEYSTORE_PASSWORD")
        }
    }
    buildTypes {`);
  g = g.replace(/release\s*\{(\s*)minifyEnabled/, 'release {$1signingConfig signingConfigs.release$1minifyEnabled');
}
fs.writeFileSync(gr, g);
console.log('Android patched: versionCode', code, 'version', ver);

// Bildirişnoma uçun oq hamyon belgisi (assets/notif-<zichlik>.png)
const path = require('path');
for (const d of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
  const f = `assets/notif-${d}.png`; if (!fs.existsSync(f)) continue;
  const to = path.join('android/app/src/main/res', 'drawable-' + d); fs.mkdirSync(to, { recursive: true });
  fs.copyFileSync(f, path.join(to, 'ic_stat_wallet.png'));
}
console.log('Notification icon copied');

// Bosh ekran vidjetlari: Java klasslar, resurslar va manifest
const pkgDir = 'android/app/src/main/java/uz/oilabyudjeti/app';
const copyDir = (from, to) => { if (!fs.existsSync(from)) return; fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) { const s = path.join(from, f), d = path.join(to, f); if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d); } };
copyDir('native/android/java', pkgDir);
copyDir('native/android/res', 'android/app/src/main/res');
let m2 = fs.readFileSync(man, 'utf8');
if (!m2.includes('.WidgetSmall')) {
  const rc = (cls, info, label) => `        <receiver android:name=".${cls}" android:exported="false" android:label="@string/${label}">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/${info}" />
        </receiver>\n`;
  m2 = m2.replace('</application>', rc('WidgetSmall', 'wg_small_info', 'wg_small_n') + rc('WidgetMedium', 'wg_medium_info', 'wg_med_n') + '    </application>');
  fs.writeFileSync(man, m2);
}
console.log('Widgets added');
