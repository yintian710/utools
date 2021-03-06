utools.onPluginReady(() => {
    console.log('插件装配完成，已准备好')
})
utools.onPluginEnter(({code, type, payload}) => {
    console.log(code, '---', type)
    if (typeof (payload) === 'string' && payload.length > 20) {
        document.getElementById("input").value = payload
        document.getElementById("input").focus()
        str2dic()
    } else {
        document.getElementById("input").value = ''
        document.getElementById("result").innerHTML = ''
        document.getElementById("input").focus()
    }
    changeSelect()
});

function changeSelect() {
    let language = getStorage('language')
    let select = document.getElementById('select_language')
    let arr = select.getElementsByTagName('option')
    for (let a of arr){
        if(a.value === language){
            a.selected = true
        }
    }
}

function getStorage(name) {
    let dic = {
        language: 'python-dict'
    }
    console.log('执行获取缓存操作')
    if(!utools){
        return dic[name]
    }
    return utools.dbStorage.getItem(name)
}

function setStorage(name, value) {
    console.log('执行更新缓存操作')
    if(!utools){
        return true
    }
    return utools.dbStorage.setItem(name, value)
}

function isJsonString(str) {
    try {
        let json = JSON.parse(str)
        if (typeof json == "object" && JSON.stringify(json) !== '{}') {
            // console.log(json)
            return true;
        }
    } catch (e) {
    }
    return false;

}

function str2dic(text) {
    let result = document.getElementById("result")
    let input = document.getElementById("input")
    if (!text) {
        text = input.value;
    }
    text = text + '\n'
    let text_new = text.replace(/\\/g, '\\\\').replace(/"/g, "\\\"")
        .replace(/(.*?):\s?(.*?)\n/g, '"$1": "$2",\n')
    let last_comma = text_new.lastIndexOf(',')
    let text_new1 = '{\n' + text_new.substr(0, last_comma) + '\n}';
    result.innerHTML = text_new1;
    if (isJsonString(text_new1)) {
        // let language = getStorage('language')

        let one = javaOkHttp(text_new1)
        // let json = highLight(text_new1)
        let json
        json = one[1] + '\n\n 已自动复制'
        result.innerHTML = json;
    }
    return text_new1
}

function go(e) {
    let text = e.value
    str2dic(text)
}

function copy(text) {
    let input = document.createElement('input');
    input.setAttribute('id', 'text');

    input.setAttribute('value', text);

    document.getElementsByTagName('body')[0].appendChild(input);

    document.getElementById('text').select();

    document.execCommand('copy')

    document.getElementById('text').remove();

}

window.last_down = -1

function logKey(event) {
    let e = event || window.event || arguments.callee.caller.arguments[0];
    console.log(e.keyCode === 13, '1', e)
    if ((e.ctrlKey && e.keyCode === 86) || (e.shiftKey && e.keyCode === 45)) {
        str2dic()
    }
    if (e && e.keyCode === 13) { // enter 键
        if (window.last_down === 13) {
            str2dic()
        }
    }
    window.last_down = e.keyCode
}

function help() {
    let help_text = `
本工具为将网络请求头转换为各语言网络请求工具 headers
目前仅支持将请求头转换为 Python 请求头 dict 格式
支持 json 格式高亮
使用ctrl + v 或者 shift + insert 直接粘贴文段可直接转换
或者连续输入两次enter键亦可开启转换
目前转换结果为json格式则会自动复制到剪切板
输入文本格式样例：
"Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty"
转换结果为：
"{
"Sec-Fetch-Site": "same-origin",
"Sec-Fetch-Mode": "cors",
"Sec-Fetch-Dest": "empty"
}

已自动复制"
不符合匹配内容将自动忽略


项目地址： https://github.com/yintian710/utools.git
欢迎前往指导菜鸡
    `
    window.alert(help_text);
}


function select_language(e) {
    setStorage('language', e.value)
}


function openNew() {
    //获取页面的高度和宽度
    let sWidth = document.body.scrollWidth;
    let sHeight = document.body.scrollHeight;

    //获取页面的可视区域高度和宽度
    let wHeight = document.documentElement.clientHeight;

    let oMask = document.createElement("div");
    oMask.id = "mask";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    let oLogin = document.createElement("div");
    oLogin.id = "login";
    oLogin.innerHTML = "<div class='loginCon'><div id='close'>关闭</div></div>";
    document.body.appendChild(oLogin);

    //获取登陆框的宽和高
    let dHeight = oLogin.offsetHeight;
    let dWidth = oLogin.offsetWidth;
    //设置登陆框的left和top
    oLogin.style.left = sWidth / 2 - dWidth / 2 + "px";
    oLogin.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击关闭按钮
    let oClose = document.getElementById("close");

    //点击登陆框以外的区域也可以关闭登陆框
    oClose.onclick = oMask.onclick = function () {
        document.body.removeChild(oLogin);
        document.body.removeChild(oMask);
    };
}

window.onload = function () {
    let oBtn = document.getElementById("btnLogin");
    //点击登录按钮
    oBtn.onclick = function () {
        openNew();
        return false;
    }

}