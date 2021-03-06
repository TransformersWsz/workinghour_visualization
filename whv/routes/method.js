function matchMonth(temp, someResult) {
    switch(someResult.month_name) {
        case "January":
            temp.january_role_id = someResult.role_id;
            temp.january_month_name = someResult.month_name;
            temp.january_hour_time = someResult.hour_time;
            break;
        case "February":
            temp.february_role_id = someResult.role_id;
            temp.february_month_name = someResult.month_name;
            temp.february_hour_time = someResult.hour_time;
            break;
        case "March":
            temp.march_role_id = someResult.role_id;
            temp.march_month_name = someResult.month_name;
            temp.march_hour_time = someResult.hour_time;
            break;
        case "April":
            temp.april_role_id = someResult.role_id;
            temp.april_month_name = someResult.month_name;
            temp.april_hour_time = someResult.hour_time;
            break;
        case "May":
            temp.may_role_id = someResult.role_id;
            temp.may_month_name = someResult.month_name;
            temp.may_hour_time = someResult.hour_time;
            break;
        case "June":
            temp.june_role_id = someResult.role_id;
            temp.june_month_name = someResult.month_name;
            temp.june_hour_time = someResult.hour_time;
            break;
        case "July":
            temp.july_role_id = someResult.role_id;
            temp.july_month_name = someResult.month_name;
            temp.july_hour_time = someResult.hour_time;
            break;
        case "August":
            temp.august_role_id = someResult.role_id;
            temp.august_month_name = someResult.month_name;
            temp.august_hour_time = someResult.hour_time;
            break;
        case "September":
            temp.september_role_id = someResult.role_id;
            temp.september_month_name = someResult.month_name;
            temp.september_hour_time = someResult.hour_time;
            break;
        case "October":
            temp.october_role_id = someResult.role_id;
            temp.october_month_name = someResult.month_name;
            temp.october_hour_time = someResult.hour_time;
            break;
        case "November":
            temp.november_role_id = someResult.role_id;
            temp.november_month_name = someResult.month_name;
            temp.november_hour_time = someResult.hour_time;
            break;
        case "December":
            temp.december_role_id = someResult.role_id;
            temp.december_month_name = someResult.month_name;
            temp.december_hour_time = someResult.hour_time;
            break;
    }
}

// 将工时格式化发给前端
const formatGs = (result) => {
    const resultLength = result.length;
    const memory = Array(resultLength).fill(0);
    const formatResult = [];
    
    for (let i = 0; i < resultLength; i++) {
        if (memory[i] == 0) {
            var temp = {};
            temp.pj_name = result[i].pj_name;
            matchMonth(temp, result[i]);
            memory[i] = 1;
            for (let j = i+1; j < resultLength; j++) {
                if (memory[j] == 0) {
                    if (result[j].pj_name == result[i].pj_name) {
                        matchMonth(temp, result[j]);
                        memory[j] = 1;
                    }
                }
            }
            formatResult.push(temp);
        }
    }
    return formatResult;
};

const formatUsernp = (result) => {
    const resultLength = result.length;
    const isAppearBefore = result.map(() => { return 0; });
    const formatResult = [];
    for (let i = 0; i < resultLength; i++) {
        if (isAppearBefore[i] == 0) {
            const temp = {};
            temp.pj_name = result[i].np_name;
            matchMonth(temp, result[i]);
            isAppearBefore[i] = 1;
            for (let j = i+1; j < resultLength; j++) {
                if (isAppearBefore[j] == 0) {
                    if (result[i].np_name == result[j].np_name) {
                        matchMonth(temp, result[j]);
                        isAppearBefore[j] = 1;
                    }
                }
            }
            formatResult.push(temp);
        }
    }
    return formatResult;
}


const formatHybrid = (result) => {
    const formatWorkInfoResult = [];
    const resultLength = result.length;
    for (let i = 0; i < resultLength; i++) {
        const temp = {};
        temp.pj_name = result[i].pj_name;
        matchMonth(temp, result[i]);
        formatWorkInfoResult.push(temp);
    }
    return formatWorkInfoResult;
};

const mergeTwoArray = (source, target) => {
    const sourceLength = source.length;
    for (let i = 0; i < sourceLength; i++) {
        target.push(source[i]);
    }
}

// 初始化temp
const initTemp = (temp) => {
    temp["January"] = 0;
    temp["February"] = 0;
    temp["March"] = 0;
    temp["April"] = 0;
    temp["May"] = 0;
    temp["June"] = 0;
    temp["July"] = 0;
    temp["August"] = 0;
    temp["September"] = 0;
    temp["October"] = 0;
    temp["November"] = 0;
    temp["December"] = 0;
    temp["sum"] = 0;
}

// 将所有人的工作信息格式化发送给前端
const formatAllWorkInfo = (result) => {
    const res = [];
    const resultLength = result.length;
    const isUsed = new Array(resultLength).fill(0);
    for (let i = 0; i < resultLength; i++) {
        if (isUsed[i] == 0) {
            const temp = {};
            initTemp(temp);
            temp.user_account = result[i].user_account.substring(0, result[i].user_account.indexOf("@cn.bosch.com"));
            temp.pj_name = result[i].pj_name;
            temp.pj_instruction = result[i].pj_instruction;
            temp.role_name = result[i].role_name;
            temp[result[i].month_name] += result[i].hour_time;
            temp["sum"] += result[i].hour_time;

            isUsed[i] = 1;

            for (let j = i+1; j < resultLength; j++) {
                if (isUsed[j] == 0 && result[i].user_account == result[j].user_account && result[i].pj_name == result[j].pj_name && result[i].role_name == result[j].role_name) {
                    temp[result[j].month_name] += result[j].hour_time;
                    temp["sum"] += result[j].hour_time;

                    isUsed[j] = 1;
                }
            }
            res.push(temp);
        }
    }
    return res;
};

// 获取年月日
const getYMD = () => {
    const result = [];
    
    const date = new Date();
    result.push(date.getFullYear());
    result.push(date.getMonth());
    result.push(date.getDate());

    return result;
};

const Method = {};
Method.formatGs = formatGs;
Method.formatUsernp = formatUsernp;
Method.formatHybrid = formatHybrid;
Method.mergeTwoArray = mergeTwoArray;
Method.formatAllWorkInfo = formatAllWorkInfo;
Method.getYMD = getYMD;

module.exports = Method;