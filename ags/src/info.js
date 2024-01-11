import Battery from "./battery.js";
import { VolumeIcon } from "./volume.js";
import { BrightnessIcon } from "./brightness.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
function Separator() {
    return Widget.Label({
        label: `\uf444`,
        class_name: "separator",
    });
}
export default function () {
    return Widget.Box({
        class_name: "info",
        spacing: 5,
        children: [
            Battery(),
            Separator(),
            VolumeIcon(),
            BrightnessIcon(),
        ]
    });
}
