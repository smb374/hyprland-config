import Gtk from "gi://Gtk?version=3.0";

const hyprland = await Service.import("hyprland");
const class_set = ["focused", "occupied", "blank"];

function clean_added_class(ctx: Gtk.StyleContext) {
  class_set.forEach((cls) => {
    if (ctx.has_class(cls)) {
      ctx.remove_class(cls);
    }
  });
}

function dispatch(ws: number | string) {
  hyprland.messageAsync(`dispatch workspace ${ws}`);
}

export default function() {
  const wsbox = Widget.Box({
    className: "workspaces",
    children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => Widget.Button({
      on_clicked: () => dispatch(i),
      child: Widget.Label({ label: "\udb82\uddde" }),
      className: "blank",
    })),
  }).hook(hyprland.active.workspace, self => {
    const activeId = hyprland.active.workspace.id;
    const ctx = self.children[activeId - 1].get_style_context();
    clean_added_class(ctx);
    ctx.add_class("focused");
    Utils.execAsync(`hyprctl -j workspaces`).then(out => {
      const wss = JSON.parse(out).map((w: { id: number }) => w.id ?? 0);
      self.children.forEach((box, i) => {
        const ctx = box.get_style_context();
        const idx = i + 1;
        if (idx == activeId) {
          return;
        }
        clean_added_class(ctx);
        if (wss.includes(idx)) {
          ctx.add_class("occupied");
        } else {
          ctx.add_class("blank");
        }
      });
    })
  });
  return Widget.EventBox({
    onScrollUp: () => dispatch("+1"),
    onScrollDown: () => dispatch("-1"),
    child: wsbox,
  });
}
