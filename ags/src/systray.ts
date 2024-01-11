import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";

export default function SysTray() {
  return Widget.Box({
    class_name: "tray",
    connections: [
      [SystemTray, self => {
        self.children = SystemTray.items.map(item => Widget.Button({
          child: Widget.Icon({ binds: [["icon", item, "icon"]] }),
          on_primary_click: (_, event) => item.activate(event),
          on_secondary_click: (_, event) => item.openMenu(event),
          binds: [["tooltip-markup", item, "tooltip-markup"]],
        }));
      }],
    ],
  });
}
