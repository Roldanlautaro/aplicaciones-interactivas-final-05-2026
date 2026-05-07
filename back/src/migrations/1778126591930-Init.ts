import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778126591930 implements MigrationInterface {
    name = 'Init1778126591930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`member\` (\`id\` int NOT NULL AUTO_INCREMENT, \`memberNumber\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE', UNIQUE INDEX \`IDX_e0d0146c117df4740b8d955986\` (\`memberNumber\`), UNIQUE INDEX \`IDX_4678079964ab375b2b31849456\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`loan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loanDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dueDate\` datetime NOT NULL, \`returnDate\` datetime NULL, \`status\` enum ('ACTIVE', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'ACTIVE', \`bookId\` int NOT NULL, \`memberId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`book\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isbn\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`genre\` enum ('FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'TECHNOLOGY', 'CHILDREN') NOT NULL, \`totalCopies\` int NOT NULL, \`availableCopies\` int NOT NULL, \`status\` enum ('AVAILABLE', 'WITHDRAWN') NOT NULL DEFAULT 'AVAILABLE', UNIQUE INDEX \`IDX_bd183604b9c828c0bdd92cafab\` (\`isbn\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loan\` ADD CONSTRAINT \`FK_1465982ea6993042a656754f4cc\` FOREIGN KEY (\`bookId\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loan\` ADD CONSTRAINT \`FK_12f68be39258f2440220105a862\` FOREIGN KEY (\`memberId\`) REFERENCES \`member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loan\` DROP FOREIGN KEY \`FK_12f68be39258f2440220105a862\``);
        await queryRunner.query(`ALTER TABLE \`loan\` DROP FOREIGN KEY \`FK_1465982ea6993042a656754f4cc\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd183604b9c828c0bdd92cafab\` ON \`book\``);
        await queryRunner.query(`DROP TABLE \`book\``);
        await queryRunner.query(`DROP TABLE \`loan\``);
        await queryRunner.query(`DROP INDEX \`IDX_4678079964ab375b2b31849456\` ON \`member\``);
        await queryRunner.query(`DROP INDEX \`IDX_e0d0146c117df4740b8d955986\` ON \`member\``);
        await queryRunner.query(`DROP TABLE \`member\``);
    }

}
