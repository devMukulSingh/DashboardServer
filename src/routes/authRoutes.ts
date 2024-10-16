import { Router } from "express";
import {
  signInController,
  signUpController,
  signOutController,
} from "../controllers/AuthController";

const authRoutes = Router();

authRoutes.post(`/sign-up`, signUpController);

authRoutes.post(`/sign-in`, signInController);

authRoutes.post("/sign-out", signOutController);

export default authRoutes;
