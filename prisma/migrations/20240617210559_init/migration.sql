/*
  Warnings:

  - You are about to drop the `UpdatesPoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UpdatesPoint" DROP CONSTRAINT "UpdatesPoint_updateId_fkey";

-- DropTable
DROP TABLE "UpdatesPoint";
