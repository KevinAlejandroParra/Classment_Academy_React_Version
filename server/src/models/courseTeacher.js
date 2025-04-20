"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CourseTeacher extends Model {}
  CourseTeacher.init(
    {
      course_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      teacher_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },

    },
    {
      sequelize,
      modelName: "CourseTeacher",
      tableName: "course_teachers",
      timestamps: true
      }
  );
  return CourseTeacher;
};
