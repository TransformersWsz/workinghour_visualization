// 检查用户权限
const checkAdminAuth = (req, res, next) => {
    if (req.session.user == null || req.session.user.user_level == 0) {
        res.redirect("/login.html");
    }
    else {
        next();
    }
};

// 添加项目
const addProject = (db, req, res, next) => {
    db.sequelize.query("select pj_id, pj_name from project where pj_name = ?", {
		replacements: [req.body.pj_name],
		type: db.sequelize.QueryTypes.SELECT
	})
	.then((result) => {
		// 项目不存在
		if (result.length == 0) {
            db.sequelize.query("insert into project(pj_name, pj_date, pj_leader, pj_instruction) values(?, ?, ?, ?)", {
                replacements: [req.body.pj_name, req.body.pj_date, req.body.pj_leader, req.body.pj_instruction],
		        type: db.sequelize.QueryTypes.INSERT
            })
            .then((project_instance) => {
                res.json({
					result: 1
				});
            })
            .catch((insertErr) => {
                res.json({
                    result: 0,
                    msg: "add project failure"
                });
            });
        } 
        // 项目存在
        else {
			res.json({
				result: 0
			});
		}
	});
};

const getProject = (db, req, res, next) => {
    db.sequelize.query("select pj_name, pj_date, pj_leader, pj_instruction from project", {
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        res.json(selectPjRes);
    });
}

// 更改项目名称或者负责人或者简介
const updatePjExceptDate = (db, req, res, next) => {
    if (req.body.isPjNameField == 1) {
        db.sequelize.query("select pj_name from project where pj_name = ?", {
            replacements: [req.body.pj_name],
            type: db.sequelize.QueryTypes.SELECT
        }).then((selectPjRes) => {
            if (selectPjRes.length == 0) {
                db.sequelize.query("update project set pj_name = ? where pj_name = ?", {
                    replacements: [req.body.pj_name, req.body.selectColumn],
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
                    result: 2
                });
            }
        });
    }
    else {
        db.sequelize.query("update project set pj_leader = ?, pj_instruction = ? where pj_name = ?", {
            replacements: [req.body.pj_leader, req.body.pj_instruction, req.body.selectColumn],
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
adminController.getProject = getProject;
adminController.updatePjDate = updatePjDate;
adminController.deleteOnePj = deleteOnePj;
adminController.addProject = addProject;
adminController.updatePjExceptDate = updatePjExceptDate;
adminController.test = test;

module.exports = adminController;
