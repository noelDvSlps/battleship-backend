-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "difficultyId" INTEGER NOT NULL,
    CONSTRAINT "score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "score_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_score" ("difficultyId", "id", "userId", "value") SELECT "difficultyId", "id", "userId", "value" FROM "score";
DROP TABLE "score";
ALTER TABLE "new_score" RENAME TO "score";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
