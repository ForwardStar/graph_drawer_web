function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const user_id = uuid();
var count = 0;

function httpRequestSend() {
    var text_area = document.getElementById("text_area");
    var is_tree = document.getElementById("is_tree");
    var is_circle = document.getElementById("is_circle");
    var is_line = document.getElementById("is_line");
    var current_session = user_id + count.toString(10);
    var json_object = {"data": text_area.value,
                    "is_tree": is_tree.checked,
                    "is_circle": is_circle.checked,
                    "is_line": is_line.checked,
                    "user_id": current_session};
    if (json_object["is_tree"] === false && json_object["is_circle"] === false && json_object["is_line"] === false) {
        alert("InputFormat Error: please select a type of graph to draw.");
        return;
    }
    const request = new XMLHttpRequest();
    request.open("POST", `generate`);
    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(json_object));
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            if (request.responseText === "TreeTest Failed") {
                alert(request.responseText + ": the input graph is not a tree.");
                count = count - 1;
            }
            else {
                const img = document.getElementById("img");
                if (img) {
                    img.src = "static/img/" + current_session + ".svg";
                }
                if (json_object["is_line"]) {
                    var vertex_set = new Map();
                    var u = "";
                    var v = "";
                    var start_position = 0;
                    user_input = json_object["data"];
                    for (var i = 0; i < user_input.length; i++) {
                        if (user_input[i] === ' ') {
                            if (i === 0 || user_input[i - 1] === ' ') {
                                start_position = i + 1;
                                continue;
                            }
                            if (u === "") {
                                for (var j = start_position; j < i; j++) {
                                    u += user_input[j];
                                }
                            }
                            else if (v === "") {
                                for (var j = start_position; j < i; j++) {
                                    v += user_input[j];
                                }
                            }
                            start_position = i + 1;
                        }
                        else if (user_input[i] === "\n") {
                            if (vertex_set.has(u) === false) {
                                vertex_set.set(u, true);
                            }
                            if (vertex_set.has(v) === false) {
                                vertex_set.set(v, true);
                            }
                            u = "";
                            v = "";
                            start_position = i + 1;
                        }
                    }
                    if (u != "" && vertex_set.has(u) === false) {
                        vertex_set.set(u, true);
                    }
                    if (v != "" && vertex_set.has(v) === false) {
                        vertex_set.set(v, true);
                    }
                    if (vertex_set.size >= 10) {
                        img.width = "100%";
                    }
                    else {
                        img.width = String(vertex_set.size * 10) + "%";
                    }
                }
            }
        }
    }
}

const text_area = document.getElementById("text_area");
if (text_area) {
    text_area.value = "1 2 1\n2 3 2\n1 3 3\n";
    httpRequestSend();
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
        httpRequestSend();
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