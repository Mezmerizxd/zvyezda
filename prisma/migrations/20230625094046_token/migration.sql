/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenExp` to the `Accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "tokenExp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_token_key" ON "Accounts"("token");
