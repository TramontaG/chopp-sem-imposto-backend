import { Router } from "express";
import adminRouter from "./admin";
import signupRouter from "./Signup";
import UserRouter from "./Users";
import publicRouter from "./public";

const AppRouter = Router();

AppRouter.use("/admin", adminRouter);
AppRouter.use("/signup", signupRouter);
AppRouter.use("/users", UserRouter);
AppRouter.use("/public", publicRouter);

export default AppRouter;
