import jwt from "jsonwebtoken";
export const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("token verify error");
    return {
      success: false,
      error: error.message,
    };
  }
};
