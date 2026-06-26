import { Router } from "express";
import { commentController } from "./comment.controller";

const route = Router();
route.get("/author/:authorId", commentController.commentListByAuthorController);
route.get("/:commentId", commentController.singleCommentController);
route.post("/", commentController.createCommentController);
route.patch("/:commentId", commentController.updateCommentByOwnerController);
route.delete("/:commentId", commentController.deleteCommentByOwnerController);
route.patch(
  "/:commentId/admin",
  commentController.updateCommentByAdminController,
);

export const commentRoute = route;
