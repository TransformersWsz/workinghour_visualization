module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        role_id: {
            type: Sequelize.INTEGER
        },
        role_name: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'role'
    });
    return Role;
};