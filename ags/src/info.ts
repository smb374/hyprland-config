import Battery from "./battery";
import { VolumeIcon } from "./volume";
import { BrightnessIcon } from "./brightness";

function Separator() {
  return Widget.Label({
    label: `\uf444`,
    class_name: "separator",
  });
}

export default function() {
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

