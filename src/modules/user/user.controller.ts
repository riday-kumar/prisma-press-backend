import { Request, Response } from "express";
import status from "http-status";
import httpsStatus from "http-status";
import userService from "./user.service";

const registerUserController = async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUserIntoDB(req.body);
    res.status(status.CREATED).json({
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "user registered successfully",
      data: user,
    });
  } catch (error) {
    // console.log(error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

const userController = {
  registerUserController,
};

export default userController;
