import Gtk from "gi://Gtk?version=3.0";

const audio = await Service.import("audio");

function getVolIcon(): string {
  if (!audio.speaker) {
    return `\udb81\udf5f`;
  }
  if (audio.speaker?.stream?.is_muted ?? false) {
    return `\udb81\udd81`;
  }
  const vol = audio.speaker.volume * 100;
  const icon_list: [number, string][] = [
    [101, `\udb81\udf5d`],
    [67, `\udb81\udd7e`],
    [34, `\udb81\udd80`],
    [5, `\udb81\udd7f`],
    [0, `\udb83\ude08`],
  ];
  const icon = icon_list.find(([thres, _]) => thres <= vol)?.[1];
  return icon || `\udb83\ude08`;
}

export function VolumeIcon() {
  const icon = Widget.Label({
    valign: Gtk.Align.CENTER,
    label: getVolIcon(),
  }).hook(audio, self => {
    self.set_label(getVolIcon());
    self.set_tooltip_text(`Volume ${Math.floor((audio.speaker?.volume ?? 0) * 100)}%`);
  }, "speaker-changed");
  return Widget.Box({
    className: "volume",
    valign: Gtk.Align.CENTER,
    child: icon,
  });
}
