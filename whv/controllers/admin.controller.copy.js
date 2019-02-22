const Method = require("../routes/method.js");
const nodeExcel = require("excel-export");

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

// 获取项目信息
const getProject = (db, req, res, next) => {
    db.sequelize.query("select pj_name, pj_date, pj_leader, pj_instruction from project", {
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((selectPjRes) => {
        res.json(selectPjRes);
    });
}

// 获取每年的swh phh
const getSwhphh = (db, req, res, next) => {
    db.sequelize.query("select month_name, swh, phh, swh+phh as sph from sshour where year_id = ?", {
        replacements: [req.body.year_id],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        db.sequelize.query("select sum(swh) as swh, sum(phh) as phh, sum(swh) + sum(phh) as sph from sshour where year_id = ?", {
            replacements: [req.body.year_id],
            type: db.sequelize.QueryTypes.SELECT
        })
        .then((sumRes) => {
            sumRes[0].month_name = "total";
            result.push(sumRes[0]);
            res.json(result);
        });
    });
};

// 获取收件人的邮件和姓名
const getInform = (db, req, res, next) => {
    db.sequelize.query("select receiver_email, receiver_name from inform", {
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        res.json(result);
    });
}

// 添加收件人信息
const addReceiverInformation = (db, req, res, next) => {
    db.sequelize.query("insert into inform values(?, ?)", {
        replacements: [req.body.receiver_name, req.body.receiver_email],
        type: db.sequelize.QueryTypes.INSERT
    })
    .then((inform_instance) => {
        res.json({
            result: 1
        });
    })
    .catch((insertErr) => {
        res.json({
            result: 0
        });
    });
};

// 更改收件人的姓名
const updateInformReceiverName = (db, req, res, next) => {
    db.sequelize.query("update inform set receiver_name = ? where receiver_name = ?", {
        replacements: [req.body.receiver_name, req.body.oldValue],
        type: db.sequelize.QueryTypes.UPDATE
    }).then((update_inform_instance) => {
        res.json({
            result: 1
        });
    })
    .catch(() => {
        res.json({
            result: 0
        });
    });
};

// 更改收件人的邮箱
const updateInformReceiverEmail = (db, req, res, next) => {
    db.sequelize.query("update inform set receiver_email = ? where receiver_email = ?", {
        replacements: [req.body.receiver_email, req.body.oldValue],
        type: db.sequelize.QueryTypes.UPDATE
    }).then((update_inform_instance) => {
        res.json({
            result: 1
        });
    })
    .catch(() => {
        res.json({
            result: 0
        });
    });
};

const deleteOneReceiverInfo = (db, receiver_name, req, res) => {
    db.sequelize.query("delete from inform where receiver_name = ?", {
        replacements: [receiver_name],
        type: db.sequelize.QueryTypes.DELETE
    })
    .then((deleteHyRes) => {
       
    })
    .catch((deleteHyErr) => {
        res.json({
            result: 0,
            msg: "delete one receiver info error."
        });
    });
};

// 更新每年的 swh
const updateSwh = (db, req, res, next) => {
    db.sequelize.query("update sshour set swh = ? where year_id = ? and month_name = ?", {
        replacements: [req.body.swh, req.body.year_id, req.body.month_name],
        type: db.sequelize.QueryTypes.UPDATE
    }).then((update_sshour_instance) => {
        res.json({
            result: 1
        });
    })
    .catch(() => {
        res.json({
            result: 0
        });
    });
};

// 更新每年的 phh
const updatePhh = (db, req, res, next) => {
    db.sequelize.query("update sshour set phh = ? where year_id = ? and month_name = ?", {
        replacements: [req.body.phh, req.body.year_id, req.body.month_name],
        type: db.sequelize.QueryTypes.UPDATE
    }).then((update_sshour_instance) => {
        res.json({
            result: 1
        });
    })
    .catch(() => {
        res.json({
            result: 0
        });
    });
};


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

// 获取所有人的工作信息
const getAllWorkInfo = (db, req, res, next) => {
    db.sequelize.query("select u.user_account, p.pj_name, p.pj_instruction, r.role_name, hybrid.month_name, hybrid.hour_time from hybrid join user u on hybrid.user_id = u.user_id join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where hybrid.year_name = ? order by u.user_account, p.pj_name, r.role_name;", {
        replacements: [req.query.year_name],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        const formatResult = Method.formatAllWorkInfo(result);
        res.json(formatResult);
    });
};

// 在写入excel前进行数据处理
const beforeCellWrite = (row, cellData) => {
    if (cellData == undefined) {
        return "";
    }
    else {
        return String(cellData);
    }
};

const rowData = (formatResult) => {
    const result = formatResult.map((item) => {
        return [item.user_account, String(item.pj_name), String(item.pj_instruction), item.role_name, item.January, item.February, item.March, item.April, item.May, item.June, item.July, item.August, item.September, item.October, item.November, item.December, item.sum];
    });
    return result;
};

// 导出所有人的工作信息
const exportExcel = (db, req, res, next) => {
    db.sequelize.query("select u.user_account, p.pj_name, p.pj_instruction, r.role_name, hybrid.month_name, hybrid.hour_time from hybrid join user u on hybrid.user_id = u.user_id join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where hybrid.year_name = ? order by u.user_account, p.pj_name, r.role_name;", {
        replacements: [req.query.year_name],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        const formatResult = Method.formatAllWorkInfo(result);
        const rowDataResult = rowData(formatResult);
        //res.json(rowDataResult);

        // res.json(
        //     {
        //         type: typeof(rowDataResult),
        //         length: rowDataResult.length,
        //         data: rowDataResult[0]
        //     }
        // );

        // const test = [["test1", "name", null, "APP", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12], ["test2", "name", null, "APP", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12]];

        const test = [];
        const rowDataResultLength = rowDataResult.length;

        for (let i = 0; i < rowDataResultLength; i++) {
            
            test.push([String(rowDataResult[i][0]), String(rowDataResult[i][1]), String(rowDataResult[i][2]), String(rowDataResult[i][3]), String(rowDataResult[i][4]), String(rowDataResult[i][5]), String(rowDataResult[i][6]), String(rowDataResult[i][7]), String(rowDataResult[i][8]), String(rowDataResult[i][9]), String(rowDataResult[i][10]), String(rowDataResult[i][11]), String(rowDataResult[i][12]), String(rowDataResult[i][13]), String(rowDataResult[i][14]), String(rowDataResult[i][15]), String(rowDataResult[i][16])]);
        }

        //res.json(test);

        // const test = rowDataResult.map((item) => {
        //     return item;
        // });
        // res.json(test);

        const ymd = Method.getYMD();

        var conf = {};
        conf.name = "Export";
        conf.cols = [
            {
                caption: `Created: ${ymd[2]}.${ymd[1]+1}.${ymd[0]}`,
                type:'string'
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite			
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            },
            {
                caption:'',
                type:'string',
                beforeCellWrite: beforeCellWrite
            }
        ];
        conf.rows = [
            ["Created by: ZOU9SZH"],
            ["©All rights by Robert Bosch GmbH. We reserve all rights of disposal such as copying and passing on to third parties."],
            ["Cost-Center: 0000369146"],
            ["Resource: All Employees Below"],
            ["Report Type: Details - Work per Month - Month"],
            ["Employee / Facility Res-Grp", "Project Name", "Project Description", "Role", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "sum"]
        ];
        test.forEach((item) => {
            conf.rows.push(item);
        });
        
    
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "TR_12.xlsx");
        res.end(result, 'binary');
    });


    
};

// 获取所有人所有项目的月份分布信息
const getChartData = (db, req, res, next) => {
    db.sequelize.query("select p.pj_name, hybrid.month_name, r.role_name, hybrid.hour_time from hybrid join project p on hybrid.pj_id = p.pj_id join role r on hybrid.role_id = r.role_id where hybrid.year_name = ?;", {
        replacements: [req.query.year_name],
        type: db.sequelize.QueryTypes.SELECT
    })
    .then((result) => {
        res.json(result);
    });
}

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

adminController.getInform = getInform;
adminController.addReceiverInformation = addReceiverInformation;
adminController.updateInformReceiverName = updateInformReceiverName;
adminController.updateInformReceiverEmail = updateInformReceiverEmail;
adminController.deleteOneReceiverInfo = deleteOneReceiverInfo;


adminController.getSwhphh = getSwhphh;
adminController.updateSwh = updateSwh;
adminController.updatePhh = updatePhh;
adminController.test = test;

adminController.getAllWorkInfo = getAllWorkInfo;
adminController.exportExcel = exportExcel;
adminController.getChartData = getChartData;

module.exports = adminController;
