import Gtk from "gi://Gtk?version=3.0";

const battery = await Service.import("battery");
const class_set = ["charging", "high", "mid", "low"];

function clean_added_class(ctx: Gtk.StyleContext) {
  class_set.forEach((cls) => {
    if (ctx.has_class(cls)) {
      ctx.remove_class(cls);
    }
  });
}

function bat_hook(widget: { class_name: String }) {
  if (battery.charging) {
    widget.class_name = "charging";
  } else if (battery.percent >= 75) {
    widget.class_name = "high";
  } else if (battery.percent >= 25) {
    widget.class_name = "mid";
  } else {
    widget.class_name = "low";
  }
}

export default function() {
  return Widget.Box({
    className: "battery",
    vertical: false,
    spacing: 5,
    tooltipText: battery.bind("percent").as(p => `Battery: ${p}%`),
    children: [
      Widget.Label({
        valign: Gtk.Align.CENTER,
        label: "\udb85\udc0b",
        setup: self => bat_hook(self),
      }),
      Widget.ProgressBar({
        valign: Gtk.Align.CENTER,
        vertical: false,
        value: battery.bind("percent").as(p => p > 0 ? p / 100 : 0),
        setup: self => bat_hook(self),
      }),
    ],
  });
}

