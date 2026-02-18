import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { generateSeats } from "./seatGenerator.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/api/check", async (req, res) => {
  try {
    const { flightNumber, date } = req.body;

    if (!flightNumber || !date) {
      return res.status(400).json({
        error: "flightNumber and date are required",
      });
    }

    const existing = await prisma.voucher.findUnique({
      where: {
        flight_number_flight_date: {
          flight_number: flightNumber,
          flight_date: date,
        },
      },
    });

    return res.json({ exists: !!existing });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { name, id, flightNumber, date, aircraft } = req.body;

    if (!name || !id || !flightNumber || !date || !aircraft) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const seats = generateSeats(aircraft);

    const voucher = await prisma.voucher.create({
      data: {
        crew_name: name,
        crew_id: id,
        flight_number: flightNumber,
        flight_date: date,
        aircraft_type: aircraft,
        seat1: seats[0],
        seat2: seats[1],
        seat3: seats[2],
      },
    });

    return res.status(201).json({
      success: true,
      seats,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Vouchers already generated for this flight and date",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
