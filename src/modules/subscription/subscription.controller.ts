import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subScriptionService } from "./subscription.service";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createCheckOutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subScriptionService.createCheckOutSession(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "checkout completed successfully",
      data: result,
    });
  },
);
export const subScriptionController = {
  createCheckOutSession,
};
