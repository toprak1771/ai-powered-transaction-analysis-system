-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "total_spend" DOUBLE PRECISION,
    "transactions" INTEGER,
    "average_transactions" DOUBLE PRECISION,
    "merchants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Normalization" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sub_category" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "flags" TEXT[],

    CONSTRAINT "Normalization_pkey" PRIMARY KEY ("id")
);
