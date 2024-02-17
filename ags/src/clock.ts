const current_time = Variable("Xxx --. --:--", {
  poll: [1000, ["date", "+%b %e. %H:%M"]],
});

export default function() {
  return Widget.Label({
    class_name: "clock",
    label: current_time.bind(),
  });
}
