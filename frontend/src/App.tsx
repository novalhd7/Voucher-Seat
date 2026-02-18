import { useState } from "react";
import { checkVoucher, generateVoucher } from "./api";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    id: "",
    flightNumber: "",
    date: "",
    aircraft: "",
  });

  const [seats, setSeats] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const handleSubmit = async () => {
    setError("");
    setSeats([]);

    if (
      !form.name ||
      !form.id ||
      !form.flightNumber ||
      !form.date ||
      !form.aircraft
    ) {
      return setError("All fields are required.");
    }

    if (!validateDate(form.date)) {
      return setError("Date format must be YYYY-MM-DD.");
    }

    try {
      setLoading(true);

      const check = await checkVoucher(form.flightNumber, form.date);

      if (check.data.exists) {
        setError("Vouchers already generated for this flight and date.");
        setLoading(false);
        return;
      }

      const response = await generateVoucher(form);

      setSeats(response.data.seats);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Airline Voucher Generator
        </h1>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Crew Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="id"
            placeholder="Crew ID"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="flightNumber"
            placeholder="Flight Number (e.g. GA102)"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <select
            name="aircraft"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Aircraft</option>
            <option value="ATR">ATR</option>
            <option value="Airbus 320">Airbus 320</option>
            <option value="Boeing 737 Max">Boeing 737 Max</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Generating..." : "Generate Vouchers"}
          </button>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          {seats.length > 0 && (
            <div className="mt-6 text-center">
              <h2 className="font-semibold mb-2">Generated Seats:</h2>
              <div className="flex justify-center gap-4">
                {seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
