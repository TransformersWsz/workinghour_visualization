function reloadPage(url) {
    window.location.href = url;
}

function checkDate(date) {
    return (new Date(date).getDate() == date.substring(date.length - 2));
}

function checkMonthColumnName(field) {
    if (field == "january_hour_time" || field == "february_hour_time" || field == "march_hour_time" || field == "april_hour_time" || field == "may_hour_time" || field == "june_hour_time" || field == "july_hour_time" || field == "august_hour_time" || field == "september_hour_time" || field == "october_hour_time" || field == "november_hour_time" || field == "december_hour_time") {
        return true;
    }
    return false;
}

// 检查编辑的为那一列，因为Private leaving\Trainging\Adminstration只能编辑小时
function checkColumn(field, row) {
    if (row.pj_name == "Private leave" || row.pj_name == "Training" || row.pj_name == "Administration") {
        if (field == "january_role_id" || field == "february_role_id" || field == "march_role_id" || field == "april_role_id" || field == "may_role_id" || field == "june_role_id" || field == "july_role_id" || field == "august_role_id" || field == "september_role_id" || field == "october_role_id" || field == "november_role_id" || field == "december_role_id") {
            return false;
        }
    }
    return true;
}

function getMonthnameFromMonthColumn(field) {
    var month_name = "";
    switch(field) {
        case "january_hour_time":
            month_name = "January";
            break;
        case "february_hour_time":
            month_name = "February";
            break;
        case "march_hour_time":
            month_name = "March";
            break;
        case "april_hour_time":
            month_name = "April";
            break;
        case "may_hour_time":
            month_name = "May";
            break;
        case "june_hour_time":
            month_name = "June";
            break;
        case "july_hour_time":
            month_name = "July";
            break;
        case "august_hour_time":
            month_name = "August";
            break;
        case "september_hour_time":
            month_name = "September";
            break;
        case "october_hour_time":
            month_name = "October";
            break;
        case "november_hour_time":
            month_name = "November";
            break;
        case "december_hour_time":
            month_name = "December";
            break;
    }
    return month_name;
}

function getMonthnameAndRightHourtimeFromMonthColumnRoleId(field) {
    var result = [];
    var month_name = "";
    var rightHourtimeField = "";
    switch(field) {
        case "january_role_id":
            month_name = "January";
            rightHourtimeField = "january_hour_time";
            break;
        case "february_role_id":
            month_name = "February";
            rightHourtimeField = "february_hour_time";
            break;
        case "march_role_id":
            month_name = "March";
            rightHourtimeField = "march_hour_time";
            break;
        case "april_role_id":
            month_name = "April";
            rightHourtimeField = "april_hour_time";
            break;
        case "may_role_id":
            month_name = "May";
            rightHourtimeField = "may_hour_time";
            break;
        case "june_role_id":
            month_name = "June";
            rightHourtimeField = "june_hour_time";
            break;
        case "july_role_id":
            month_name = "July";
            rightHourtimeField = "july_hour_time";
            break;
        case "august_role_id":
            month_name = "August";
            rightHourtimeField = "august_hour_time";
            break;
        case "september_role_id":
            month_name = "September";
            rightHourtimeField = "september_hour_time";
            break;
        case "october_role_id":
            month_name = "October";
            rightHourtimeField = "october_hour_time";
            break;
        case "november_role_id":
            month_name = "November";
            rightHourtimeField = "november_hour_time";
            break;
        case "december_role_id":
            month_name = "December";
            rightHourtimeField = "december_hour_time";
            break;
    }
    result.push(month_name);
    result.push(rightHourtimeField);
    return result;
}


function getMonthnameAndLeftRoleIdFromMonthColumnRoleId(field) {
    var result = [];
    var month_name = "";
    var leftRoleIdField = "";
    switch(field) {
        case "january_hour_time":
            month_name = "January";
            leftRoleIdField = "january_role_id";
            break;
        case "february_hour_time":
            month_name = "February";
            leftRoleIdField = "february_role_id";
            break;
        case "march_hour_time":
            month_name = "March";
            leftRoleIdField = "march_role_id";
            break;
        case "april_hour_time":
            month_name = "April";
            leftRoleIdField = "april_role_id";
            break;
        case "may_hour_time":
            month_name = "May";
            leftRoleIdField = "may_role_id";
            break;
        case "june_hour_time":
            month_name = "June";
            leftRoleIdField = "june_role_id";
            break;
        case "july_hour_time":
            month_name = "July";
            leftRoleIdField = "july_role_id";
            break;
        case "august_hour_time":
            month_name = "August";
            leftRoleIdField = "august_role_id";
            break;
        case "september_hour_time":
            month_name = "September";
            leftRoleIdField = "september_role_id";
            break;
        case "october_hour_time":
            month_name = "October";
            leftRoleIdField = "october_role_id";
            break;
        case "november_hour_time":
            month_name = "November";
            leftRoleIdField = "november_role_id";
            break;
        case "december_hour_time":
            month_name = "December";
            leftRoleIdField = "december_role_id";
            break;
    }
    result.push(month_name);
    result.push(leftRoleIdField);
    return result;
}

function getRoleNameByRoleId(role_id) {
    var role_name = "";
    
    switch(role_id) {
        case 1:
            role_name = "APP";
            break;
        case 2:
            role_name = "HW";
            break;
        case 3:
            role_name = "PM";
            break;
        case 4:
            role_name = "SW";
            break;
        case 5:
            role_name = "SYS";
            break;
    }
    return role_name;
}

function getMonthRoleIdFieldName(id) {
    var monthRoleIdFieldName = "";
    switch(id) {
        case "1":
            monthRoleIdFieldName = "january_role_id";
            break;
        case "2":
            monthRoleIdFieldName = "february_role_id";
            break;
        case "3":
            monthRoleIdFieldName = "march_role_id";
            break;
        case "4":
            monthRoleIdFieldName = "april_role_id";
            break;
        case "5":
            monthRoleIdFieldName = "may_role_id";
            break;
        case "6":
            monthRoleIdFieldName = "june_role_id";
            break;
        case "7":
            monthRoleIdFieldName = "july_role_id";
            break;
        case "8":
            monthRoleIdFieldName = "august_role_id";
            break;
        case "9":
            monthRoleIdFieldName = "september_role_id";
            break;
        case "10":
            monthRoleIdFieldName = "october_role_id";
            break;
        case "11":
            monthRoleIdFieldName = "november_role_id";
            break;
        case "12":
            monthRoleIdFieldName = "december_role_id";
            break;
    }
    return monthRoleIdFieldName;
}

function getMonthHourtimeFieldName(id) {
    var monthHourtimeFieldName = "";
    switch(id) {
        case "1":
            monthHourtimeFieldName = "january_hour_time";
            break;
        case "2":
            monthHourtimeFieldName = "february_hour_time";
            break;
        case "3":
            monthHourtimeFieldName = "march_hour_time";
            break;
        case "4":
            monthHourtimeFieldName = "april_hour_time";
            break;
        case "5":
            monthHourtimeFieldName = "may_hour_time";
            break;
        case "6":
            monthHourtimeFieldName = "june_hour_time";
            break;
        case "7":
            monthHourtimeFieldName = "july_hour_time";
            break;
        case "8":
            monthHourtimeFieldName = "august_hour_time";
            break;
        case "9":
            monthHourtimeFieldName = "september_hour_time";
            break;
        case "10":
            monthHourtimeFieldName = "october_role_id";
            break;
        case "11":
            monthHourtimeFieldName = "november_hour_time";
            break;
        case "12":
            monthHourtimeFieldName = "december_hour_time";
            break;
    }
    return monthHourtimeFieldName;
}

function getMonthnameById(id) {
    var month_name = "";
    switch(id) {
        case "1":
            month_name = "January";
            break;
        case "2":
            month_name = "February";
            break;
        case "3":
            month_name = "March";
            break;
        case "4":
            month_name = "April";
            break;
        case "5":
            month_name = "May";
            break;
        case "6":
            month_name = "June";
            break;
        case "7":
            month_name = "July";
            break;
        case "8":
            month_name = "August";
            break;
        case "9":
            month_name = "September";
            break;
        case "10":
            month_name = "October";
            break;
        case "11":
            month_name = "November";
            break;
        case "12":
            month_name = "December";
            break;
    }
    return month_name;
}

function getPjnameRolenameMonthnamehourtime(row) {
    const pj_name = row.pj_name;
    var role_name = "";
    var month_name = "";
    if (row.january_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.january_role_id);
        month_name = getMonthnameById("1");
    }
    if (row.february_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.february_role_id);
        month_name = getMonthnameById("2");
    }
    if (row.march_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.march_role_id);
        month_name = getMonthnameById("3");
    }
    if (row.april_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.april_role_id);
        month_name = getMonthnameById("4");
    }
    if (row.may_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.may_role_id);
        month_name = getMonthnameById("5");
    }
    if (row.june_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.june_role_id);
        month_name = getMonthnameById("6");
    }
    if (row.july_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.july_role_id);
        month_name = getMonthnameById("7");
    }
    if (row.august_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.august_role_id);
        month_name = getMonthnameById("8");
    }
    if (row.september_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.september_role_id);
        month_name = getMonthnameById("9");
    }
    if (row.october_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.october_role_id);
        month_name = getMonthnameById("10");
    }
    if (row.november_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.november_role_id);
        month_name = getMonthnameById("11");
    }
    if (row.december_role_id != undefined) {
        role_name = getRoleNameByRoleId(row.december_role_id);
        month_name = getMonthnameById("12");
    }


    var hour_time = "";
    if (row.january_hour_time != undefined) {
        hour_time = row.january_hour_time;
    }
    if (row.february_hour_time != undefined) {
        hour_time = row.february_hour_time;
    }
    if (row.march_hour_time != undefined) {
        hour_time = row.march_hour_time;
    }
    if (row.april_hour_time != undefined) {
        hour_time = row.april_hour_time;
    }
    if (row.may_hour_time != undefined) {
        hour_time = row.may_hour_time;
    }
    if (row.june_hour_time != undefined) {
        hour_time = row.june_hour_time;
    }
    if (row.july_hour_time != undefined) {
        hour_time = row.july_hour_time;
    }
    if (row.august_hour_time != undefined) {
        hour_time = row.august_hour_time;
    }
    if (row.september_hour_time != undefined) {
        hour_time = row.september_hour_time;
    }
    if (row.october_hour_time != undefined) {
        hour_time = row.october_hour_time;
    }
    if (row.november_hour_time != undefined) {
        hour_time = row.november_hour_time;
    }
    if (row.december_hour_time != undefined) {
        hour_time = row.december_hour_time;
    }

    var result = pj_name + "-" + month_name + "-" + role_name + "-" + hour_time;
    return result;
}

function getOneRowWorkinfo(row, year_name) {
    const pj_name = row.pj_name;
    var role_id;
    var month_name = "";
    if (row.january_role_id != undefined) {
        role_id = row.january_role_id;
        month_name = getMonthnameById("1");
    }
    if (row.february_role_id != undefined) {
        role_id = row.february_role_id;
        month_name = getMonthnameById("2");
    }
    if (row.march_role_id != undefined) {
        role_id = row.march_role_id;
        month_name = getMonthnameById("3");
    }
    if (row.april_role_id != undefined) {
        role_id = row.april_role_id;
        month_name = getMonthnameById("4");
    }
    if (row.may_role_id != undefined) {
        role_id = row.may_role_id;
        month_name = getMonthnameById("5");
    }
    if (row.june_role_id != undefined) {
        role_id = row.june_role_id;
        month_name = getMonthnameById("6");
    }
    if (row.july_role_id != undefined) {
        role_id = row.july_role_id;
        month_name = getMonthnameById("7");
    }
    if (row.august_role_id != undefined) {
        role_id = row.august_role_id;
        month_name = getMonthnameById("8");
    }
    if (row.september_role_id != undefined) {
        role_id = row.september_role_id;
        month_name = getMonthnameById("9");
    }
    if (row.october_role_id != undefined) {
        role_id = row.october_role_id;
        month_name = getMonthnameById("10");
    }
    if (row.november_role_id != undefined) {
        role_id = row.november_role_id;
        month_name = getMonthnameById("11");
    }
    if (row.december_role_id != undefined) {
        role_id = row.december_role_id;
        month_name = getMonthnameById("12");
    }


    var hour_time;
    if (row.january_hour_time != undefined) {
        hour_time = row.january_hour_time;
    }
    if (row.february_hour_time != undefined) {
        hour_time = row.february_hour_time;
    }
    if (row.march_hour_time != undefined) {
        hour_time = row.march_hour_time;
    }
    if (row.april_hour_time != undefined) {
        hour_time = row.april_hour_time;
    }
    if (row.may_hour_time != undefined) {
        hour_time = row.may_hour_time;
    }
    if (row.june_hour_time != undefined) {
        hour_time = row.june_hour_time;
    }
    if (row.july_hour_time != undefined) {
        hour_time = row.july_hour_time;
    }
    if (row.august_hour_time != undefined) {
        hour_time = row.august_hour_time;
    }
    if (row.september_hour_time != undefined) {
        hour_time = row.september_hour_time;
    }
    if (row.october_hour_time != undefined) {
        hour_time = row.october_hour_time;
    }
    if (row.november_hour_time != undefined) {
        hour_time = row.november_hour_time;
    }
    if (row.december_hour_time != undefined) {
        hour_time = row.december_hour_time;
    }

    return {
        pj_name: pj_name,
        year_name: year_name,
        month_name: month_name,
        role_id: role_id,
        hour_time: hour_time
    };
}