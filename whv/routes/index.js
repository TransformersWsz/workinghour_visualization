var express = require('express');
var router = express.Router();

const db = require("../config/db.config.js");

const Project = db.project;
const Role = db.role;
const User = db.user;
const Hybrid = db.hybrid;

var Method = require("./method.js");

router.get("/alluser", (req, res, next) => {
	
	User.findAll({attributes: ['user_id', 'user_name']}).then(user => {
		res.json(user);
	});
});

router.get("/gs", (req, res, next) => {
	const sql = "select p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id;";
	db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})
	.then(result => {
		const formatResult = Method.formatGs(result);
		res.json(formatResult);
	});
});

router.get("/chartsdata", (req, res, next) => {
	const sql = "select p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id;";
	db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})
	.then(result => {
		res.json(result);
	});
});

// 获取所有的roles
router.get("/role", (req, res, next) => {
	Role.findAll({attributes: ['role_id', 'role_name']}).then(roles => {
		res.json(roles);
	});
});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Swift'
	});
});

// 添加工作信息
router.post("/workinfo", (req, res, next) => {
	Project.create({
		pj_name: req.body.pj_name
	}, {
		fields: ["pj_name"]
	}).then((project_instance) => {
		Hybrid.create({
			pj_id: project_instance.id,
			role_id: req.body.role_id,
			month_name: req.body.month_name,
			hour_time: req.body.hour_time
		}, {
			fields: ["pj_id", "role_id", "month_name", "hour_time"]
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
});

router.post("/addhour", (req, res, next) => {
	Hour.create({
		hour_time: req.body.hour_time
	}, {
		fields: ["hour_time"]
	}).then((hour_instance) => {
		res.json(hour_instance);
		
	}).catch(() => {
		res.json({
			result: 0,
			msg: "add hour failure."
		});
	});
});


router.get("/hour", (req, res, next) => {
	Hour.findAll({attributes: ['hour_id', 'hour_time']}).then(hours => {
		res.json(hours);
	});
});



module.exports = router;