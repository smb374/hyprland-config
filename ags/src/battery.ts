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

function updateBatClass(widget: Gtk.Widget) {
  const ctx = widget.get_style_context();
  clean_added_class(ctx);
  if (battery.charging) {
    ctx.add_class("charging");
  } else if (battery.percent >= 75) {
    ctx.add_class("high");
  } else if (battery.percent >= 25) {
    ctx.add_class("mid");
  } else {
    ctx.add_class("low");
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
      }).hook(battery, self => updateBatClass(self)),
      Widget.ProgressBar({
        valign: Gtk.Align.CENTER,
        vertical: false,
        value: battery.bind("percent").as(p => p > 0 ? p / 100 : 0),
      }).hook(battery, self => updateBatClass(self)),
    ],
  });
}

