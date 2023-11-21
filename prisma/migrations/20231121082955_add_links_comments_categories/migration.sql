-- AlterTable
ALTER TABLE `action` ADD COLUMN `is_efficiency` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_renewables` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_sufficiency` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `link` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `action_id` VARCHAR(191) NULL,
    `goal_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `comment_text` TEXT NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `action_id` VARCHAR(191) NULL,
    `goal_id` VARCHAR(191) NULL,
    `roadmap_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `link` ADD CONSTRAINT `link_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link` ADD CONSTRAINT `link_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_goal_id_fkey` FOREIGN KEY (`goal_id`) REFERENCES `goal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
