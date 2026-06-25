import { ROLE } from "../../generated/prisma/enums";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
export const auth = (...requiredRoles: ROLE[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("Token is not provided");
    }

    const jwt_accessToken = config.jwt_access_secret;
    if (!jwt_accessToken) {
      throw new Error("JWT access token is not set");
    }

    // verify token
    const verifiedToken = verifyToken(token, jwt_accessToken);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. Don't have permission to access this resource.",
      );
    }

    //now check the user
    const user = await prisma.user.findUnique({
      where: {
        id,
        name,
        email,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.activeStatus === "INACTIVE") {
      throw new Error("User is inactive. please contact support");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };
    next();
  });
};
