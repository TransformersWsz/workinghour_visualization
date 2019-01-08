module.exports = (sequelize, Sequelize) => {
    const Hybrid = sequelize.define("hybrid", {
        user_id: {
            type: Sequelize.INTEGER
        },
        pj_id: {
            type: Sequelize.INTEGER
        },
        role_id: {
            type: Sequelize.INTEGER
        },
        month_name: {
            type: Sequelize.STRING
        },
        hour_time: {
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "hybrid"
    });
    return Hybrid;
};