const curTime = Variable("Xxx --. --:--", {
  poll: [1000, ["date", "+%b %e. %H:%M"]],
});

export default function() {
  return Widget.Label({
    className: "clock",
    label: curTime.bind(),
  });
}
