// 检查用户权限
const checkAdminAuth = (req, res, next) => {
    if (req.session.user == null || req.session.user.user_level == 0) {
        res.redirect("/login.html");
    }
    else {
        next();
    }
};

// 更改项目名称
const updatePjName = (db, req, res, next) => {
    const oldValue = req.body.oldValue;
    const newValue = req.body.newValue;
    db.sequelize.query("select pj_name from project where pj_name = ?", {
        replacements: [newValue],
		type: db.sequelize.QueryTypes.SELECT
    }).then((selectPjRes) => {
        if (selectPjRes.length == 0) {
            db.sequelize.query("update project set pj_name = ?");


            db.sequelize.query("update project set pj_name = ? where pj_name = ?", {
                replacements: [newValue, oldValue],
                type: db.sequelize.QueryTypes.UPDATE
            }).then((update_project_instance) => {
                res.json({
                    result: 1
                });
            })
            .catch(() => {
                res.json({
                    result: 0
                });
            });
        }
        else {
            res.json({
                result: 0
            });
        }
    });
};

// 更改项目时间
const updatePjDate = (db, req, res, next) => {
    const pj_name = req.body.pj_name;
    const newValue = req.body.newValue;
    db.sequelize.query("update project set pj_date = ? where pj_name = ?", {
        replacements: [newValue, pj_name],
        type: db.sequelize.QueryTypes.UPDATE
    }).then((update_project_instance) => {
        res.json({
            result: 1
        });
    }).catch(() => {
        res.json({
            result: 0
        });
    });
};

// 删除单个项目
const deleteOnePj = (db, pj_name, res) => {
    db.sequelize.query("select pj_id from project where pj_name = ?", {
        replacements: [pj_name],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        db.sequelize.query("delete from project where pj_id = ?", {
            replacements: [selectPjRes[0].pj_id],
            type: db.sequelize.QueryTypes.DELETE
        })
        .then((deletePjRes) => {
            db.sequelize.query("delete from hybrid where pj_id = ?", {
                replacements: [selectPjRes[0].pj_id],
                type: db.sequelize.QueryTypes.DELETE
            })
            .then((deleteHyRes) => {
               
            })
            .catch((deleteHyErr) => {
                res.json({
                    result: 0,
                    msg: "delete hybrid error"
                });
            });
        })
        .catch((deletePjErr) => {
            res.json({
                result: 0,
                msg: "delete project error"
            });
        });
    });
};

const test = (res) => {
    res.json({
        result: 0
    });
}

const adminController = {};
adminController.checkAdminAuth = checkAdminAuth;
adminController.updatePjName = updatePjName;
adminController.updatePjDate = updatePjDate;
adminController.deleteOnePj = deleteOnePj;
adminController.test = test;

module.exports = adminController;
