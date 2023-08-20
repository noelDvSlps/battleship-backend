import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
const saltRounds = 11;

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const createUnsecuredUserInformation = (user: User) => ({
  username: user.username,
  userId: user.id,
});

export const createTokenForUser = (user: User) => {
  return jwt.sign(user, process.env.JWT_SECRET as string);
};

export const createTokenForApp = () => {
  return jwt.sign(
    process.env.JWT_SECRET as string,
    process.env.JWT_SECRET as string
  );
};

const jwtInfoSchema = z.object({
  username: z.string(),
  iat: z.number(),
});

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwtInfoSchema.parse(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split?.(" ") || [];
  const myJwtData = getDataFromAuthToken(token);
  if (!myJwtData) {
    return res.status(401).json({ message: "invalid Token" });
  }

  const userFromJwt = await prisma.user.findFirst({
    where: {
      username: myJwtData.username,
    },
  });

  if (!userFromJwt) {
    return res.status(401).json({ message: "user not found" });
  }
  // req.user = userFromJwt;
  next();
};
