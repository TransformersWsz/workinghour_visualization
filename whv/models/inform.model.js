module.exports = (sequelize, Sequelize) => {
    const Inform = sequelize.define("inform", {
        receiver_name: {
            type: Sequelize.STRING
        },
        receiver_email: {
            type: Sequelize.DATEONLY
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "inform"
    });
    return Inform;
};