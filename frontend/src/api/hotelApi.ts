import axios from "axios";
import type { AxiosError } from "axios";
import type { BookingResult, ErrorResponse, HotelState } from "../types/hotel";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/hotel",
  timeout: 8000
});

function toApiError(error: unknown): Error {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const axiosError: AxiosError<ErrorResponse> = error;
    const message = axiosError.response?.data?.error ?? axiosError.message;
    return new Error(message);
  }

  return error instanceof Error ? error : new Error("Unexpected API error");
}

export async function getState(): Promise<HotelState> {
  try {
    const response = await api.get<HotelState>("/state");
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function book(count: number): Promise<BookingResult> {
  try {
    const response = await api.post<BookingResult>("/book", { count });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function random(): Promise<HotelState> {
  try {
    const response = await api.post<HotelState>("/random");
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function reset(): Promise<HotelState> {
  try {
    const response = await api.post<HotelState>("/reset");
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
