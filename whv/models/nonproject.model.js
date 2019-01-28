module.exports = (sequelize, Sequelize) => {
    const Nonproject = sequelize.define("nonproject", {
        np_id: {
            type: Sequelize.INTEGER
        },
        np_name: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "nonproject"
    });
    return Nonproject;
};