import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
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
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.secret as string,
    {
      expiresIn: config.expire_Time,
    } as SignOptions,
  );
  const refreshToken = jwt.sign(
    jwtPayload,
    config.ref_secret as string,
    {
      expiresIn: config.expire_Time,
    } as SignOptions,
  );

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized!!");
  }
  const decoded = jwt.verify(token, config.ref_secret as string) as JwtPayload;
  const userData = await pool.query(
    `
      
      
      SELECT * FROM users WHERE email=$1
      `,
    [decoded.email],
  );

  const user = userData.rows[0];
  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  if (!user?.is_active) {
    throw new Error("Forbidden");
  }

  //Generate Token

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.secret as string,
    {
      expiresIn: config.expire_Time,
    } as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
