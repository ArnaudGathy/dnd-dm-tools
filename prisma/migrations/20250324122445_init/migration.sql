-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "owner" TEXT NOT NULL,
    "spells" TEXT[],

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
