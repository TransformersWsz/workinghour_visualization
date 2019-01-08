const env = require("./env.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    pool: env.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.project = require("../models/project.model.js")(sequelize, Sequelize);

db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.user = require("../models/user.model.js")(sequelize, Sequelize);

db.hybrid = require("../models/hybrid.model.js")(sequelize, Sequelize);

module.exports = db;