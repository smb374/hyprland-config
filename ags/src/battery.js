import Gtk from "../node_modules/@girs/gtk-3.0/gtk-3.0.js";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
const class_set = ["charging", "high", "mid", "low"];
function clean_added_class(ctx) {
    class_set.forEach((cls) => {
        if (ctx.has_class(cls)) {
            ctx.remove_class(cls);
        }
    });
}
function updateBatClass(widget) {
    const ctx = widget.get_style_context();
    clean_added_class(ctx);
    if (Battery.charging) {
        ctx.add_class("charging");
    }
    else if (Battery.percent >= 75) {
        ctx.add_class("high");
    }
    else if (Battery.percent >= 25) {
        ctx.add_class("mid");
    }
    else {
        ctx.add_class("low");
    }
}
export default function () {
    return Widget.Box({
        class_name: "battery",
        vertical: false,
        spacing: 5,
        binds: [["tooltipText", Battery, "percent", p => `Battery: ${p}%`]],
        children: [
            Widget.Label({
                valign: Gtk.Align.CENTER,
                label: "\udb85\udc0b",
                connections: [[Battery, self => updateBatClass(self)]],
            }),
            Widget.ProgressBar({
                valign: Gtk.Align.CENTER,
                vertical: false,
                value: Math.max(0, Battery.percent) / 100.0,
                binds: [
                    ["value", Battery, "percent",
                        // Shut up TSC.
                        p => Math.max(0, typeof p === "number" ? p : 0) / 100.0
                    ],
                ],
                connections: [[Battery, self => updateBatClass(self)]],
            }),
        ],
    });
}
