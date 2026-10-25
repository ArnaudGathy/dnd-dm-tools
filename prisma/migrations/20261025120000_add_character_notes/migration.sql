-- CreateTable
CREATE TABLE "CharacterNote" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "characterId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CharacterNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CharacterNote_characterId_idx" ON "CharacterNote"("characterId");

-- AddForeignKey
ALTER TABLE "CharacterNote" ADD CONSTRAINT "CharacterNote_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data migration: existing rich notes become each character's first note.
-- Skips empty editors (Tiptap stores a cleared editor as "<p></p>").
INSERT INTO "CharacterNote" ("characterId", "title", "content", "createdAt", "updatedAt")
SELECT "id", 'Notes', "richNotes", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Character"
WHERE "richNotes" IS NOT NULL
  AND btrim(regexp_replace("richNotes", '<[^>]*>', '', 'g')) <> '';
