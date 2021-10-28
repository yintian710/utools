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

function defaultSwitch(text) {
    return [text, highLight(text)]
}

function javaOkHttp(text) {
    let new_text = ''
    let json = JSON.parse(text)
    for (let key in json) {
        new_text = new_text + '.addHeader(\"' + key + '\",\"' + json[key] + '\")\n'
    }
    return [new_text, new_text]
}