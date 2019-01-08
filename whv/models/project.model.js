module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("project", {
        pj_id: {
            type: Sequelize.INTEGER
        },
        pj_name: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "project"
    });
    return Project;
};