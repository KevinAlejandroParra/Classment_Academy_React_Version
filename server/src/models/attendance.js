"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {}
  Attendance.init(
    {
      attendance_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late"),
        allowNull: false,
        defaultValue: "absent"
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Attendance",
      timestamps: true
    }
  );

  return Attendance;
}; 