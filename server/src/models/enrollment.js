"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {}
  Enrollment.init(
    {
      enrollment_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
      },
      course_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("active", "completed", "cancelled", "pending"),
        allowNull: false,
        defaultValue: "active"
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      course_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Enrollment",
      timestamps: true

    }
  );

  return Enrollment;
};
