"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}
    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_lastname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_document_type: {
                type: DataTypes.ENUM("TI", "CC", "CE"),
                allowNull: false,
            },
            user_document: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            user_email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_phone: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            user_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_birth: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            user_role: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
            timestamps: true,
        }
    );
    return User;
};
