'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'pending_admin', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
      console.log('Columna pending_admin agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar la columna:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'pending_admin');
      console.log('Columna pending_admin eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la columna:', error);
      throw error;
    }
  }
}; 