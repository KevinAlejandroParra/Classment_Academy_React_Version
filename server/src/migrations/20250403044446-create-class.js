'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      class_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'course_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      class_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      class_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      class_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Classes');
  }
};

