import { catchAsync } from "../../utils/catchAsync";

const commentListByAuthorController = catchAsync();
const singleCommentController = catchAsync();
const createCommentController = catchAsync();
const updateCommentByOwnerController = catchAsync();
const deleteCommentByOwnerController = catchAsync();
const updateCommentByAdminController = catchAsync();

export const commentController = {
  commentListByAuthorController,
  singleCommentController,
  createCommentController,
  updateCommentByOwnerController,
  deleteCommentByOwnerController,
  updateCommentByAdminController,
};
