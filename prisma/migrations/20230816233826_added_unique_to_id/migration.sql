/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `score` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[difficultyId]` on the table `score` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "score_userId_key" ON "score"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "score_difficultyId_key" ON "score"("difficultyId");
