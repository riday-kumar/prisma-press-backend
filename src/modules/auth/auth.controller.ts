import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpsStatus from "http-status";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.body;

    const { accessToken, refreshToken } =
      await authService.loginUserIntoDB(payLoad);

    // set tokens in the cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Login success",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await authService.createRefreshToken(refreshToken);

    // set access token in the cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Refresh token success",
      data: {
        accessToken,
      },
    });
  },
);

export const authController = {
  loginUser,
  refreshToken,
};
