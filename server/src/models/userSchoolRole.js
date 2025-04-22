"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UserSchoolRole extends Model {}

    UserSchoolRole.init(
        {
            user_id: {
                type: DataTypes.CHAR(36),
                allowNull: false,
                primaryKey: true
            },
            school_id: {
                type: DataTypes.CHAR(36),
                allowNull: false,
                primaryKey: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        },
        {
            sequelize,
            modelName: "UserSchoolRole",
            tableName: "user_school_roles",
            timestamps: true
        }
    );

    return UserSchoolRole;
};
