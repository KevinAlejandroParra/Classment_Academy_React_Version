"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {}
  Payment.init(
    {
      payment_id: {
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
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending"
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payment_details: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Payment",
      timestamps: true
    }
  );

  return Payment;
};