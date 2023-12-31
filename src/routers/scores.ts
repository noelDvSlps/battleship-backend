import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { prisma } from "../prisma";
import { authMiddleware } from "../auth-utils";

const scoresRouter = Router();

scoresRouter.get("/", async (req, res) => {
  let level = req.query.level as string;

  const filter = level === undefined ? { gte: 0 } : { equals: +level };

  const scores = await prisma.score.findMany({
    where: {
      difficultyId: filter,
    },
    orderBy: [
      {
        value: "desc",
      },
    ],
    include: {
      user: {
        select: {
          username: true,
        },
      },
      difficulty: {
        select: {
          difficulty: true,
        },
      },
    },
  });
  res.send(scores);
});

scoresRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: z.object({
      userId: z.number(),
      value: z.number(),
      difficultyId: z.number(),
    }),
  }),
  async (req, res) => {
    try {
      const newScore = await prisma.score.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send(newScore);
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  }
);

export { scoresRouter };
