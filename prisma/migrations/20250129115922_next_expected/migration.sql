/*
  Warnings:

  - You are about to drop the column `next_excepted` on the `DetectedPatterns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DetectedPatterns" DROP COLUMN "next_excepted",
ADD COLUMN     "next_expected" TEXT;
