export function formatDuration(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function timeToMinutes(timeString: string): number {
  const timeParts = timeString.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  return hours * 60 + minutes;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const isoDate = date.toISOString();
  const year = isoDate.slice(2, 4);
  const month = isoDate.slice(5, 7);
  const day = isoDate.slice(8, 10);

  return `${year}${month}${day}`;
}
