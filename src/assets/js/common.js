// 全局公用js


// 消息提示

// 成功提示
function successMsg(message,obj){
    obj.$message({
        message: message,
        type: 'success'
    });
}

// 警告提示
function warningMsg(message,obj){
    obj.$message({
        message: message,
        type: 'warning'
    });
}


// 错误提示
function errorMsg(message,obj){
    obj.$message.error(message);
}

export default{
    successMsg,
    warningMsg,
    errorMsg
}