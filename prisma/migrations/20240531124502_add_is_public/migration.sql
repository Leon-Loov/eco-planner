-- AlterTable
ALTER TABLE `meta_roadmap` ADD COLUMN `is_public` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `roadmap` ADD COLUMN `is_public` BOOLEAN NOT NULL DEFAULT false;
