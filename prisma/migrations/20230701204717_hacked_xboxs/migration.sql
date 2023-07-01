-- CreateTable
CREATE TABLE "HackedXboxs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xboxType" TEXT NOT NULL,
    "xboxColour" TEXT NOT NULL,
    "motherboardType" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "mfrDate" TIMESTAMP(3) NOT NULL,
    "model" TEXT NOT NULL,
    "rghVersion" TEXT NOT NULL,
    "rghType" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackedXboxs_pkey" PRIMARY KEY ("id")
);
