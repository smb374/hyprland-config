import Clock from "./clock";
import Info from "./info";
import Workspace from "./workspace";
import Systray from "./systray";
import Gtk from "gi://Gtk?version=3.0";

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
    Systray(),
  ],
  spacing: 5,
});

const Bar = (monitor: number) => Widget.Window({
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

Utils.exec(`sassc ${scss} ${css}`);

// exporting the config so ags can manage the windows
export default {
  style: css,
  windows: [
    Bar(0),
  ],
};
