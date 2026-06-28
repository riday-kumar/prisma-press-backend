import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const allPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.allPost();

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Posts retrieved successfully",
      data: result,
    });
  },
);

const getPostByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.postId;

    if (!id) {
      throw new Error("Post ID is required In Params");
    }

    const result = await postService.getPostById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Post retrieved successfully",
      data: result,
    });
  },
);

const myPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await postService.myPost(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Posts retrieved successfully",
      data: result,
    });
  },
);

const postStaticsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.postStatics();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Post statistics retrieved successfully",
      data: result,
    });
  },
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
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("post does not exists");
    }

    const payLoad = req.body;
    // console.log(payLoad);

    const result = await postService.updatePost(
      postId as string,
      payLoad,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Post updated successfully",
      data: result,
    });
  },
);
const DeletePostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("post does not exists");
    }

    await postService.DeletePost(postId as string, authorId as string, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Post Deleted Successfully",
      data: null,
    });
  },
);

export const postController = {
  allPostController,
  postStaticsController,
  myPostController,
  getPostByIdController,
  createPostController,
  updatePostController,
  DeletePostController,
};
