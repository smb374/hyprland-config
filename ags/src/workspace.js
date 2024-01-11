import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import * as Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
const class_set = ["focused", "occupied", "blank"];
function clean_added_class(ctx) {
    class_set.forEach((cls) => {
        if (ctx.has_class(cls)) {
            ctx.remove_class(cls);
        }
    });
}
export default function () {
    return Widget.Box({
        class_name: "workspaces",
        children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => Widget.Button({
            on_clicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
            child: Widget.Label({ label: "\udb82\uddde" }),
            class_name: "blank",
        })),
        connections: [[Hyprland.active.workspace, self => {
                    const activeId = Hyprland.active.workspace.id;
                    const ctx = self.children[activeId - 1].get_style_context();
                    clean_added_class(ctx);
                    ctx.add_class("focused");
                    // Hyprland.workspaces is not synced when active workspace changes
                    // have to use this to avoid wrong class.
                    execAsync(`hyprctl -j workspaces`).then(out => {
                        const wss = JSON.parse(out).map((w) => w.id || 0);
                        self.children.forEach((box, i) => {
                            const ctx = box.get_style_context();
                            const idx = i + 1;
                            if (idx == activeId) {
                                return;
                            }
                            clean_added_class(ctx);
                            if (wss.includes(idx)) {
                                ctx.add_class("occupied");
                            }
                            else {
                                ctx.add_class("blank");
                            }
                        });
                    });
                }]],
    });
}
