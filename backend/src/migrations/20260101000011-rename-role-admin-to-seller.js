'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_users_role" RENAME VALUE \'admin\' TO \'seller\';'
      );
      return;
    }

    // MySQL e MariaDB não possuem um tipo ENUM que possa ser renomeado. Os valores
    // permitidos ficam na própria coluna, então os registros existentes precisam ser
    // atualizados antes de remover "admin" da definição da coluna.
    await queryInterface.sequelize.query("UPDATE users SET role = 'seller' WHERE role = 'admin';");
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('customer', 'seller'),
      allowNull: false,
      defaultValue: 'customer',
    });
  },

  down: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_users_role" RENAME VALUE \'seller\' TO \'admin\';'
      );
      return;
    }

    await queryInterface.sequelize.query("UPDATE users SET role = 'admin' WHERE role = 'seller';");
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('customer', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
    });
  },
};
