import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  //1. first check if the user exist
  //2. Compare the password
  //3. Generate Token

  const userData = await pool.query(
    `
    
    
    SELECT * FROM users WHERE email=$1
    
    `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];
  // console.log("user", user);
  const matchPassword = await bcrypt.compare(password, user.password);
  console.log("matchedPassword", matchPassword);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  //Generate Token

  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
