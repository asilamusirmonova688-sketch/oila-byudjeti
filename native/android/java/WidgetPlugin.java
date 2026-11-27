package uz.oilabyudjeti.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;

/** Ilova (JS) -> vidjet: maʼlumotlarni saqlaş va vidjetni yangilaş */
@CapacitorPlugin(name = "Widget")
public class WidgetPlugin extends Plugin {
    @PluginMethod
    public void update(PluginCall call) {
        String json = call.getString("json", "{}");
        Context c = getContext();
        SharedPreferences p = c.getSharedPreferences(BudgetWidget.PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor e = p.edit().putString("data", json);
        try {
            JSONObject d = new JSONObject(json);
            long ts = d.optLong("hid_ts", 0);
            if (ts >= p.getLong("hid_ts", 0)) e.putBoolean("hid", d.optBoolean("hid", false)).putLong("hid_ts", ts);
        } catch (Exception ignored) { }
        e.apply();
        BudgetWidget.updateAll(c);
        call.resolve();
    }

    @PluginMethod
    public void get(PluginCall call) {
        SharedPreferences p = getContext().getSharedPreferences(BudgetWidget.PREFS, Context.MODE_PRIVATE);
        JSObject r = new JSObject();
        r.put("hid", p.getBoolean("hid", false));
        r.put("hid_ts", p.getLong("hid_ts", 0));
        call.resolve(r);
    }
}
