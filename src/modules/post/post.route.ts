import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { ROLE } from "../../../generated/prisma/enums";

const route = Router();
route.get("/", postController.allPostController);
route.get(
  "/my-posts",
  auth(ROLE.ADMIN, ROLE.USER, ROLE.AUTHOR),
  postController.myPostController,
);
route.get("/:postId", postController.singlePostController);
route.get("/stats", auth(ROLE.ADMIN), postController.postStaticsController);
route.post(
  "/",
  auth(ROLE.ADMIN, ROLE.USER, ROLE.AUTHOR),
  postController.createPostController,
);
route.patch(
  "/:postId",
  auth(ROLE.ADMIN, ROLE.USER, ROLE.AUTHOR),
  postController.updatePostController,
);
route.delete(
  "/:postId",
  auth(ROLE.ADMIN, ROLE.USER, ROLE.AUTHOR),
  postController.DeletePostController,
);

export const postRoute = route;
