/*
  Warnings:

  - Added the required column `nandSize` to the `HackedXboxs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HackedXboxs" ADD COLUMN     "nandSize" TEXT NOT NULL;
