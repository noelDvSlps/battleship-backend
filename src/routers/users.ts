import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../prisma";
import {
  encryptPassword,
  createUnsecuredUserInformation,
  createTokenForUser,
  authMiddleware,
} from "../auth-utils";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

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

usersRouter.post(
  "/register/",
  validateRequest({
    body: z.object({
      username: z
        .string({
          errorMap: (err) => ({
            message: "username is required and must be a string",
          }),
        })
        .min(4, {
          message: "username should be greater than 3 characters",
        })
        .max(20, {
          message: "username should be less than 21 characters",
        }),
      password: z
        .string({
          errorMap: (err) => ({
            message: "password is required and must be a string",
          }),
        })
        .min(4, {
          message: "password should be greater than 3 characters",
        })
        .max(20, {
          message: "password should be less than 21 characters",
        }),
    }),
  }),
  async (req, res) => {
    try {
      const hashedPassword = await encryptPassword(req.body.password);
      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          password: hashedPassword,
        },
      });
      res.status(201).send(newUser);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          const target = e.meta?.target;
          res.status(500).send({
            error: `There is a unique constraint violation, a new user cannot be created with this ${target}`,
          });
          return;
        }
      }
      res.status(500).send(e);
    }
  }
);

export { usersRouter };
