module.exports = (sequelize, Sequelize) => {
    const Usernp = sequelize.define("usernp", {
        un_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        np_id: {
            type: Sequelize.INTEGER
        },
        year_name: {
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
        tableName: "usernp"
    });
    return Usernp;
};