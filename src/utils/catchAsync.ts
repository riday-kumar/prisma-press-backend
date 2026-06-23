import type { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: status.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  };
};
