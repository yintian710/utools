utools.onPluginEnter(({code, type, payload}) => {
    document.getElementById("input").focus()
});
function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            console.log(JSON.parse(str))
            return true;
        }
    } catch(e) {
    }
    return false;
}
function highLight(json){
    json = json.toString()
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let res = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        return strReplace(match)
    });
    return res.toString()
}
function strReplace(match) {
    var cls = 'number';
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
        text = input.innerHTML;
    }
    let text_new = text.replace(/"/g, "\\\"")
        .replace(/(.*?):\s?(.*?)\n/g, '"$1": "$2",\n')
    let text_new1 = '{\n' + text_new.substr(0, text_new.length - 2) + '\n}';
    result.innerHTML = text_new1;
    if(isJsonString(text_new1)){
        // input.innerHTML = text_new1
        // input.select();
        // document.execCommand('copy');
        // input.innerHTML = text
        copy(text_new1)
        let json =  highLight(text_new1)
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
    var input = document.createElement('input'); input.setAttribute('id', 'text');

    input.setAttribute('value', text);

    document.getElementsByTagName('body')[0].appendChild(input);

    document.getElementById('text').select();

    document.execCommand('copy')

    document.getElementById('text').remove();

}