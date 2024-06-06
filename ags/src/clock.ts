import CenterPanel from "./centerpanel";
import Weather from "./services/weather";
import { Separator } from "./separator";

const current_time = Variable("Xxx --.--:--", {
  poll: [1000, ["date", "+%b%e.%H:%M"]],
});

const paneShown = Variable(false);

export default function() {
  const pane = CenterPanel(0);
  pane.hide();
  return Widget.Button({
    class_name: "centerpanebutn",
    on_clicked: () => {
      const val = paneShown.value;
      if (val) {
        pane.hide();
      } else {
        pane.show();
      }
      paneShown.setValue(!val);
    },
    child: Widget.Box({
      children: [
        Widget.Label({
          class_name: "weather-icon-small",
          label: Weather.bind("realtime").as((data) => {
            let icon = Weather.getIcon().icon;
            if (data === undefined) {
              return `${icon} --\u00B0C`;
            } else {
              return `${icon} ${data.current.temp_c}\u00B0C`;
            }
          }),
          tooltip_text: Weather.bind("realtime").as(() => Weather.getIcon().description),
        }),
        Separator(),
        Widget.Label({
          class_name: "clock",
          label: current_time.bind(),
        }),
      ],
    }),
  });
}
