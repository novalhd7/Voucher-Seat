const seatMap = {
  ATR: { rows: 18, seats: ["A", "C", "D", "F"] },
  "Airbus 320": { rows: 32, seats: ["A", "B", "C", "D", "E", "F"] },
  "Boeing 737 Max": { rows: 32, seats: ["A", "B", "C", "D", "E", "F"] },
} as const;

type AircraftType = keyof typeof seatMap;

export function generateSeats(
  aircraft: AircraftType,
): [string, string, string] {
  const config = seatMap[aircraft];
  if (!config) throw new Error("Invalid aircraft type");

  const allSeats: string[] = [];

  for (let r = 1; r <= config.rows; r++) {
    for (const s of config.seats) {
      allSeats.push(`${r}${s}`);
    }
  }

  const shuffled = [...allSeats].sort(() => Math.random() - 0.5);

  return [shuffled[0]!, shuffled[1]!, shuffled[2]!];
}
