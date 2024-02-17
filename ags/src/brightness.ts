import Gtk from "gi://Gtk?version=3.0";

class BrightnessService extends Service {
  // every subclass of GObject.Object has to register itself
  static {
    // takes three arguments
    // the class itself
    // an object defining the signals
    // an object defining its properties
    Service.register(
      this,
      {
        // 'name-of-signal': [type as a string from GObject.TYPE_<type>],
        'screen-changed': ['float'],
      },
      {
        // 'kebab-cased-name': [type as a string from GObject.TYPE_<type>, 'r' | 'w' | 'rw']
        // 'r' means readable
        // 'w' means writable
        // guess what 'rw' means
        'screen-value': ['float', 'rw'],
      },
    );
  }

  // this Service assumes only one device with backlight
  #interface = Utils.exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");

  // # prefix means private in JS
  #screenValue = 0;
  #max = Number(Utils.exec('brightnessctl max'));

  // the getter has to be in snake_case
  get screen_value() {
    return this.#screenValue;
  }

  get max() {
    return this.#max;
  }

  // the setter has to be in snake_case too
  set screen_value(percent) {
    if (percent < 0)
      percent = 0;

    if (percent > 1)
      percent = 1;

    Utils.execAsync(`brightnessctl set ${percent * 100}% -q`);
    // the file monitor will handle the rest
  }

  constructor() {
    super();

    // setup monitor
    const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
    Utils.monitorFile(brightness, () => this.#onChange());

    // initialize
    this.#onChange();
  }

  #onChange() {
    this.#screenValue = Number(Utils.exec('brightnessctl get')) / this.#max;

    // signals have to be explicity emitted
    this.emit('changed'); // emits "changed"
    this.notify('screen-value'); // emits "notify::screen-value"

    // or use Service.changed(propName: string) which does the above two
    // this.changed('screen-value');

    // emit screen-changed with the percent as a parameter
    this.emit('screen-changed', this.#screenValue);
  }

  // overwriting the connect method, let's you
  // change the default event that widgets connect to
  connect(event = 'screen-changed', callback) {
    return super.connect(event, callback);
  }
}

// the singleton instance
const brightness = new BrightnessService;

function get_icon(val: number): string {
  if (val === 0) {
    return `\udb80\udcde`;
  }
  const icon_list: [number, string][] = [
    [67, `\udb80\udce0`],
    [34, `\udb80\udcdf`],
    [0, `\udb80\udcde`],
  ];
  const icon = icon_list.find(([threshold]) => threshold <= val)?.[1];
  return icon || `\udb80\udcde`;
}


export function BrightnessIcon() {
  return Widget.Box({
    class_name: "brightness",
    valign: Gtk.Align.CENTER,
    child: Widget.Label({
      valign: Gtk.Align.CENTER,
      label: brightness.bind("screen_value").as(v => get_icon((v ?? 0) * 100)),
      tooltip_text: brightness.bind("screen_value").as(v => `Brightness ${(v ?? 0) * 100}%`),
    })
  });
}
