function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const user_id = uuid();
var count = 0;

function httpRequestSend(count) {
    var text_area = document.getElementById("text_area");
    var is_tree = document.getElementById("is_tree");
    var is_circle = document.getElementById("is_circle");
    var is_line = document.getElementById("is_line");
    var current_session = user_id + count.toString(10);
    var json_object = {"command": "graph2img --output-format=svg ",
                    "data": text_area.value,
                    "is_tree": is_tree.checked,
                    "is_circle": is_circle.checked,
                    "is_line": is_line.checked,
                    "user_id": current_session};
    const request = new XMLHttpRequest();
    request.open("POST", `generate`);
    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(json_object));
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            const img = document.getElementById("img");
            if (img) {
                img.src = "static/img/" + current_session + ".svg";
            }
        }
    }
}

const text_area = document.getElementById("text_area");
if (text_area) {
    text_area.value = "1 2 1\n2 3 2\n1 3 3\n";
    httpRequestSend(count);
}

const selector = document.querySelectorAll("input.graph_type");
if (selector) {
    for (let i = 0; i < selector.length; i++) {
        selector[i].onclick = function() {
            for (let j = 0; j < selector.length; j++) {
                if (i != j) {
                    selector[j].checked = false;
                }
            }
        }
    }
}

const submit = document.getElementById("submit");
if (submit) {
    submit.onclick = function() {
        count = count + 1;
        httpRequestSend(count);
    }
}

const reset = document.getElementById("reset");
if (reset) {
    reset.onclick = function() {
        if (selector) {
            for (let i = 0; i < selector.length; i++) {
                selector[i].checked = false;
            }
        }
        if (text_area) {
            text_area.value = "";
        }
    }
}

const download = document.getElementById("download");
if (download) {
    download.onclick = function() {
        var url = "http://52.165.39.31:5000/static/img/" + user_id + count.toString(10) + ".svg";
        window.open(url);
    }
}