/*
  Warnings:

  - You are about to drop the column `file_url` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "file_url",
DROP COLUMN "name",
ADD COLUMN     "banner_url" TEXT,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "project_url" TEXT,
ADD COLUMN     "role" "ProjectRole" NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_role_idx" ON "projects"("role");

-- CreateIndex
CREATE INDEX "projects_isPublished_idx" ON "projects"("isPublished");
