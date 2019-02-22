var express = require('express');
var router = express.Router();

const db = require("../config/db.config.js");
const Project = db.project;
const Role = db.role;
const User = db.user;
const Hybrid = db.hybrid;

const AdminController = require("../controllers/admin.controller.js");
const CommonController = require("../controllers/common.controller.js");
const Method = require("./method.js");


router.get("/gs", (req, res, next) => {
	CommonController.getWorkInfo(db, req, res, next);
});

router.get("/chartsdata", (req, res, next) => {
	const sql = "select p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where user_id = ? and hybrid.year_name = ?";
	db.sequelize.query(sql, {
			replacements: [req.session.user.user_id, req.query.year_name],
			type: db.sequelize.QueryTypes.SELECT
		})
		.then(result => {
			res.json(result);
		});
});

// 获取所有人所有项目的月份分布信息
router.get("/getchartdata", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.getChartData(db, req, res, next);
});

router.get("/rolehourtime", (req, res, next) => {
	db.sequelize.query("select r.role_name, sum(hybrid.hour_time) as totalhourtime from hybrid join role r on hybrid.role_id = r.role_id where user_id = ? and hybrid.year_name = ? group by r.role_name", {
		replacements: [req.session.user.user_id, req.query.year_name],
		type: db.sequelize.QueryTypes.SELECT
	})
	.then((result) => {
		res.json(result);
	});
});

router.get("/monthhourtime", (req, res, next) => {
	db.sequelize.query("select month_name, sum(hour_time) as totalhourtime from hybrid where user_id = ? and hybrid.year_name = ? group by month_name", {
		replacements: [req.session.user.user_id, req.query.year_name],
		type: db.sequelize.QueryTypes.SELECT
	})
	.then((result) => {
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

// 获取所有的projects
router.get("/getprojects", (req, res, next) => {
	CommonController.getProjects(db, req, res, next);
});

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render('index');
});

/* GET admin.html page. */
router.get("/admin.html", AdminController.checkAdminAuth, (req, res, next) => {
	res.render("admin");
});

/* GET swhsph.html page. */
router.get("/swhphh.html", AdminController.checkAdminAuth, (req, res, next) => {
	res.render("swhphh");
});

/* GET statistic.html page. */
router.get("/statistic.html", AdminController.checkAdminAuth, (req, res, next) => {
	res.render("statistic");
});

// 获取所有人的工作信息
router.get("/getallworkinfo", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.getAllWorkInfo(db, req, res, next);
});

// 导出所有人的工作信息
router.get("/exportexcel", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.exportExcel(db, req, res, next);
});


/* GET email.html page. */
router.get("/email.html", AdminController.checkAdminAuth, (req, res, next) => {
	res.render("email");
});

// 获取收件人的邮件和姓名
router.post("/getinform", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.getInform(db, req, res, next);
});

// 添加收件人信息
router.post("/addreceiverinformation", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.addReceiverInformation(db, req, res, next);
});

// 更改收件人的姓名
router.post("/updateinformreceivername", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updateInformReceiverName(db, req, res, next);
});

// 更改收件人的邮箱
router.post("/updateinformreceiveremail", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updateInformReceiverEmail(db, req, res, next);
});

// 删除收件人的信息
router.post("/deletereceiverinfos", AdminController.checkAdminAuth, (req, res, next) => {
	const receiverInfos = req.body;
	const receiverInfosLength = receiverInfos.length;
	var count = receiverInfosLength;
	for (let i = 0; i < receiverInfosLength; i++) {
		AdminController.deleteOneReceiverInfo(db, receiverInfos[i], req, res);
		count--;
	}
	if (count == 0) {
		res.json({
			result: 1
		});
	}
});

// 管理员获取每年的swh phh
router.post("/getswhphh", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.getSwhphh(db, req, res, next);
});

// 普通成员获取每年的swh phh
router.get("/getswhphh", (req, res, next) => {
	CommonController.getSwhphh(db, req, res, next);
});

// 更新每年的 swh
router.post("/updatessh", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updateSwh(db, req, res, next);
});

// 更新每年的 swh
router.post("/updatephh", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updatePhh(db, req, res, next);
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
	CommonController.login(db, req, res, next);
});

// 添加工作信息
router.post("/addworkinfo", (req, res, next) => {
	CommonController.addWorkInfo(db, req, res, next);
});

// 删除工作信息
router.post("/deleteworkinfo", (req, res, next) => {
	const workInfos = req.body;
	const workInfosLength = workInfos.length;
	var count = workInfosLength;
	for (let i = 0; i < workInfosLength; i++) {
		CommonController.deleteOneWorkInfo(db, workInfos[i], req, res);
		count--;
	}
	if (count == 0) {
		res.json({
			result: 1
		});
	}
	
});

router.get("/project", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.getProject(db, req, res, next);
});

// 添加项目信息
router.post("/addproject", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.addProject(db, req, res, next);
});

// 删除项目信息
router.post("/deletepjs", (req, res, next) => {
	const pjnames = req.body;
	const pjnamesLength = pjnames.length;
	var count = pjnamesLength;
	for (let i = 0; i < pjnamesLength; i++) {
		AdminController.deleteOnePj(db, pjnames[i], res);
		count--;
	}
	if (count == 0) {
		res.json({
			result: 1
		});
	}
});

// 更改项目名称或者负责人或者简介
router.post("/updatepjexceptdate", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updatePjExceptDate(db, req, res, next);
});

// 更改项目时间
router.post("/updatepjdate", AdminController.checkAdminAuth, (req, res, next) => {
	AdminController.updatePjDate(db, req, res, next);
});


// 更改Private leave\Training\Administration hour_time
router.post("/updateusernp", (req, res, next) => {
	CommonController.updateUsernp(db, req, res, next);
});



// 更改hybrid的 role_id
router.post("/updatehybridroleid", (req, res, next) => {
	CommonController.updateHybridRoleid(db, req, res, next);
});

// 更改hybrid的 hour_time
router.post("/updateHybridHourtime", (req, res, next) => {
	CommonController.updateHybridHourtime(db, req, res, next);
});




module.exports = router;