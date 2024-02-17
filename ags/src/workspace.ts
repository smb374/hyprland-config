const hyprland = await Service.import("hyprland");

function dispatch(ws: number | string) {
  hyprland.messageAsync(`dispatch workspace ${ws}`);
}

function is_occupied(idx: number): boolean {
  return hyprland.workspaces.some(ws => ws.id === idx && ws.windows !== 0);
}

export default function() {
  const wsbox = Widget.Box({
    class_name: "workspaces",
    children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => Widget.Button({
      attribute: i,
      on_clicked: () => dispatch(i),
      child: Widget.Label({ label: "\udb82\uddde" }),
      class_name: "blank",
      setup: self => self.bind("class_name", hyprland.active.workspace, "id", id => {
        if (self.attribute === id) {
          return "focused";
        } else if (is_occupied(self.attribute)) {
          return "occupied";
        } else {
          return "blank";
        }
      }),
    })),
  });
  return Widget.EventBox({
    on_scroll_up: () => dispatch("+1"),
    on_scroll_down: () => dispatch("-1"),
    child: wsbox,
  });
}
