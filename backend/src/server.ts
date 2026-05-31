import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import { buildInitialRooms } from "./engine/bookingAlgorithm";
import { createBookingRouter } from "./routes/booking.routes";
import type { ErrorResponse, HotelState } from "./types/hotel";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

let hotelState: HotelState = { rooms: buildInitialRooms() };

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === frontendUrl) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed"));
    }
  })
);
app.use(express.json());

app.get("/health", (_req: Request, res: Response<{ status: string }>) => {
  res.json({ status: "ok" });
});

app.use(
  "/api/hotel",
  createBookingRouter({
    getState: () => hotelState,
    setState: (state) => {
      hotelState = state;
    }
  })
);

app.use((_req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({ error: "Route not found", code: "NOT_FOUND" });
});

app.use((err: unknown, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected server error";
  res.status(500).json({ error: message, code: "INTERNAL_ERROR" });
});

app.listen(port, () => {
  console.log(`Hotel reservation API listening on http://localhost:${port}`);
});
