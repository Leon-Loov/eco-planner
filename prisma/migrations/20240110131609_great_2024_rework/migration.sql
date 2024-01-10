/*
  Warnings:

  - You are about to drop the column `parent_id` on the `action` table. All the data in the column will be lost.
  - You are about to drop the column `data_series_id` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `national_goal_id` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `national_roadmap_id` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `is_national` on the `roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `roadmap` table. All the data in the column will be lost.
  - You are about to drop the `_action_edit_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_action_editors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_action_goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_action_view_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_action_viewers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_data_series_edit_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_data_series_editors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_data_series_view_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_data_series_viewers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_goal_edit_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_goal_editors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_goal_view_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_goal_viewers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_roadmap_goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[goal_id]` on the table `data_series` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `goal_id` to the `action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_id` to the `data_series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roadmap_id` to the `goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_roadmap_id` to the `roadmap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `roadmap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_action_edit_groups` DROP FOREIGN KEY `_action_edit_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_action_edit_groups` DROP FOREIGN KEY `_action_edit_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_action_editors` DROP FOREIGN KEY `_action_editors_A_fkey`;

-- DropForeignKey
ALTER TABLE `_action_editors` DROP FOREIGN KEY `_action_editors_B_fkey`;

-- DropForeignKey
ALTER TABLE `_action_goal` DROP FOREIGN KEY `_action_goal_A_fkey`;

-- DropForeignKey
ALTER TABLE `_action_goal` DROP FOREIGN KEY `_action_goal_B_fkey`;

-- DropForeignKey
ALTER TABLE `_action_view_groups` DROP FOREIGN KEY `_action_view_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_action_view_groups` DROP FOREIGN KEY `_action_view_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_action_viewers` DROP FOREIGN KEY `_action_viewers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_action_viewers` DROP FOREIGN KEY `_action_viewers_B_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_edit_groups` DROP FOREIGN KEY `_data_series_edit_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_edit_groups` DROP FOREIGN KEY `_data_series_edit_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_editors` DROP FOREIGN KEY `_data_series_editors_A_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_editors` DROP FOREIGN KEY `_data_series_editors_B_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_view_groups` DROP FOREIGN KEY `_data_series_view_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_view_groups` DROP FOREIGN KEY `_data_series_view_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_viewers` DROP FOREIGN KEY `_data_series_viewers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_data_series_viewers` DROP FOREIGN KEY `_data_series_viewers_B_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_edit_groups` DROP FOREIGN KEY `_goal_edit_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_edit_groups` DROP FOREIGN KEY `_goal_edit_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_editors` DROP FOREIGN KEY `_goal_editors_A_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_editors` DROP FOREIGN KEY `_goal_editors_B_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_view_groups` DROP FOREIGN KEY `_goal_view_groups_A_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_view_groups` DROP FOREIGN KEY `_goal_view_groups_B_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_viewers` DROP FOREIGN KEY `_goal_viewers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_goal_viewers` DROP FOREIGN KEY `_goal_viewers_B_fkey`;

-- DropForeignKey
ALTER TABLE `_roadmap_goal` DROP FOREIGN KEY `_roadmap_goal_A_fkey`;

-- DropForeignKey
ALTER TABLE `_roadmap_goal` DROP FOREIGN KEY `_roadmap_goal_B_fkey`;

-- DropForeignKey
ALTER TABLE `action` DROP FOREIGN KEY `action_parent_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_action_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_goal_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_roadmap_id_fkey`;

-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `goal_data_series_id_fkey`;

-- DropForeignKey
ALTER TABLE `link` DROP FOREIGN KEY `link_action_id_fkey`;

-- DropForeignKey
ALTER TABLE `link` DROP FOREIGN KEY `link_goal_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_action_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_author_id_fkey`;

-- AlterTable
ALTER TABLE `action` DROP COLUMN `parent_id`,
    ADD COLUMN `goal_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `meta_roadmap_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `data_series` ADD COLUMN `goal_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `goal` DROP COLUMN `data_series_id`,
    DROP COLUMN `national_goal_id`,
    DROP COLUMN `national_roadmap_id`,
    ADD COLUMN `roadmap_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `link` ADD COLUMN `meta_roadmap_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `roadmap` DROP COLUMN `county`,
    DROP COLUMN `is_national`,
    DROP COLUMN `municipality`,
    DROP COLUMN `name`,
    ADD COLUMN `meta_roadmap_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `target_version` INTEGER NULL,
    ADD COLUMN `version` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_action_edit_groups`;

-- DropTable
DROP TABLE `_action_editors`;

-- DropTable
DROP TABLE `_action_goal`;

-- DropTable
DROP TABLE `_action_view_groups`;

-- DropTable
DROP TABLE `_action_viewers`;

-- DropTable
DROP TABLE `_data_series_edit_groups`;

-- DropTable
DROP TABLE `_data_series_editors`;

-- DropTable
DROP TABLE `_data_series_view_groups`;

-- DropTable
DROP TABLE `_data_series_viewers`;

-- DropTable
DROP TABLE `_goal_edit_groups`;

-- DropTable
DROP TABLE `_goal_editors`;

-- DropTable
DROP TABLE `_goal_view_groups`;

-- DropTable
DROP TABLE `_goal_viewers`;

-- DropTable
DROP TABLE `_roadmap_goal`;

-- DropTable
DROP TABLE `notes`;

-- CreateTable
CREATE TABLE `meta_roadmap` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('NATIONAL', 'REGIONAL', 'MUNICIPAL', 'LOCAL', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `actor` VARCHAR(191) NULL,
    `parent_roadmap_id` VARCHAR(191) NULL,
    `author_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `note` TEXT NOT NULL,
    `action_id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_meta_roadmap_editors` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_meta_roadmap_editors_AB_unique`(`A`, `B`),
    INDEX `_meta_roadmap_editors_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_meta_roadmap_edit_groups` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_meta_roadmap_edit_groups_AB_unique`(`A`, `B`),
    INDEX `_meta_roadmap_edit_groups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_meta_roadmap_viewers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_meta_roadmap_viewers_AB_unique`(`A`, `B`),
    INDEX `_meta_roadmap_viewers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_meta_roadmap_view_groups` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_meta_roadmap_view_groups_AB_unique`(`A`, `B`),
    INDEX `_meta_roadmap_view_groups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `data_series_goal_id_key` ON `data_series`(`goal_id`);

-- AddForeignKey
ALTER TABLE `meta_roadmap` ADD CONSTRAINT `meta_roadmap_parent_roadmap_id_fkey` FOREIGN KEY (`parent_roadmap_id`) REFERENCES `meta_roadmap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meta_roadmap` ADD CONSTRAINT `meta_roadmap_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap` ADD CONSTRAINT `roadmap_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `goal` ADD CONSTRAINT `goal_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_series` ADD CONSTRAINT `data_series_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `action` ADD CONSTRAINT `action_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link` ADD CONSTRAINT `link_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link` ADD CONSTRAINT `link_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link` ADD CONSTRAINT `link_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_meta_roadmap_id_fkey` FOREIGN KEY (`meta_roadmap_id`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_editors` ADD CONSTRAINT `_meta_roadmap_editors_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_editors` ADD CONSTRAINT `_meta_roadmap_editors_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_edit_groups` ADD CONSTRAINT `_meta_roadmap_edit_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_edit_groups` ADD CONSTRAINT `_meta_roadmap_edit_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_viewers` ADD CONSTRAINT `_meta_roadmap_viewers_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_viewers` ADD CONSTRAINT `_meta_roadmap_viewers_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_view_groups` ADD CONSTRAINT `_meta_roadmap_view_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `meta_roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_meta_roadmap_view_groups` ADD CONSTRAINT `_meta_roadmap_view_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;