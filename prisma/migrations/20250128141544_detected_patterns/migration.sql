-- CreateTable
CREATE TABLE "DetectedPatterns" (
    "id" SERIAL NOT NULL,
    "merchant" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "next_excepted" TEXT,
    "detail" TEXT,

    CONSTRAINT "DetectedPatterns_pkey" PRIMARY KEY ("id")
);
