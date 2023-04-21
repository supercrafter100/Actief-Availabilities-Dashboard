-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "hourlyWage" DECIMAL NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Workday_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workday" ("createdAt", "date", "end", "hourlyWage", "id", "start", "updatedAt", "userId") SELECT "createdAt", "date", "end", "hourlyWage", "id", "start", "updatedAt", "userId" FROM "Workday";
DROP TABLE "Workday";
ALTER TABLE "new_Workday" RENAME TO "Workday";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
