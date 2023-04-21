/*
  Warnings:

  - You are about to drop the `WorkDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkDay";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Workday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "hourlyWage" DECIMAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Workday_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
