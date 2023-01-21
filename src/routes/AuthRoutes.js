import { signIn, signUp } from "../controller/Auth.js";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { userSchema, loginSchema } from "../schema/AuthSchema.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(userSchema), signUp);
authRouter.post("/sign-in", validateSchema(loginSchema), signIn);

export default authRouter;
