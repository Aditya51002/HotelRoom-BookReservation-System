import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import type { ErrorResponse } from "../types/hotel";

export function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request<Record<string, never>, unknown, T>, res: Response<ErrorResponse>, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join("; ");
      res.status(400).json({ error: message, code: "VALIDATION_ERROR" });
      return;
    }

    req.body = parsed.data;
    next();
  };
}
