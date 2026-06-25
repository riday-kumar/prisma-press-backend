import { NextFunction, Request, Response } from "express";
import status from "http-status";
import httpsStatus from "http-status";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "../../utils/jwt";
import { IUser } from "./user.interface";

const getMyProfileController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("request user", req.user);

    const user = await userService.getMyProfile(req.user);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "User Profile Fetched Successfully",
      data: user,
    });
  },
);

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
  getMyProfileController,
  registerUserController,
};

export default userController;
