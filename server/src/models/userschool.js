"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserSchool extends Model {}
    UserSchool.init(
        {
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            school_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            is_owner: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            is_student: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            enrollment_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "UserSchool",
            timestamps: true,
        }
    );
    return UserSchool;
}; 