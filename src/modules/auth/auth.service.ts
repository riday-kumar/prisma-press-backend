import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/createToken";
import { ILoginUserPayLoad } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const loginUserIntoDB = async (payLoad: ILoginUserPayLoad) => {
  const jwtAccessToken = config.jwt_access_secret;
  const jwtRefreshToken = config.jwt_refresh_secret;

  if (!jwtAccessToken || !jwtRefreshToken) {
    throw new Error("JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not defined");
  }

  const configs = {
    jwt_access_secret: jwtAccessToken,
    jwt_refresh_secret: jwtRefreshToken,
  };

  const { email, password } = payLoad;
  const userExists = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(password, userExists.password);
  if (!isPasswordMatch) {
    throw new Error("Password does not match");
  }

  const jwtPayLoad = {
    id: userExists.id,
    name: userExists.name,
    email: userExists.email,
    role: userExists.role,
  };

  // Generate JWT access token
  // const accessToken = jwt.sign(jwtPayLoad, configs.jwt_access_secret, {
  //   expiresIn: config.jwt_access_expire,
  // } as SignOptions);

  const accessToken = jwtUtils.createToken(
    jwtPayLoad,
    configs.jwt_access_secret,
    config.jwt_access_expire as SignOptions,
  );

  // generate JWT refresh token
  // const refreshToken = jwt.sign(jwtPayLoad, configs.jwt_refresh_secret, {
  //   expiresIn: config.jwt_refresh_expire,
  // } as SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayLoad,
    configs.jwt_refresh_secret,
    config.jwt_refresh_expire as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authService = {
  loginUserIntoDB,
};
