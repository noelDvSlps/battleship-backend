import { User } from "@prisma/client";
import express from "express";
import cors from "cors";
import { usersRouter } from "./routers/users";
import { difficultiesRouter } from "./routers/difficulties";
import { scoresRouter } from "./routers/scores";

const app = express();
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send(`<h1>Item Tracker</h1>`);
});

app.use("/users", usersRouter);
app.use("/difficulties", difficultiesRouter);
app.use("/scores", scoresRouter);

app.listen(3000);
