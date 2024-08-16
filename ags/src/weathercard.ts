import Weather from "./services/weather";

function round2digits(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function weatherIcon() {
  return Widget.Box({
    spacing: 10,
    children: [
      Widget.Label({
        class_name: "weather-label",
        label: Weather.bind("realtime").as((_) => `${Weather.getIcon().icon}`),
      }),
      Widget.Box({
        vertical: true,
        children: [
          Widget.Label({
            class_name: "weather-info-city",
            hpack: "start",
            label: Weather.bind("realtime").as((data) => {
              if (data === undefined) {
                return "Unknown";
              } else {
                return `${data.location.name}, ${data.location.country}`;
              }
            }),
          }),
          Widget.Label({
            class_name: "weather-info-cond",
            hpack: "start",
            label: Weather.bind("realtime").as((data) => {
              if (data === undefined) {
                return "Unknown";
              } else {
                return `${data.current.condition.text}`;
              }
            }),
          }),
        ],
      }),
    ],
  });
}

function weatherInfoLeft() {
  return Widget.Box({
    vertical: true,
    hexpand: true,
    children: [
      Widget.Label({
        class_name: "weather-info-text",
        hpack: "start",
        label: Weather.bind("realtime").as((data) => {
          if (data === undefined) {
            return "\udb81\udd0f --\u00B0C";
          } else {
            return `\udb81\udd0f ${data.current.temp_c}\u00B0C`;
          }
        }),
      }),
      Widget.Label({
        class_name: "weather-info-text",
        hpack: "start",
        label: Weather.bind("realtime").as((data) => {
          if (data === undefined) {
            return "\udb80\udf93 --mBar";
          } else {
            return `\udb80\udf93 ${data.current.pressure_mb}mBar`;
          }
        }),
      }),
      Widget.Label({
        class_name: "weather-info-text",
        hpack: "start",
        label: Weather.bind("realtime").as((data) => {
          if (data === undefined) {
            return "\udb85\uddfa --";
          } else {
            return `\udb85\uddfa ${data.current.wind_kph}km/h, ${data.current.wind_dir}`;
          }
        }),
      }),
    ],
  });
}

function weatherInfoRight() {
  return Widget.Box({
    vertical: true,
    hexpand: true,
    children: [
      Widget.Label({
        class_name: "weather-info-text",
        hpack: "start",
        label: Weather.bind("realtime").as((data) => {
          if (data === undefined) {
            return "\udb81\udd8e --%";
          } else {
            return `\udb81\udd8e ${data.current.humidity}%`;
          }
        }),
      }),
      Widget.Label({
        class_name: "weather-info-text",
        hpack: "start",
        label: Weather.bind("realtime").as((data) => {
          if (data === undefined) {
            return "\udb80\uddab --mm";
          } else {
            return `\udb80\uddab ${round2digits(data.current.precip_mm)}mm`;
          }
        }),
      }),
    ],
  });
}

function weatherInfo() {
  return Widget.Box({
    hexpand: true,
    children: [
      weatherInfoLeft(),
      weatherInfoRight(),
    ],
  });
}

export function WeatherCard() {
  return Widget.Box({
    class_name: "weather-card",
    vertical: true,
    hexpand: true,
    vexpand: true,
    spacing: 10,
    children: [
      weatherIcon(),
      weatherInfo(),
    ],
  });
}
