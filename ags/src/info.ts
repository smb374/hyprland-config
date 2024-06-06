import Battery from "./battery";
import { VolumeIcon } from "./volume";
import { BrightnessIcon } from "./brightness";
import { Separator } from "./separator";

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

