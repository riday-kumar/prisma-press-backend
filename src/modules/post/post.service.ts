import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayLoad } from "./post.interface";

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
const allPost = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostById = async (postId: string) => {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  // throw new Error("error get");

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status: CommentStatus.APPROVED,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return post;
};

const myPost = async (id: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};

const postStatics = async () => {};

const updatePost = async (
  postId: string,
  payLoad: IUpdatePostPayLoad,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the author of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payLoad,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const DeletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the author of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  allPost,
  postStatics,
  myPost,
  getPostById,
  createPost,
  updatePost,
  DeletePost,
};
