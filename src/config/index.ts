import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const config = {
  c_str: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  ref_secret: process.env.REF_SECRET,
};

export default config;
