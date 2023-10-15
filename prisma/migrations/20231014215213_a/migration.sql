/*
  Warnings:

  - You are about to drop the column `AdditionalNotes` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `TimeSlot` on the `Bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "AdditionalNotes",
DROP COLUMN "TimeSlot",
ADD COLUMN     "additionalNotes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timeSlot" INTEGER NOT NULL DEFAULT 0;
