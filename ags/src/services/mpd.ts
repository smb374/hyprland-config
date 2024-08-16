class MpdService extends Service {

  elapsed = 0;
  position = 0;
  length = 0;
  state = {
    playing: false,
    repeat: false,
    random: false,
    single: false,
    consume: false,
  };
  album = "Unknown";
  title = "Unknown";
  artist = "Unknown";
  cover_path = "/home/poyehchen/placeholder.png";
  cover_width = 200;
  cover_height = 200;

  static {
    Service.register(
      this,
      {
        "status-changed": [],
        "song-changed": [],
        "cover-changed": [],
      },
      {
        "elapsed": ["int"],
        "position": ["int"],
        "length": ["int"],
        "state": ["jsobject"],
        "album": ["string"],
        "title": ["string"],
        "artist": ["string"],
        "cover_path": ["string"],
        "cover_width": ["float"],
        "cover_height": ["float"],
      },
    );
  }

  constructor() {
    super();

    // percenttime
    Utils.interval(1000, () => {
      Utils.execAsync(`sh -c "mpc status '%percenttime%' | tr -d ' %'"`)
        .then((out) => {
          const newVal = parseInt(out, 10);
          if (this.elapsed !== newVal) {
            this.elapsed = newVal;
            this.changed("elapsed");
          }
        })
        .catch((err) => console.error(err));
    });

    this.onStatusChange();

    Utils.subprocess(
      ["mpc", "idleloop"],
      (_) => {
        this.onStatusChange();
      },
      logError,
    );
  }

  onStatusChange() {
    Utils.execAsync(`mpc status '%state%;%songpos%;%length%;%repeat%;%random%;%single%;%consume%'`)
      .then((out) => {
        const items = out.split(";");
        this.position = parseInt(items[1], 10);
        this.length = parseInt(items[2], 10);
        this.state.playing = items[0] === "playing";
        this.state.repeat = items[3] === "on";
        this.state.random = items[4] === "on";
        this.state.single = items[5] === "on";
        this.state.consume = items[6] === "on";

        this.changed("position");
        this.changed("length");
        this.changed("state");
        this.emit("status-changed");

        if (items[0] !== "stopped") {
          this.updateSong();
        }
      })
      .catch((err) => console.error(err));
  }

  // resetSong() {
  //   this.title = "Unknown";
  //   this.album = "Unknown";
  //   this.artist = "Unknown";
  //   this.cover_path = "/home/poyehchen/placeholder.png";
  //   this.cover_width = 200;
  //   this.cover_height = 200;
  // }
  updateSong() {
    Utils.execAsync(`sh -c 'mpc -f "%album%:.:%title%:.:%artist%" | head -1'`)
      .then((out) => {
        const items = out.split(":.:");
        if (this.album !== items[0]) {
          this.album = items[0] !== "" ? items[0] : "Unknown";

          this.changed("album");

          Utils.execAsync(`mpd_cover_path`).then(out => {
            if (this.cover_path !== out) {
              this.cover_path = out;
              const basePixel = 240;

              Promise.all([
                calculateImageWidth(out, basePixel),
                calculateImageHeight(out, basePixel),
              ]).then(([w, h]) => {
                this.cover_width = w;
                this.cover_height = h;

                this.changed("cover_width");
                this.changed("cover_height");
              });

              this.changed("cover_path");
              this.emit("cover-changed");
            }
          })
        }
        this.title = items[1] !== "" ? items[1] : "Unknown";
        this.artist = items[2] !== "" ? items[2] : "Unknown";

        this.changed("title");
        this.changed("artist");
        this.emit("song-changed");
      })
      .catch((err) => console.error(err));
  }

  togglePlaying() {
    Utils.execAsync(`mpc toggle`);
  }
  nextSong() {
    Utils.execAsync(`mpc next`);
  }
  prevSong() {
    Utils.execAsync(`mpc prev`);
  }
}

async function calculateImageWidth(path: string, base: number): Promise<number> {
  try {
    const result = await Utils.execAsync(`sh -c "identify '${path}' | awk -F' ' '{print $(NF-6);}' | awk -F'x' '{print $1/$2 * ${base}}'"`);
    const val = parseFloat(result);
    return val;
  } catch {
    return base;
  }
}

async function calculateImageHeight(path: string, base: number): Promise<number> {
  try {
    const result = await Utils.execAsync(`sh -c "identify '${path}' | awk -F' ' '{print $(NF-6);}' | awk -F'x' '{print $2/$1 * ${base}}'"`);
    const val = parseFloat(result);
    return val;
  } catch {
    return base;
  }
}

const service = new MpdService;

export default service;
