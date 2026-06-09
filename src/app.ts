import express, { type Application } from "express";
import fs from "fs";
import { authRoute } from "./modules/auth/auth.route";
import { profileRoute } from "./modules/profile/profile.route";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

app.use((req, res, next) => {
  console.log("Method-URL-Time:", req.method, req.url, Date.now());
  const log = `\nMethod->${req.method} Time->${Date.now()} Url ${req.url}\n`;
  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
});

export default app;
