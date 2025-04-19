"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const UserSchool = sequelize.define('UserSchool', {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        school_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        is_owner: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_teacher: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_coordinator: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'UserSchools',
        timestamps: true
    });

    UserSchool.associate = function(models) {
        UserSchool.belongsTo(models.User, { foreignKey: 'user_id' });
        UserSchool.belongsTo(models.School, { foreignKey: 'school_id' });
    };

    return UserSchool;
};