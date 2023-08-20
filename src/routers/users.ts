import { NextFunction, Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../prisma";
import {
  createTokenForApp,
  encryptPassword,
  createUnsecuredUserInformation,
  createTokenForUser,
} from "../auth-utils";
import bcrypt from "bcrypt";

const usersRouter = Router();

usersRouter.get(
  "/",
  validateRequest({
    query: z
      .object({
        nameHas: z.string(),
      })
      .strict()
      .partial(),
  }),
  async (req, res) => {
    const nameHas = req.query.nameHas as string;
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: nameHas,
        },
      },
    });
    res.send(users);
  }
);

usersRouter.post(
  "/",
  validateRequest({
    body: z.object({
      password: z.string(),
      username: z.string(),
    }),
  }),
  async (req, res) => {
    const password = req.body.password as string;
    const username = req.body.username as string;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Username not found" });
    }

    const isPasswordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    const userInformation = createUnsecuredUserInformation(user);
    const token = createTokenForUser(user);
    return res.status(200).json({ token, userInformation });
  }
);

export { usersRouter };
