import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const { title, content, thumbnail, isFeatured, status, tags } = payload;

  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};
const allPost = async () => {};
const postStatics = async () => {};
const myPost = async () => {};
const singlePost = async () => {};
const updatePost = async () => {};
const DeletePost = async () => {};

export const postService = {
  allPost,
  postStatics,
  myPost,
  singlePost,
  createPost,
  updatePost,
  DeletePost,
};
