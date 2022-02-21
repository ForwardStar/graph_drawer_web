from flask import Flask, render_template, request, make_response
import os
import time

app = Flask(__name__)
path = "static/img"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/generate', methods=['POST'])
def generate():
    json_object = request.get_json()
    if not os.path.exists(path):
        os.mkdir(path)
    tempPath = os.path.join(path, json_object["user_id"] + "temp")
    inputPath = os.path.join(path, json_object["user_id"] + ".txt")
    outputPath = os.path.join(path, json_object["user_id"] + ".svg")
    with open(inputPath, "w", encoding='utf-8') as file:
        file.writelines(json_object["data"])
    if json_object["is_tree"]:
        os.system(json_object["command"] + "--temp-path=" + tempPath + " " + inputPath + " " + outputPath + " --shape=tree")
    elif json_object["is_circle"]:
        os.system(json_object["command"] + "--temp-path=" + tempPath + " " + inputPath + " " + outputPath + " --shape=circle")
    else:
        os.system(json_object["command"] + "--temp-path=" + tempPath + " " + inputPath + " " + outputPath + " --shape=line")
    resp = make_response('OK')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'POST'
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)