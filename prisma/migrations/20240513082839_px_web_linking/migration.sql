-- AlterTable
ALTER TABLE `goal` ADD COLUMN `external_dataset` VARCHAR(191) NULL,
    ADD COLUMN `external_id` VARCHAR(191) NULL,
    ADD COLUMN `external_selection` VARCHAR(191) NULL;
