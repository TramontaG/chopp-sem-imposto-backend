import { Router } from "express";
import adminRouter from "./admin";
import signupRouter from "./Signup";
import UserRouter from "./Users";
import publicRouter from "./public";
import EventsRouter from "./Events";
import MiscRouter from "./misc";

const AppRouter = Router();

AppRouter.use("/admin", adminRouter);
AppRouter.use("/signup", signupRouter);
AppRouter.use("/users", UserRouter);
AppRouter.use("/public", publicRouter);
AppRouter.use("/events", EventsRouter);
AppRouter.use("/misc", MiscRouter);

export default AppRouter;
