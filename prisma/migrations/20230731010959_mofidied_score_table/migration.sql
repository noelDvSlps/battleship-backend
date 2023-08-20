/*
  Warnings:

  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userScoreId` on the `score` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Level";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "userScore";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Difficulty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "gridsize" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL DEFAULT 1,
    "difficultyId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "score_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_score" ("id") SELECT "id" FROM "score";
DROP TABLE "score";
ALTER TABLE "new_score" RENAME TO "score";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
