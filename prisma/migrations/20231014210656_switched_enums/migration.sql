/*
  Warnings:

  - The `serviceType` column on the `Bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "AdditionalNotes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "TimeSlot" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "serviceType",
ADD COLUMN     "serviceType" INTEGER NOT NULL DEFAULT 0;
