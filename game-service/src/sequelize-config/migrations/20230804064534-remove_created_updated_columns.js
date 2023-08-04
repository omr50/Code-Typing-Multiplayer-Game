'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('snippets', 'createdAt');
    await queryInterface.removeColumn('snippets', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('snippets', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('snippets', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
  }
};
