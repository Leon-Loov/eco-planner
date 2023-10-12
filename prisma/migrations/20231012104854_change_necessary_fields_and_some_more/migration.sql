/*
  Warnings:

  - You are about to drop the column `goal_object` on the `goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `action` MODIFY `description` TEXT NULL,
    MODIFY `cost_efficiency` TEXT NULL,
    MODIFY `expected_outcome` TEXT NULL,
    MODIFY `project_manager` VARCHAR(191) NULL,
    MODIFY `relevant_actors` TEXT NULL;

-- AlterTable
ALTER TABLE `data_series` ADD COLUMN `scale` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `goal` DROP COLUMN `goal_object`,
    ADD COLUMN `description` TEXT NULL,
    MODIFY `name` VARCHAR(191) NULL;
