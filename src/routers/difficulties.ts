import { Router } from "express";
import { prisma } from "../prisma";

const difficultiesRouter = Router();

difficultiesRouter.get("/", async (_req, res) => {
  const difficulties = await prisma.difficulty.findMany();
  res.send(difficulties);
});

export { difficultiesRouter };
