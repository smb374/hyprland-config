import Mpd from "./services/mpd";

function musicLabels() {
  return Widget.Box({
    vertical: true,
    vpack: "start",
    children: [
      Widget.Scrollable({
        class_name: "music-scroll",
        vscroll: "never",
        hscroll: "automatic",
        child: Widget.Label({
          class_name: "music-title",
          hpack: "start",
          label: Mpd.bind("title"),
        }),
      }),
      Widget.Scrollable({
        class_name: "music-scroll",
        vscroll: "never",
        hscroll: "automatic",
        child: Widget.Label({
          class_name: "music-album",
          hpack: "start",
          label: Mpd.bind("album"),
        }),
      }),
      Widget.Scrollable({
        class_name: "music-scroll",
        vscroll: "never",
        hscroll: "automatic",
        child: Widget.Label({
          class_name: "music-artist",
          hpack: "start",
          label: Mpd.bind("artist"),
        }),
      }),
    ],
  });
}

function musicControl() {
  return Widget.CenterBox({
    class_name: "music-control",
    start_widget: Widget.Button({
      on_clicked: () => Mpd.prevSong(),
      child: Widget.Label({
        class_name: "music-control-butn",
        label: "\udb80\udd41"
      })
    }),
    center_widget: Widget.Button({
      on_clicked: () => Mpd.togglePlaying(),
      child: Widget.Label({
        class_name: "music-control-butn",
        label: Mpd.bind("state").as(state => state.playing ? "\udb80\udfe4" : "\udb81\udc0a")
      })
    }),
    end_widget: Widget.Button({
      on_clicked: () => Mpd.nextSong(),
      child: Widget.Label({
        class_name: "music-control-butn",
        label: "\udb80\udd42"
      })
    }),
  });
}

function musicProgresses() {
  return Widget.Box({
    children: [
      Widget.Label({
        class_name: "music-misc",
        hpack: "start",
        expand: true,
        label: Mpd.bind("elapsed").as(x => `${x}%`),
      }),
      Widget.Label({
        class_name: "music-misc",
        hpack: "end",
        expand: true,
        label: "0/0",
      }).hook(Mpd, self => {
        self.label = `${Mpd.position}/${Mpd.length}`
      }, "status-changed"),
    ],
  });
}

function musicCover() {
  return Widget.Box({
    class_name: "music-art",
    hpack: "center",
    css: Utils.merge([Mpd.bind("cover_path"), Mpd.bind("cover_height")], (path, height) => {
      return `background-image: url('${path}'); min-height: ${height}px`;
    }),
  });
}

export default function() {
  return Widget.Box({
    class_name: "music",
    spacing: 20,
    vertical: true,
    children: [
      musicCover(),
      Widget.Box({
        class_name: "music-info",
        vertical: true,
        children: [
          musicLabels(),
          Widget.Box({
            vertical: true,
            vpack: "end",
            spacing: 10,
            children: [
              musicControl(),
              musicProgresses(),
            ],
          }),
        ],
      }),
    ],
  });
}
