import { Router } from "express";
import adminRouter from "./admin";

const AppRouter = Router();

AppRouter.use("/admin", adminRouter);

export default AppRouter;
