import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { ROLE } from "../../../generated/prisma/enums";

const commentListByAuthorController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.authorId as string;
    const result = await commentService.commentListByAuthorService(userId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "comment list by author",
      data: result,
    });
  },
);
const singleCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const result = await commentService.singleCommentService(commentId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "comment found successfully",
      data: result,
    });
  },
);

const createCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = { authorId, ...req.body };
    const result = await commentService.createCommentService(payload);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const updateCommentByOwnerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const userId = req.user?.id as string;
    const payLoad = req.body;

    const result = await commentService.updateCommentByOwnerService(
      commentId,
      userId,
      payLoad,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "comment updated successfully",
      data: result,
    });
  },
);
const deleteCommentByOwnerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const userId = req.user?.id as string;
    const isAdmin = req.user?.role === ROLE.ADMIN;
    const result = await commentService.deleteCommentByOwnerService(
      commentId,
      userId,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "comment deleted successfully",
      data: null,
    });
  },
);
const moderateCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const userRole = req.user?.role;
    const result = await commentService.updateCommentByAdminService(commentId);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Comment Rejected successfully",
      data: result,
    });
  },
);

export const commentController = {
  commentListByAuthorController,
  singleCommentController,
  createCommentController,
  updateCommentByOwnerController,
  deleteCommentByOwnerController,
  moderateCommentController,
};
