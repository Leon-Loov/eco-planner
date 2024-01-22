/*
  Warnings:

  - A unique constraint covering the columns `[meta_roadmap_id,version]` on the table `roadmap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `roadmap_meta_roadmap_id_version_key` ON `roadmap`(`meta_roadmap_id`, `version`);
