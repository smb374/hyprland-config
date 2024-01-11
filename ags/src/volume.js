import Gtk from "../node_modules/@girs/gtk-3.0/gtk-3.0.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
function getVolIcon() {
    if (!Audio.speaker) {
        return `\udb81\udf5f`;
    }
    if (Audio.speaker.stream.is_muted) {
        return `\udb81\udd81`;
    }
    const vol = Audio.speaker.volume * 100;
    const icon_list = [
        [101, `\udb81\udf5d`],
        [67, `\udb81\udd7e`],
        [34, `\udb81\udd80`],
        [5, `\udb81\udd7f`],
        [0, `\udb83\ude08`],
    ];
    const icon = icon_list.find(([threshold, _]) => threshold <= vol) || [0, `\udb83\ude08`];
    return icon[1];
}
export function VolumeIcon() {
    return Widget.Box({
        class_name: "volume",
        valign: Gtk.Align.CENTER,
        child: Widget.Label({
            valign: Gtk.Align.CENTER,
            label: getVolIcon(),
            connections: [
                [Audio, self => {
                        self.set_label(getVolIcon());
                        self.set_tooltip_text(`Volume ${Math.floor((Audio.speaker?.volume || 0) * 100)}%`);
                    }, "speaker-changed"],
            ],
        }),
    });
}
