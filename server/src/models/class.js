"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {}
  Class.init(
    {
      class_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      teacher_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      class_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      class_title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      class_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER, // Duración en minutos
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Class",
      timestamps: true
    }
  );

  return Class;
}; 