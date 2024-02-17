const systemtray = await Service.import("systemtray");

export default function() {
  return Widget.Box({
    class_name: "tray",
    children: systemtray.bind("items").as(i => i.map(item => Widget.Button({
      child: Widget.Icon().bind("icon", item, "icon"),
      tooltip_markup: item.bind("tooltip_markup"),
      on_primary_click: (_, event) => item.activate(event),
      on_secondary_click: (_, event) => item.openMenu(event),
    }))),
  });
}
