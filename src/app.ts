import express, { type Application } from "express";

import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { profileRoute } from "./modules/profile/profile.route";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(logger);
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

//Global Error Handling Middleware

app.use(globalErrorHandler);

export default app;
