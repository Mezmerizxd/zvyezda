/*
  Warnings:

  - You are about to drop the column `rghType` on the `HackedXboxs` table. All the data in the column will be lost.
  - Added the required column `rghGlitchType` to the `HackedXboxs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HackedXboxs" DROP COLUMN "rghType",
ADD COLUMN     "rghGlitchType" TEXT NOT NULL;
