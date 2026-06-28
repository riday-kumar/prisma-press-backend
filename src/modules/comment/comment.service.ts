import { CommentStatus, ROLE } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICommentPostPayLoad,
  ICommentUpdatePayLoad,
} from "./comment.interface";

const createCommentService = async (payload: ICommentPostPayLoad) => {
  const { content, postId, authorId } = payload;

  const checkPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
    },
  });
  return result;
};

const commentListByAuthorService = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
  });
  return result;
};

const singleCommentService = async (id: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return comment;
};

const updateCommentByOwnerService = async (
  commentId: string,
  userId: string,
  payLoad: ICommentUpdatePayLoad,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.authorId !== userId) {
    throw new Error("Not authorized to update this comment");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...payLoad,
    },
    include: {
      author: {
        omit: {
          id: true,
          password: true,
          activeStatus: true,
          role: true,
          email: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
};

const deleteCommentByOwnerService = async (
  commentId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const checkComment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  // console.log(checkComment);
  if (!checkComment) {
    throw new Error("Comment not found");
  }

  if (!isAdmin && checkComment.authorId !== userId) {
    throw new Error("Not authorized to delete this comment");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const updateCommentByAdminService = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.status === CommentStatus.REJECT) {
    throw new Error("Comment is already rejected");
  }

  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: CommentStatus.REJECT,
    },
  });
  return result;
};

export const commentService = {
  commentListByAuthorService,
  singleCommentService,
  createCommentService,
  updateCommentByOwnerService,
  deleteCommentByOwnerService,
  updateCommentByAdminService,
};
