import { catchAsync } from "../../utils/catchAsync";

const allPostController = catchAsync();
const postStaticsController = catchAsync();
const myPostController = catchAsync();
const singlePostController = catchAsync();
const createPostController = catchAsync();
const updatePostController = catchAsync();
const DeletePostController = catchAsync();

export const postController = {
  allPostController,
  postStaticsController,
  myPostController,
  singlePostController,
  createPostController,
  updatePostController,
  DeletePostController,
};
