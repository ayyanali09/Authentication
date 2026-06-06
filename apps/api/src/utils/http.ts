import type { Response } from "express";

export type ApiErrorDetail = {
  path: string;
  message: string;
};

export class HttpError extends Error {
  statusCode: number;
  details?: ApiErrorDetail[];

  constructor(statusCode: number, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message = "OK"
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}
