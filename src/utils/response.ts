import { Response } from "express";

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
