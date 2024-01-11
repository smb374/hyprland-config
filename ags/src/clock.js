import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
export default function Clock() {
    return Widget.Label({
        class_name: "clock",
        connections: [
            [1000, self => execAsync(["date", "+%b %e. %H:%M"])
                    .then(date => self.set_label(date))
                    .catch(console.error)
            ]
        ]
    });
}
