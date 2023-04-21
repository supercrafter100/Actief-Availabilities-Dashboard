-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "hourlyWage" DECIMAL NOT NULL DEFAULT 8
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "role", "sub", "updatedAt") SELECT "createdAt", "email", "id", "name", "role", "sub", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
