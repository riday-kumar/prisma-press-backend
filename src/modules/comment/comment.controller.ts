import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const commentListByAuthorController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const singleCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const createCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateCommentByOwnerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteCommentByOwnerController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const moderateCommentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  commentListByAuthorController,
  singleCommentController,
  createCommentController,
  updateCommentByOwnerController,
  deleteCommentByOwnerController,
  moderateCommentController,
};
