import { Router } from "express";
import { subScriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/create-checkout-session",
  auth(ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER),
  subScriptionController.createCheckOutSession,
);

export const subScriptionRoutes = router;
