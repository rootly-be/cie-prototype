-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Animation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categorieId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "Animation_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Animation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Animation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "billetwebUrl" TEXT,
    "billetwebId" TEXT,
    "placesTotal" INTEGER,
    "placesLeft" INTEGER,
    "isFull" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categorieId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "Formation_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Formation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Formation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormationDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formationId" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "lieu" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormationDate_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "periode" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "prix" TEXT NOT NULL,
    "billetwebUrl" TEXT,
    "billetwebId" TEXT,
    "placesTotal" INTEGER,
    "placesLeft" INTEGER,
    "isFull" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categorieId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "Stage_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Stage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Stage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgendaEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "lieu" TEXT,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "AgendaEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AgendaEvent_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "couleur" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animationId" TEXT,
    "formationId" TEXT,
    "stageId" TEXT,
    CONSTRAINT "Image_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "Animation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AnimationTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AnimationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Animation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AnimationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FormationTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FormationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Formation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FormationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StageTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_StageTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Stage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StageTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AgendaEventTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AgendaEventTags_A_fkey" FOREIGN KEY ("A") REFERENCES "AgendaEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AgendaEventTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Animation_published_idx" ON "Animation"("published");

-- CreateIndex
CREATE INDEX "Animation_niveau_idx" ON "Animation"("niveau");

-- CreateIndex
CREATE INDEX "Animation_categorieId_idx" ON "Animation"("categorieId");

-- CreateIndex
CREATE INDEX "Animation_createdAt_idx" ON "Animation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Formation_billetwebId_key" ON "Formation"("billetwebId");

-- CreateIndex
CREATE INDEX "Formation_published_idx" ON "Formation"("published");

-- CreateIndex
CREATE INDEX "Formation_categorieId_idx" ON "Formation"("categorieId");

-- CreateIndex
CREATE INDEX "Formation_billetwebId_idx" ON "Formation"("billetwebId");

-- CreateIndex
CREATE INDEX "Formation_createdAt_idx" ON "Formation"("createdAt");

-- CreateIndex
CREATE INDEX "FormationDate_formationId_idx" ON "FormationDate"("formationId");

-- CreateIndex
CREATE INDEX "FormationDate_dateDebut_idx" ON "FormationDate"("dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_billetwebId_key" ON "Stage"("billetwebId");

-- CreateIndex
CREATE INDEX "Stage_published_idx" ON "Stage"("published");

-- CreateIndex
CREATE INDEX "Stage_dateDebut_idx" ON "Stage"("dateDebut");

-- CreateIndex
CREATE INDEX "Stage_periode_idx" ON "Stage"("periode");

-- CreateIndex
CREATE INDEX "Stage_ageMin_ageMax_idx" ON "Stage"("ageMin", "ageMax");

-- CreateIndex
CREATE INDEX "Stage_categorieId_idx" ON "Stage"("categorieId");

-- CreateIndex
CREATE INDEX "Stage_billetwebId_idx" ON "Stage"("billetwebId");

-- CreateIndex
CREATE INDEX "AgendaEvent_date_idx" ON "AgendaEvent"("date");

-- CreateIndex
CREATE INDEX "AgendaEvent_published_idx" ON "AgendaEvent"("published");

-- CreateIndex
CREATE INDEX "AgendaEvent_sourceType_sourceId_idx" ON "AgendaEvent"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nom_type_key" ON "Category"("nom", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nom_key" ON "Tag"("nom");

-- CreateIndex
CREATE INDEX "Tag_nom_idx" ON "Tag"("nom");

-- CreateIndex
CREATE INDEX "Image_animationId_idx" ON "Image"("animationId");

-- CreateIndex
CREATE INDEX "Image_formationId_idx" ON "Image"("formationId");

-- CreateIndex
CREATE INDEX "Image_stageId_idx" ON "Image"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnimationTags_AB_unique" ON "_AnimationTags"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimationTags_B_index" ON "_AnimationTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormationTags_AB_unique" ON "_FormationTags"("A", "B");

-- CreateIndex
CREATE INDEX "_FormationTags_B_index" ON "_FormationTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StageTags_AB_unique" ON "_StageTags"("A", "B");

-- CreateIndex
CREATE INDEX "_StageTags_B_index" ON "_StageTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AgendaEventTags_AB_unique" ON "_AgendaEventTags"("A", "B");

-- CreateIndex
CREATE INDEX "_AgendaEventTags_B_index" ON "_AgendaEventTags"("B");
