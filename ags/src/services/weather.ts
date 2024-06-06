import { Current, Error400, Error401, Error403, Location } from "src/api/weatherapi";

const API_KEY = "386356277ec846c8a1e81401240406";

interface IconDesc {
  description: string,
  icon: string,
}

interface WeatherItem {
  day: IconDesc,
  night: IconDesc,
}

interface Realtime {
  location: Location,
  current: Current,
}

class Weather extends Service {
  realtime?: Realtime;
  icon: IconDesc = {
    description: "Uninitialized",
    icon: "\ue374", // 
  };

  static {
    Service.register(
      this,
      {
        "weather-changed": [],
      },
      {
        "realtime": ["jsobject"],
        "icon": ["jsobject"],
      },
    );
  }

  constructor() {
    super();

    this.updateRealtime();

    Utils.interval(60000, () => this.updateRealtime());
  }

  async updateRealtime() {
    let resp = await Utils.fetch(`https://api.weatherapi.com/v1/current.json?q=auto:ip&key=${API_KEY}`);

    if (resp.ok) {
      this.realtime = await resp.json() as Realtime;
      this.emit("weather-changed");
      this.changed("realtime");
    } else {
      let data = await resp.json();
      switch (resp.status) {
        case 400: {
          let error = data as Error400;
          console.error(`Request failed with status code 400: code=${error.code} err=${error.message}`);
          break;
        }
        case 401: {
          let error = data as Error401;
          console.error(`Request failed with status code 401: code=${error.code} err=${error.message}`);
          break;
        }
        case 403: {
          let error = data as Error403;
          console.error(`Request failed with status code 403: code=${error.code} err=${error.message}`);
          break;
        }
        default: {
          console.error(`Request failed with status code ${resp.status}: ${resp.statusText}`);
          break;
        }
      }
    }
  }

  getIcon(): IconDesc {
    if (this.realtime != undefined) {
      let current = this.realtime.current;
      if (WEATHER_CODES?.[current.condition.code] !== undefined) {
        if (current.is_day === 1) {
          return WEATHER_CODES[current.condition.code].day;
        } else {
          return WEATHER_CODES[current.condition.code].night;
        }
      } else {
        return {
          description: "unknown code",
          icon: "\ue36e", // 
        };
      }
    } else {
      return {
        description: "Uninitialized",
        icon: "\ue374", // 
      };
    }
  }
}

const service = new Weather;

export default service;

const WEATHER_CODES: { [key: number]: WeatherItem } = {
  1000: {
    day: {
      description: "Sunny",
      icon: "\ue30d", // 
    },
    night: {
      description: "Clear",
      icon: "\ue32b", // 
    }
  },
  1003: {
    day: {
      description: "Partly cloudy",
      icon: "\ue302", // 
    },
    night: {
      description: "Partly cloudy",
      icon: "\ue37e", // 
    }
  },
  1006: {
    day: {
      description: "Cloudy",
      icon: "\ue312", // 
    },
    night: {
      description: "Cloudy",
      icon: "\ue312", // 
    }
  },
  1009: {
    day: {
      description: "Overcast",
      icon: "\ue312", // 
    },
    night: {
      description: "Overcast",
      icon: "\ue312", // 
    }
  },
  1030: {
    day: {
      description: "Mist",
      icon: "\ue35d", // 
    },
    night: {
      description: "Mist",
      icon: "\ue35d", // 
    }
  },
  1063: {
    day: {
      description: "Patchy rain possible",
      icon: "\ue308", // 
    },
    night: {
      description: "Patchy rain possible",
      icon: "\ue325", // 
    }
  },
  1066: {
    day: {
      description: "Patchy snow possible",
      icon: "\ue30a", // 
    },
    night: {
      description: "Patchy snow possible",
      icon: "\ue327", // 
    }
  },
  1069: {
    day: {
      description: "Patchy sleet possible",
      icon: "\ue3aa", // 
    },
    night: {
      description: "Patchy sleet possible",
      icon: "\ue3ac", // 
    }
  },
  1072: {
    day: {
      description: "Patchy freezing drizzle possible",
      icon: "\ue306", // 
    },
    night: {
      description: "Patchy freezing drizzle possible",
      icon: "\ue323", // 
    }
  },
  1087: {
    day: {
      description: "Thundery outbreaks possible",
      icon: "\ue305", // 
    },
    night: {
      description: "Thundery outbreaks possible",
      icon: "\ue322", // 
    }
  },
  1114: {
    day: {
      description: "Blowing snow",
      icon: "\ue35f", // 
    },
    night: {
      description: "Blowing snow",
      icon: "\ue361", // 
    }
  },
  1117: {
    day: {
      description: "Blizzard",
      icon: "\ue35e", // 
    },
    night: {
      description: "Blizzard",
      icon: "\ue35e", // 
    }
  },
  1135: {
    day: {
      description: "Fog",
      icon: "\ue303", // 
    },
    night: {
      description: "Fog",
      icon: "\ue346", // 
    }
  },
  1147: {
    day: {
      description: "Freezing fog",
      icon: "\ue303", // 
    },
    night: {
      description: "Freezing fog",
      icon: "\ue346", // 
    }
  },
  1150: {
    day: {
      description: "Patchy light drizzle",
      icon: "\ue306", // 
    },
    night: {
      description: "Patchy light drizzle",
      icon: "\ue323", // 
    }
  },
  1153: {
    day: {
      description: "Light drizzle",
      icon: "\ue306", // 
    },
    night: {
      description: "Light drizzle",
      icon: "\ue323", // 
    }
  },
  1168: {
    day: {
      description: "Freezing drizzle",
      icon: "\ue306", // 
    },
    night: {
      description: "Freezing drizzle",
      icon: "\ue323", // 
    }
  },
  1171: {
    day: {
      description: "Heavy freezing drizzle",
      icon: "\ue316", // 
    },
    night: {
      description: "Heavy freezing drizzle",
      icon: "\ue316", // 
    }
  },
  1180: {
    day: {
      description: "Patchy light rain",
      icon: "\ue308", // 
    },
    night: {
      description: "Patchy light rain",
      icon: "\ue325", // 
    }
  },
  1183: {
    day: {
      description: "Light rain",
      icon: "\ue308", // 
    },
    night: {
      description: "Light rain",
      icon: "\ue325", // 
    }
  },
  1186: {
    day: {
      description: "Moderate rain at times",
      icon: "\ue318", // 
    },
    night: {
      description: "Moderate rain at times",
      icon: "\ue318", // 
    }
  },
  1189: {
    day: {
      description: "Moderate rain",
      icon: "\ue318", // 
    },
    night: {
      description: "Moderate rain",
      icon: "\ue318", // 
    }
  },
  1192: {
    day: {
      description: "Heavy rain at times",
      icon: "\ue318", // 
    },
    night: {
      description: "Heavy rain at times",
      icon: "\ue318", // 
    }
  },
  1195: {
    day: {
      description: "Heavy rain",
      icon: "\ue318", // 
    },
    night: {
      description: "Heavy rain",
      icon: "\ue318", // 
    }
  },
  1198: {
    day: {
      description: "Light freezing rain",
      icon: "\ue308", // 
    },
    night: {
      description: "Light freezing rain",
      icon: "\ue325", // 
    }
  },
  1201: {
    day: {
      description: "Moderate or heavy freezing rain",
      icon: "\ue318", // 
    },
    night: {
      description: "Moderate or heavy freezing rain",
      icon: "\ue318", // 
    }
  },
  1204: {
    day: {
      description: "Light sleet",
      icon: "\ue3aa", // 
    },
    night: {
      description: "Light sleet",
      icon: "\ue3ac", // 
    }
  },
  1207: {
    day: {
      description: "Moderate or heavy sleet",
      icon: "\ue3ad", // 
    },
    night: {
      description: "Moderate or heavy sleet",
      icon: "\ue3ad", // 
    }
  },
  1210: {
    day: {
      description: "Patchy light snow",
      icon: "\ue30a", // 
    },
    night: {
      description: "Patchy light snow",
      icon: "\ue327", // 
    }
  },
  1213: {
    day: {
      description: "Light snow",
      icon: "\ue30a", // 
    },
    night: {
      description: "Light snow",
      icon: "\ue327", // 
    }
  },
  1216: {
    day: {
      description: "Patchy moderate snow",
      icon: "\ue31a", // 
    },
    night: {
      description: "Patchy moderate snow",
      icon: "\ue31a", // 
    }
  },
  1219: {
    day: {
      description: "Moderate snow",
      icon: "\ue31a", // 
    },
    night: {
      description: "Moderate snow",
      icon: "\ue31a", // 
    }
  },
  1222: {
    day: {
      description: "Patchy heavy snow",
      icon: "\ue31a", // 
    },
    night: {
      description: "Patchy heavy snow",
      icon: "\ue31a", // 
    }
  },
  1225: {
    day: {
      description: "Heavy snow",
      icon: "\ue31a", // 
    },
    night: {
      description: "Heavy snow",
      icon: "\ue31a", // 
    }
  },
  1237: {
    day: {
      description: "Ice pellets",
      icon: "\ue3aa", // 
    },
    night: {
      description: "Ice pellets",
      icon: "\ue3ac", // 
    }
  },
  1240: {
    day: {
      description: "Light rain shower",
      icon: "\ue309", // 
    },
    night: {
      description: "Light rain shower",
      icon: "\ue326", // 
    }
  },
  1243: {
    day: {
      description: "Moderate or heavy rain shower",
      icon: "\ue319", // 
    },
    night: {
      description: "Moderate or heavy rain shower",
      icon: "\ue319", // 
    }
  },
  1246: {
    day: {
      description: "Torrential rain shower",
      icon: "\ue319", // 
    },
    night: {
      description: "Torrential rain shower",
      icon: "\ue319", // 
    }
  },
  1249: {
    day: {
      description: "Light sleet showers",
      icon: "\ue3aa", // 
    },
    night: {
      description: "Light sleet showers",
      icon: "\ue3ac", // 
    }
  },
  1252: {
    day: {
      description: "Moderate or heavy sleet showers",
      icon: "\ue3ad", // 
    },
    night: {
      description: "Moderate or heavy sleet showers",
      icon: "\ue3ad", // 
    }
  },
  1255: {
    day: {
      description: "Light snow showers",
      icon: "\ue35f", // 
    },
    night: {
      description: "Light snow showers",
      icon: "\ue361", // 
    }
  },
  1258: {
    day: {
      description: "Moderate or heavy snow showers",
      icon: "\ue35e", // 
    },
    night: {
      description: "Moderate or heavy snow showers",
      icon: "\ue35e", // 
    }
  },
  1261: {
    day: {
      description: "Light showers of ice pellets",
      icon: "\ue3aa", // 
    },
    night: {
      description: "Light showers of ice pellets",
      icon: "\ue3ac", // 
    }
  },
  1264: {
    day: {
      description: "Moderate or heavy showers of ice pellets",
      icon: "\ue3ad", // 
    },
    night: {
      description: "Moderate or heavy showers of ice pellets",
      icon: "\ue3ad", // 
    }
  },
  1273: {
    day: {
      description: "Patchy light rain with thunder",
      icon: "\ue30f", // 
    },
    night: {
      description: "Patchy light rain with thunder",
      icon: "\ue32a", // 
    }
  },
  1276: {
    day: {
      description: "Moderate or heavy rain with thunder",
      icon: "\ue31d", // 
    },
    night: {
      description: "Moderate or heavy rain with thunder",
      icon: "\ue31d", // 
    }
  },
  1279: {
    day: {
      description: "Patchy light snow with thunder",
      icon: "\ue365", // 
    },
    night: {
      description: "Patchy light snow with thunder",
      icon: "\ue367", // 
    }
  },
  1282: {
    day: {
      description: "Moderate or heavy snow with thunder",
      icon: "\ue365", // 
    },
    night: {
      description: "Moderate or heavy snow with thunder",
      icon: "\ue367", // 
    }
  }
}
