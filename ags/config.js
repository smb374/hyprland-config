// importing
import App from "resource:///com/github/Aylur/ags/app.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";

import Clock from "./src/clock.js";
import Info from "./src/info.js";
import Workspace from "./src/workspace.js";
import SysTray from "./src/systray.js";
import Gtk from "./node_modules/@girs/gtk-3.0/gtk-3.0.js";

// layout of the bar
const Left = () => Widget.Box({
  class_name: "segment",
  halign: Gtk.Align.START,
  children: [
    Workspace(),
  ],
  spacing: 5,
});

const Center = () => Widget.Box({
  class_name: "segment",
  // halign: Gtk.Align.CENTER,
  children: [
    Clock(),
  ],
  spacing: 5,
});

const Right = () => Widget.Box({
  class_name: "segment",
  halign: Gtk.Align.END,
  children: [
    Info(),
    SysTray(),
  ],
  spacing: 5,
});

const Bar = ({ monitor } = {}) => Widget.Window({
  name: `bar-${monitor}`, // name has to be unique
  class_name: "bar",
  monitor,
  anchor: ["top", "left", "right"],
  exclusivity: "exclusive",
  child: Widget.CenterBox({
    class_name: "container",
    start_widget: Left(),
    center_widget: Center(),
    end_widget: Right(),
  }),
})

const scss = App.configDir + "/style/style.scss";
const css = App.configDir + "/style/style.css";

exec(`sassc ${scss} ${css}`);

// exporting the config so ags can manage the windows
export default {
  style: css,
  windows: [
    Bar(),
  ],
};

