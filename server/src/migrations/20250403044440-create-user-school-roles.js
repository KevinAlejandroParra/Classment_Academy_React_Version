'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_school_roles', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      school_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
        allowNull: false,
      }
    });

   // FK: user_id → users
   await queryInterface.addConstraint('user_school_roles', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'fk_user_school_roles_user',
    references: {
      table: 'users',
      field: 'user_id'
    },
    onDelete: 'cascade'
  });

  // FK: school_id → schools
  await queryInterface.addConstraint('user_school_roles', {
    fields: ['school_id'],
    type: 'foreign key',
    name: 'fk_user_school_roles_school',
    references: {
      table: 'schools',
      field: 'school_id'
    },
    onDelete: 'cascade'
  });

  // FK: role_id → roles
  await queryInterface.addConstraint('user_school_roles', {
    fields: ['role_id'],
    type: 'foreign key',
    name: 'fk_user_school_roles_role',
    references: {
      table: 'roles',
      field: 'role_id'
    },
    onDelete: 'cascade'
  });
},

down: async (queryInterface) => {
  await queryInterface.dropTable('user_school_roles');
}
};