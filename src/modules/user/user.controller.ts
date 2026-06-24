import { NextFunction, Request, Response } from "express";
import status from "http-status";
import httpsStatus from "http-status";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.registerUserIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "User Registered Successfully",
      data: user,
    });
  },
);

const userController = {
  registerUserController,
};

export default userController;
