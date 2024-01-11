import App from "resource:///com/github/Aylur/ags/app.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
import { exec, execAsync, interval } from "resource:///com/github/Aylur/ags/utils.js";
import Gtk from "../node_modules/@girs/gtk-3.0/gtk-3.0.js";
const maxBrightness = parseFloat(exec(`brightnessctl m`)) || 0;
const brightness = Variable(0, {
    listen: [App.configDir + "/scripts/brightness.sh", v => parseFloat(v) || 0],
});
interval(250, () => execAsync(`brightnessctl g`).then(v => brightness.setValue(parseFloat(v) || 0)));
function getBrightnessIcon(val) {
    if (val == 0 || maxBrightness == 0) {
        return `\udb80\udcde`;
    }
    const curr = val / maxBrightness * 100.0;
    const icon_list = [
        [67, `\udb80\udce0`],
        [34, `\udb80\udcdf`],
        [0, `\udb80\udcde`],
    ];
    const icon = icon_list.find(([threshold]) => threshold <= curr) || [0, `\udb80\udcde`];
    return icon[1];
}
export function BrightnessIcon() {
    return Widget.Box({
        class_name: "brightness",
        valign: Gtk.Align.CENTER,
        child: Widget.Label({
            valign: Gtk.Align.CENTER,
            label: getBrightnessIcon(0.0),
            tooltip_text: `Brightness 0%`,
            connections: [
                [brightness, self => {
                        self.set_label(getBrightnessIcon(brightness.value));
                        self.set_tooltip_text(`Brightness ${Math.floor(brightness.value / maxBrightness * 100.0)}%`);
                    }],
            ],
        })
    });
}
