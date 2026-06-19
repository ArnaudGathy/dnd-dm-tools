-- CreateTable
CREATE TABLE "CachedSpell" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "CachedSpell_pkey" PRIMARY KEY ("id")
);
