import { NextFunction, Request, Response } from "express";

// 404 not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
    date: Date(),
  });
};
