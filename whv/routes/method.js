function matchMonth(temp, someResult) {
    switch(someResult.month_name) {
        case "January":
            temp.january_role_name = someResult.role_name;
            temp.january_month_name = someResult.month_name;
            temp.january_hour_time = someResult.hour_time;
            break;
        case "February":
            temp.february_role_name = someResult.role_name;
            temp.february_month_name = someResult.month_name;
            temp.february_hour_time = someResult.hour_time;
            break;
        case "March":
            temp.march_role_name = someResult.role_name;
            temp.march_month_name = someResult.month_name;
            temp.march_hour_time = someResult.hour_time;
            break;
        case "April":
            temp.april_role_name = someResult.role_name;
            temp.april_month_name = someResult.month_name;
            temp.april_hour_time = someResult.hour_time;
            break;
        case "May":
            temp.may_role_name = someResult.role_name;
            temp.may_month_name = someResult.month_name;
            temp.may_hour_time = someResult.hour_time;
            break;
        case "June":
            temp.june_role_name = someResult.role_name;
            temp.june_month_name = someResult.month_name;
            temp.june_hour_time = someResult.hour_time;
            break;
        case "July":
            temp.july_role_name = someResult.role_name;
            temp.july_month_name = someResult.month_name;
            temp.july_hour_time = someResult.hour_time;
            break;
        case "August":
            temp.august_role_name = someResult.role_name;
            temp.august_month_name = someResult.month_name;
            temp.august_hour_time = someResult.hour_time;
            break;
        case "September":
            temp.september_role_name = someResult.role_name;
            temp.september_month_name = someResult.month_name;
            temp.september_hour_time = someResult.hour_time;
            break;
        case "October":
            temp.october_role_name = someResult.role_name;
            temp.october_month_name = someResult.month_name;
            temp.october_hour_time = someResult.hour_time;
            break;
        case "November":
            temp.november_role_name = someResult.role_name;
            temp.november_month_name = someResult.month_name;
            temp.november_hour_time = someResult.hour_time;
            break;
        case "December":
            temp.december_role_name = someResult.role_name;
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

const Method = {};
Method.formatGs = formatGs;

module.exports = Method;