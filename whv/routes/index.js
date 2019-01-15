var express = require('express');
var router = express.Router();

const db = require("../config/db.config.js");

const Project = db.project;
const Role = db.role;
const User = db.user;
const Hybrid = db.hybrid;

var Method = require("./method.js");


router.get("/gs", (req, res, next) => {
	const sql = "select hybrid.hy_id, p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where user_id = ?";
	db.sequelize.query(sql, {
			replacements: [req.session.user.user_id],
			type: db.sequelize.QueryTypes.SELECT
		})
		.then(result => {
			const formatResult = Method.formatGs(result);
			res.json(formatResult);
		});
});

router.get("/chartsdata", (req, res, next) => {
	const sql = "select p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where user_id = ?";
	db.sequelize.query(sql, {
			replacements: [req.session.user.user_id],
			type: db.sequelize.QueryTypes.SELECT
		})
		.then(result => {
			res.json(result);
		});
});

// 获取所有的roles
router.get("/role", (req, res, next) => {
	Role.findAll({
		attributes: ['role_id', 'role_name']
	}).then(roles => {
		res.json(roles);
	});
});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

// login page
router.get("/login.html", (req, res, next) => {
	res.render("login");
});

router.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.redirect("/login.html");
});

router.post("/login", (req, res, next) => {
	const user_account = req.body.username;
	const user_password = req.body.password;
	db.sequelize.query("select user_id, user_name from user where user_account = ? and user_password = ?", {
		replacements: [user_account, user_password],
		type: db.sequelize.QueryTypes.SELECT
	}).then((result) => {
		// 该用户不存在
		if (result.length == 0) {
			User.create({
				user_account: user_account,
				user_password: user_password
			}, {
				fields: ["user_account", "user_password"]
			}).then((user_instance) => {
				const userInfo = {
					user_id: user_instance.id,
					user_account: user_account
				};
				req.session.user = userInfo;
				res.json({
					result: 1
				});
			}).catch(() => {
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
				user_account: user_account
			}
			req.session.user = userInfo;
			res.json({
				result: 1
			});
		}
	});
});

// 添加工作信息
router.post("/workinfo", (req, res, next) => {

	db.sequelize.query("select pj_id, pj_name from project where pj_name = ?", {
			replacements: [req.body.pj_name],
			type: db.sequelize.QueryTypes.SELECT
		})
		.then(result => {
			// 项目不存在
			if (result.length == 0) {
				Project.create({
					pj_name: req.body.pj_name
				}, {
					fields: ["pj_name"]
				}).then((project_instance) => {
					Hybrid.create({
							user_id: req.session.user.user_id,
							pj_id: project_instance.id,
							role_id: req.body.role_id,
							month_name: req.body.month_name,
							hour_time: req.body.hour_time
						}, {
							fields: ["user_id", "pj_id", "role_id", "month_name", "hour_time"]
						}).then((hybrid_instance) => {
							res.json({
								result: 1
							});
						})
						.catch(() => {
							res.json({
								result: 0,
								msg: "add hybrid failure."
							});
						});
				}).catch(() => {
					res.json({
						result: 0,
						msg: "add project failure."
					});
				});
			} else {
				// 项目存在
				db.sequelize.query("select hy_id from hybrid where user_id = ? and pj_id = ? and month_name = ?", {
					replacements: [req.session.user.user_id, result[0].pj_id, req.body.month_name],
					type: db.sequelize.QueryTypes.SELECT
				}).then((hy_res) => {
					// hy 不存在
					if (hy_res == 0) {
						Hybrid.create({
								user_id: req.session.user.user_id,
								pj_id: result[0].pj_id,
								role_id: req.body.role_id,
								month_name: req.body.month_name,
								hour_time: req.body.hour_time
							}, {
								fields: ["user_id", "pj_id", "role_id", "month_name", "hour_time"]
							}).then((add_hybrid_instance) => {
								res.json({
									result: 1
								});
							})
							.catch(() => {
								res.json({
									result: 0,
									msg: "add hybrid failure."
								});
							});
					}
					// hy 存在
					else {
						db.sequelize.query("update hybrid set role_id = ?, hour_time = ? where hy_id = ?", {
								replacements: [req.body.role_id, req.body.hour_time, hy_res[0].hy_id],
								type: db.sequelize.QueryTypes.UPDATE
							}).then((update_hybrid_instance) => {
								res.json({
									result: 1
								});
							})
							.catch(() => {
								res.json({
									result: 0,
									msg: "add hybrid failure."
								});
							});
					}
				});
			}
		});
});

// 删除工作信息
router.post("/deletepj", (req, res, next) => {

	const pjnames = req.body;
	const pjnamesLength = pjnames.length;
	for (let i = 0; i < pjnamesLength; i++) {
		db.sequelize.query("select pj_id from project where pj_name = ?", {
				replacements: [pjnames[i]],
				type: db.sequelize.QueryTypes.SELECT
			})
			.then(result => {
				
				

				db.sequelize.query("delete from hybrid where pj_id = ? and user_id = ?", {
						replacements: [result[0].pj_id, req.session.user.user_id],
						type: db.sequelize.QueryTypes.DELETE
					}).then((deleteRes) => {
						res.json({
							result: 1
						});
					})
					.catch(() => {
						res.json({
							result: 0,
							msg: "delete hybrid failure."
						});
					});
			});
	}
});


module.exports = router;