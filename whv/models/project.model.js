module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("project", {
        pj_id: {
            type: Sequelize.INTEGER
        },
        pj_name: {
            type: Sequelize.STRING
        },
        pj_date: {
            type: Sequelize.DATEONLY
        },
        pj_leader: {
            type: Sequelize.STRING
        },
        pj_instruction: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "project"
    });
    return Project;
};