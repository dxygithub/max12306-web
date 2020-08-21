// 全局公用js


// 消息提示

// 成功提示
function successMsg(message, obj) {
    obj.$message({
        message: message,
        type: 'success'
    });
}

// 警告提示
function warningMsg(message, obj) {
    obj.$message({
        message: message,
        type: 'warning'
    });
}


// 错误提示
function errorMsg(message, obj) {
    obj.$message.error(message);
}


// 页面加载遮罩层

function loading(loading_text, obj) {
    const loadingId = obj.$loading({
        lock: true,
        text: loading_text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return loadingId;
}

// messageBox弹框
function confirm(text, title, fun, obj) {
    obj.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        fun();
    }).catch(() => {
        
    });
}

export default {
    successMsg,
    warningMsg,
    errorMsg,
    loading,
    confirm
}