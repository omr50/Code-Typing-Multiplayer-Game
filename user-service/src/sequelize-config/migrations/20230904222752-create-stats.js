'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Stats', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
      },
      userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'users',  // The name of the table that holds the referenced column
              key: 'id'        // The name of the column in the referenced table
          },
          onDelete: 'CASCADE' // Make sure to remove stats when a user is removed
      },
      wpm: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      mistakes: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      accuracy: {
          type: Sequelize.FLOAT,
          allowNull: false
      },
      raceDate: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
      }
  });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('Stats');
  }
};
