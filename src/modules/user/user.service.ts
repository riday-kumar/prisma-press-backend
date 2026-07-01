import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { IUser, RegisterUserPayLoad } from "./user.interface";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const registerUserIntoDB = async (payLoad: RegisterUserPayLoad) => {
  const { name, email, password, profilePhoto, bio } = payLoad;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // if (isUserExists) {
  //   throw new Error("User already exists");
  // }

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

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { id, name, email, profilePhoto, bio } = payload;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
    },
  });

  return updatedUser;
};

const userService = { getMyProfile, registerUserIntoDB, updateMyProfileInDB };
export default userService;
