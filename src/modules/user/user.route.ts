import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/register", userController.registerUserController);

export const userRoutes = router;
