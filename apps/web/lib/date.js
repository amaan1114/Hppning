// Display-only: turns the API's "YYYY-MM-DD" date into labels for the UI.
// Falls back to the raw value if it isn't a parseable date.
export function dateParts(date) {
  // slice: tolerate a full ISO timestamp; local midnight so no timezone can move the day.
  const parsed = new Date(`${String(date).slice(0, 10)}T00:00`);

  if (Number.isNaN(parsed.getTime())) {
    const raw = String(date ?? "");
    return { day: "–", month: "", weekday: raw, full: raw };
  }

  const format = (options) => parsed.toLocaleDateString("en-US", options);

  return {
    day: parsed.getDate(),
    month: format({ month: "short" }),
    weekday: format({ weekday: "short" }),
    full: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
}
