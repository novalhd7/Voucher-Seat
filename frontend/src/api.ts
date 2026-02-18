import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= TIPE ================= */

export interface GenerateRequest {
  name: string;
  id: string;
  flightNumber: string;
  date: string;
  aircraft: string;
}

export interface GenerateResponse {
  success: boolean;
  seats: string[];
}

export interface CheckResponse {
  exists: boolean;
}

/* ================= API ================= */

export const checkVoucher = (flightNumber: string, date: string) =>
  API.post<CheckResponse>("/check", { flightNumber, date });

export const generateVoucher = (data: GenerateRequest) =>
  API.post<GenerateResponse>("/generate", data);
