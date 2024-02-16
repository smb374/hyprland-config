const systemtray = await Service.import("systemtray");

export default function() {
  return Widget.Box({
    className: "tray",
    children: systemtray.bind("items").as(i => i.map(item => Widget.Button({
      child: Widget.Icon().bind("icon", item, "icon"),
      tooltipMarkup: item.bind("tooltip_markup"),
      onPrimaryClick: (_, event) => item.activate(event),
      onSecondaryClick: (_, event) => item.openMenu(event),
    }))),
  });
}
