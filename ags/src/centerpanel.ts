import Music from "./music";
import { WeatherCard } from "./weathercard";

export default function(monitor: number) {
  const calendar = Widget.Calendar({
    class_name: "calendar",
    vpack: "end",
  });
  let left = Widget.Box({
    vertical: true,
    vpack: "fill",
    spacing: 5,
    children: [
      Widget.Box({
        vexpand: true,
        child: WeatherCard(),
      }),
      calendar,
    ],
  });
  return Widget.Window({
    name: `centerpanel-${monitor}`,
    class_name: "centerpanel",
    monitor,
    anchor: ["top"],
    exclusivity: "ignore",
    margins: [60, 0, 0, 0],
    child: Widget.Box({
      class_name: "centerpanelbox",
      spacing: 5,
      children: [
        left,
        Music(),
      ],
    }),
  });
}
