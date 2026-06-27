import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const allPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.allPost();
  },
);

const postStaticsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const myPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const singlePostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const createPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);
const updatePostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const DeletePostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  allPostController,
  postStaticsController,
  myPostController,
  singlePostController,
  createPostController,
  updatePostController,
  DeletePostController,
};
