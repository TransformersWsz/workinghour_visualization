const Method = require("../routes/method.js");

// 获取所有的项目
const getProjects = (db, req, res, next) => {
    db.sequelize.query("select pj_id, pj_name from project", {
		type: db.sequelize.QueryTypes.SELECT
    }).then((selectPjRes) => {
        res.json(selectPjRes);
    });
};

// 普通成员和管理员都可以添加自己的工作信息
const addWorkInfo = (db, req, res, next) => {

    db.sequelize.query("select hy_id from hybrid where user_id = ? and pj_id = ? and role_id = ? and year_name = ? and month_name = ?", {
        replacements: [req.session.user.user_id, req.body.pj_id, req.body.role_id, req.body.year_name, req.body.month_name],
        type: db.sequelize.QueryTypes.SELECT
    }).then((selectHyRes) => {
        if (selectHyRes.length == 0) {
            db.sequelize.query("insert into hybrid(user_id, pj_id, role_id, year_name, month_name, hour_time) values(?, ?, ?, ?, ?, ?)", {
                replacements: [req.session.user.user_id, req.body.pj_id, req.body.role_id, req.body.year_name, req.body.month_name, req.body.hour_time],
                type: db.sequelize.QueryTypes.INSERT
            })
            .then((hybrid_instance) => {
                res.json({
                    result: 1
                });
            })
            .catch((insertErr) => {
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
};

// 普通成员和管理员都可以删除自己的工作信息
const deleteOneWorkInfo = (db, workInfo, req, res) => {
    db.sequelize.query("select pj_id from project where pj_name = ?", {
        replacements: [workInfo.pj_name],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        db.sequelize.query("delete from hybrid where user_id = ? and pj_id = ? and role_id = ? and year_name = ? and month_name = ? and hour_time = ?", {
            replacements: [req.session.user.user_id, selectPjRes[0].pj_id, workInfo.role_id, workInfo.year_name, workInfo.month_name, workInfo.hour_time],
            type: db.sequelize.QueryTypes.DELETE
        })
        .then((deleteHyRes) => {
           
        })
        .catch((deleteHyErr) => {
            res.json({
                result: 0,
                msg: "delete one work info error."
            });
        });
    });
};

// 普通成员和管理员都可以获得自己的工作信息
const getWorkInfo = (db, req, res, next) => {
    var formatWorkInfoResult = [];
    db.sequelize.query("select n.np_name, usernp.month_name, usernp.hour_time from usernp join nonproject n on usernp.np_id = n.np_id where user_id = ? and year_name = ?", {
        replacements: [req.session.user.user_id, req.query.year_name],
		type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectUsernpRes) => {
        const formatUsernpRes = Method.formatUsernp(selectUsernpRes);
        Method.mergeTwoArray(formatUsernpRes, formatWorkInfoResult);

        const sql = "select temp.pj_name, temp.role_id, temp.month_name, temp.hour_time from (select p.pj_name, hybrid.role_id, hybrid.month_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id where user_id = ? and year_name = ?) as temp order by temp.pj_name, temp.month_name;";
        db.sequelize.query(sql, {
            replacements: [req.session.user.user_id, req.query.year_name],
            type: db.sequelize.QueryTypes.SELECT
        })
        .then((selectHybridRes) => {
            const formatHybridRes = Method.formatHybrid(selectHybridRes);
            Method.mergeTwoArray(formatHybridRes, formatWorkInfoResult);

            res.json(formatWorkInfoResult);
        });
    });
};

// 普通成员和管理员都可以登录
const login = (db, req, res, next) => {
    const user_account = req.body.username;
	const user_password = req.body.password;
	db.sequelize.query("select user_id, user_name, user_level from user where user_account = ? and user_password = ?", {
		replacements: [user_account, user_password],
		type: db.sequelize.QueryTypes.SELECT
	}).then((result) => {
		// 该用户不存在
		if (result.length == 0) {
            db.sequelize.query("insert into user(user_account, user_password) values(?, ?)", {
                replacements: [user_account, user_password],
                type: db.sequelize.QueryTypes.INSERT
            })
            .then((user_instance) => {
                const user_id = user_instance[0];
                db.sequelize.query("select np_id, np_name from nonproject", {
                    type: db.sequelize.QueryTypes.SELECT
                })
                .then((selectNpRes) => {
                    const selectNpResLength = selectNpRes.length;
                    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    for (let i = 0; i < selectNpResLength; i++) {
                        for (let j = 0; j < 12; j++) {
                            db.sequelize.query("insert into usernp(user_id, np_id, month_name) values(?, ?, ?)", {
                                replacements: [user_id, selectNpRes[i].np_id, month[j]],
                                type: db.sequelize.QueryTypes.INSERT
                            })
                            .then(() => {})
                            .catch(() => {});
                        }
                    }
                    const userInfo = {
                        user_id: user_id,
                        user_level: 0,
                        user_account: user_account
                    };
                    req.session.user = userInfo;
                    res.json({
                        result: 1,
                        level: 0
                    });
                });
            })
            .catch((insertErr) => {
                res.json({
                    result: 0,
                    msg: "add user failure."
                });
            });
		}
		// 该用户存在
		else {
			const userInfo = {
				user_id: result[0].user_id,
				user_name: result[0].user_name,
				user_level: result[0].user_level,
				user_account: user_account
			}
			req.session.user = userInfo;
			res.json({
				result: 1,
				level: result[0].user_level
			});
		}
	});
};

// 普通成员和管理员都可以更改自己的Private leave\Training\Administration
const updateUsernp = (db, req, res, next) => {
    db.sequelize.query("select np_id from nonproject where np_name = ?", {
        replacements: [req.body.np_name],
		type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectUsernpRes) => {
        const np_id = selectUsernpRes[0].np_id;
        db.sequelize.query("update usernp set hour_time = ? where user_id = ? and np_id = ? and year_name = ? and month_name = ?", {
            replacements: [req.body.hour_time, req.session.user.user_id, np_id, req.body.year_name, req.body.month_name],
            type: db.sequelize.QueryTypes.UPDATE
        })
        .then((updateUsernpRes) => {
            res.json({
                result: 1
            });
        })
        .catch((updateUsernpErr) => {
            res.json({
                result: 0,
                msg: "update usernp failure"
            });
        });
    });
};

// 普通成员和管理员都可以更改自己的 role_id 
const updateHybridRoleid = (db, req, res, next) => {
    db.sequelize.query("select pj_id from project where pj_name = ?", {
        replacements: [req.body.pj_name],
		type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        const pj_id = selectPjRes[0].pj_id;
        db.sequelize.query("update hybrid set role_id = ? where user_id = ? and pj_id = ? and role_id = ? and year_name = ? and month_name = ? and hour_time = ?", {
            replacements: [req.body.role_id, req.session.user.user_id, pj_id, req.body.old_role_id, req.body.year_name, req.body.month_name, req.body.hour_time],
            type: db.sequelize.QueryTypes.UPDATE
        })
        .then((updateHybridRes) => {
            res.json({
                result: 1
            });
        })
        .catch((updateHybridErr) => {
            res.json({
                result: 0,
                msg: "update hybrid failure"
            });
        });
    });
}

const updateHybridHourtime = (db, req, res, next) => {
    db.sequelize.query("select pj_id from project where pj_name = ?", {
        replacements: [req.body.pj_name],
		type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        const pj_id = selectPjRes[0].pj_id;
        db.sequelize.query("update hybrid set hour_time = ? where user_id = ? and pj_id = ? and role_id = ? and year_name = ? and month_name = ? and hour_time = ?", {
            replacements: [req.body.hour_time, req.session.user.user_id, pj_id, req.body.role_id, req.body.year_name, req.body.month_name, req.body.old_hour_time],
            type: db.sequelize.QueryTypes.UPDATE
        })
        .then((updateHybridRes) => {
            res.json({
                result: 1
            });
        })
        .catch((updateHybridErr) => {
            res.json({
                result: 0,
                msg: "update hybrid failure"
            });
        });
    });
};

// 普通成员和管理员都可以获得每年的swh和phh
const getSwhphh = (db, req, res, next) => {
    db.sequelize.query("select month_name, swh, phh from sshour where year_id = ?", {
        replacements: [req.query.year_id],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        res.json(result);
    });
};


const commonController = {};
commonController.getProjects = getProjects;
commonController.addWorkInfo = addWorkInfo;
commonController.deleteOneWorkInfo = deleteOneWorkInfo;
commonController.getWorkInfo = getWorkInfo;
commonController.login = login;
commonController.updateUsernp = updateUsernp;
commonController.updateHybridRoleid = updateHybridRoleid;
commonController.updateHybridHourtime = updateHybridHourtime;
commonController.getSwhphh = getSwhphh;

module.exports = commonController;
