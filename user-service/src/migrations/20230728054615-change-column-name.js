module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn('users', 'name', 'username');
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.renameColumn('users', 'username', 'name');
  }
};
