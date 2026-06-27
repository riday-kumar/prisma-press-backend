import { Router } from "express";
import { commentController } from "./comment.controller";
import { ROLE } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const route = Router();
route.post(
  "/",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentController.createCommentController,
);
route.get("/author/:authorId", commentController.commentListByAuthorController);
route.get("/:commentId", commentController.singleCommentController);

route.patch(
  "/:commentId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentController.updateCommentByOwnerController,
);
route.delete(
  "/:commentId",
  auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
  commentController.deleteCommentByOwnerController,
);
route.patch(
  "/:commentId/moderate",
  auth(ROLE.ADMIN),
  commentController.moderateCommentController,
);

export const commentRoute = route;
