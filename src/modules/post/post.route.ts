import { Router } from "express";
import { postController } from "./post.controller";

const route = Router();
route.get("/", postController.allPostController);
route.get("/stats", postController.postStaticsController);
route.get("/my-posts", postController.myPostController);
route.get("/:postId", postController.singlePostController);
route.post("/posts", postController.createPostController);
route.patch("/:postId", postController.updatePostController);
route.delete("/:postId", postController.DeletePostController);

export const postRoute = route;
