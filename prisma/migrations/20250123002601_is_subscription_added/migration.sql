/*
  Warnings:

  - Added the required column `is_subscription` to the `Normalization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Normalization" ADD COLUMN     "is_subscription" BOOLEAN NOT NULL;
