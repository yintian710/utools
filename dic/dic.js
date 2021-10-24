utools.onPluginEnter(({code, type, payload}) => {
    console.log(111)
    document.getElementById("input").value = ''
    document.getElementById("result").innerHTML = ''
    document.getElementById("input").focus()
});

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

function highLight(json) {
    json = json.toString()
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let res = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        return strReplaceJson(match)
    });
    return res.toString()

}

function strReplaceJson(match) {
    let cls = 'number';
    if (/^"/.test(match)) {
        if (/:$/.test(match)) {
            cls = 'key';
        } else {
            cls = 'string';
        }
    } else if (/true|false/.test(match)) {
        cls = 'boolean';
    } else if (/null/.test(match)) {
        cls = 'null';
    }
    let res = '<span class="' + cls + '">' + match + '</span>';
    return res.toString()

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
        copy(text_new1)
        let json = highLight(text_new1)
        json = json + '\n\n 已自动复制'
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
    if((e.ctrlKey && e.keyCode === 86) || (e.shiftKey && e.keyCode === 45)){
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
    let help_text = '我'
    window.alert(help_text);
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
};

window.onload = function () {
    let oBtn = document.getElementById("btnLogin");
    //点击登录按钮
    oBtn.onclick = function () {
        openNew();
        return false;
    }

}