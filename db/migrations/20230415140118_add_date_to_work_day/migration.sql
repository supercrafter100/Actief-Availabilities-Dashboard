/*
  Warnings:

  - Added the required column `date` to the `WorkDay` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkDay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "hourlyWage" DECIMAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "WorkDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkDay" ("createdAt", "end", "hourlyWage", "id", "start", "updatedAt", "userId") SELECT "createdAt", "end", "hourlyWage", "id", "start", "updatedAt", "userId" FROM "WorkDay";
DROP TABLE "WorkDay";
ALTER TABLE "new_WorkDay" RENAME TO "WorkDay";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
