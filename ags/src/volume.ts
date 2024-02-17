import Gtk from "gi://Gtk?version=3.0";
import { Stream } from "resource:///com/github/Aylur/ags/service/audio.js";

const audio = await Service.import("audio");

function get_vol_icon(speaker: Stream): string {
  if (speaker?.is_muted ?? true) {
    return `\udb81\udd81`;
  }
  const vol = (speaker?.volume ?? 0) * 100;
  const icon_list: [number, string][] = [
    [101, `\udb81\udf5d`],
    [67, `\udb81\udd7e`],
    [34, `\udb81\udd80`],
    [5, `\udb81\udd7f`],
    [0, `\udb83\ude08`],
  ];
  const icon = icon_list.find(([thres, _]) => thres <= vol)?.[1];
  return icon ?? `\udb83\ude08`;
}

export function VolumeIcon() {
  const icon = Widget.Label({
    valign: Gtk.Align.CENTER,
    label: audio.bind("speaker").as(s => get_vol_icon(s)),
    tooltip_text: audio.bind("speaker").as(s => `Volume ${Math.floor((s?.volume ?? 0) * 100)}%`)
  })
  return Widget.Box({
    className: "volume",
    valign: Gtk.Align.CENTER,
    child: icon,
  });
}
