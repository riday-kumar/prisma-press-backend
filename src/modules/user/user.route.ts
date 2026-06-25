import { NextFunction, Request, Response, Router } from "express";
import userController from "./user.controller";
import { verifyToken } from "../../utils/jwt";
import config from "../../config";
import { ROLE } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middlewares/auth";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: ROLE;
      };
    }
  }
}

router.post("/register", userController.registerUserController);

router.get(
  "/me",
  auth("ADMIN", "USER", "AUTHOR"),
  userController.getMyProfileController,
);

router.put(
  "/my-profile",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  userController.updateMyProfileController,
);

export const userRoutes = router;
