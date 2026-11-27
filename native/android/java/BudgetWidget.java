package uz.oilabyudjeti.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.View;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;

/** Bosh ekran vidjetlari uçun umumiy mantiq */
public class BudgetWidget extends AppWidgetProvider {
    static final String PREFS = "ob_widget";
    static final String EYE = "uz.oilabyudjeti.app.WIDGET_EYE";
    static final String MASK = "•••••";

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        updateAll(c);
    }

    @Override
    public void onReceive(Context c, Intent i) {
        super.onReceive(c, i);
        if (EYE.equals(i.getAction())) {
            SharedPreferences p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            p.edit().putBoolean("hid", !p.getBoolean("hid", false)).putLong("hid_ts", System.currentTimeMillis()).apply();
            updateAll(c);
        }
    }

    static void updateAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        for (Class<?> cls : new Class<?>[] { WidgetSmall.class, WidgetMedium.class }) {
            int[] ids = m.getAppWidgetIds(new ComponentName(c, cls));
            if (ids == null) continue;
            for (int id : ids) {
                try { m.updateAppWidget(id, build(c, cls)); } catch (Exception ignored) { }
            }
        }
    }

    private static JSONObject data(SharedPreferences p) {
        try { return new JSONObject(p.getString("data", "{}")); } catch (Exception e) { return new JSONObject(); }
    }

    private static PendingIntent open(Context c, String action, int code) {
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("oilabyudjeti://w/" + action));
        i.setClass(c, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static RemoteViews build(Context c, Class<?> cls) {
        boolean med = cls == WidgetMedium.class;
        int base = med ? 200 : 100;
        SharedPreferences p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        JSONObject d = data(p);
        JSONObject L = d.optJSONObject("L");
        if (L == null) L = new JSONObject();
        boolean dark = d.optBoolean("dark", false);
        boolean hid = p.getBoolean("hid", false);
        boolean lock = d.optBoolean("lock", false);
        boolean has = d.has("bal");
        int ink = dark ? 0xFFEAF0FA : 0xFF0F172A;
        int muted = dark ? 0xFF93A0BA : 0xFF64748B;

        RemoteViews v = new RemoteViews(c.getPackageName(), med ? R.layout.widget_medium : R.layout.widget_small);
        v.setInt(R.id.wg_root, "setBackgroundResource", dark ? R.drawable.wg_bg_dark : R.drawable.wg_bg_light);
        v.setTextViewText(R.id.wg_lbl, L.optString("bal", "Oila byudjeti"));
        v.setTextColor(R.id.wg_lbl, muted);
        v.setTextViewText(R.id.wg_bal, !has ? L.optString("open", "—") : hid ? MASK : d.optString("bal"));
        v.setTextColor(R.id.wg_bal, ink);
        v.setImageViewResource(R.id.wg_eye, hid ? R.drawable.wg_eye_off : R.drawable.wg_eye);
        v.setInt(R.id.wg_eye, "setColorFilter", muted);
        v.setViewVisibility(R.id.wg_eye, has ? View.VISIBLE : View.GONE);

        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        String spent = today.equals(d.optString("day")) ? d.optString("today") : d.optString("zero");
        v.setTextViewText(R.id.wg_today, has ? L.optString("today", "") + ": " + (hid ? MASK : spent) : "");
        v.setTextColor(R.id.wg_today, muted);

        v.setOnClickPendingIntent(R.id.wg_root, open(c, "open", base + 1));
        if (hid && lock) {
            v.setOnClickPendingIntent(R.id.wg_eye, open(c, "eye", base + 2));
        } else {
            Intent e = new Intent(c, cls);
            e.setAction(EYE);
            v.setOnClickPendingIntent(R.id.wg_eye, PendingIntent.getBroadcast(c, base + 3, e, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        }

        if (med) {
            int col;
            String rc = d.optString("remCol", "good");
            if ("bad".equals(rc)) col = 0xFFE2475A; else if ("warn".equals(rc)) col = 0xFFE0901A; else col = 0xFF12A37A;
            String rem = d.optBoolean("plan", false) ? L.optString("rem", "") + ": " + (hid ? MASK : d.optString("rem")) : L.optString("noinc", "");
            v.setTextViewText(R.id.wg_rem, has ? rem : "");
            v.setTextColor(R.id.wg_rem, d.optBoolean("plan", false) ? col : muted);
            String kid = d.optString("kid", "");
            v.setTextViewText(R.id.wg_kid, kid);
            v.setViewVisibility(R.id.wg_kid, kid.length() > 0 ? View.VISIBLE : View.GONE);
            v.setTextColor(R.id.wg_kid, ink);
            v.setOnClickPendingIntent(R.id.wg_kid, open(c, "kid", base + 4));
            v.setTextViewText(R.id.wg_add, L.optString("add", "+"));
            v.setTextViewText(R.id.wg_voice, L.optString("voice", "🎤"));
            v.setTextViewText(R.id.wg_shop, L.optString("shop", "🧺"));
            int alt = dark ? R.drawable.wg_btn_alt_dark : R.drawable.wg_btn_alt;
            v.setInt(R.id.wg_voice, "setBackgroundResource", alt);
            v.setInt(R.id.wg_shop, "setBackgroundResource", alt);
            v.setTextColor(R.id.wg_voice, dark ? 0xFF4FD1A5 : 0xFF0B7A5A);
            v.setTextColor(R.id.wg_shop, dark ? 0xFF4FD1A5 : 0xFF0B7A5A);
            v.setOnClickPendingIntent(R.id.wg_add, open(c, "add", base + 5));
            v.setOnClickPendingIntent(R.id.wg_voice, open(c, "voice", base + 6));
            v.setOnClickPendingIntent(R.id.wg_shop, open(c, "shop", base + 7));
        }
        return v;
    }
}
