import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { RegisterUserPayLoad } from "./user.interface";

const registerUserIntoDB = async (payLoad: RegisterUserPayLoad) => {
  const { name, email, password, profilePhoto, bio } = payLoad;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto: (profilePhoto as string) ?? null,
      bio: (bio as string) ?? null,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const userService = { registerUserIntoDB };
export default userService;
