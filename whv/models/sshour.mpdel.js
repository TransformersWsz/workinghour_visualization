module.exports = (sequelize, Sequelize) => {
    const Sshour = sequelize.define("sshour", {
        ss_id: {
            type: Sequelize.INTEGER
        },
        year_id: {
            type: Sequelize.INTEGER
        },
        month_name: {
            type: Sequelize.STRING
        },
        swh: {
            type: Sequelize.INTEGER
        },
        phh: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "sshour"
    });
    return Sshour;
};