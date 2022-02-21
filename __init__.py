from flask import Flask, render_template, request, make_response
import os
# import graph2img

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
    outputPath = os.path.join(path, json_object["user_id"])
    with open(inputPath, "w", encoding='utf-8') as file:
        file.writelines(json_object["data"])
    if json_object["is_tree"]:
        logPath = os.path.join(path, json_object["user_id"] + ".log")
        os.system("graph2img --output-format=svg --temp-path=" + tempPath + " " + inputPath + " " + outputPath + ".svg --shape=tree > " + logPath)
        with open(logPath, "r") as f:
            if f.readline() != "":
                return "TreeTest Failed"
        # EdgeSet = graph2img.read_graph(inputPath)
        # if not graph2img.isTree(EdgeSet):
        #    return "TreeTest Failed"
        # graph2img.main(output_format='svg', temp_path=tempPath, input_file=inputPath, output_file=outputPath, shape="tree")
    elif json_object["is_circle"]:
        os.system("graph2img --output-format=svg --temp-path=" + tempPath + " " + inputPath + " " + outputPath + ".svg --shape=circle")
        # graph2img.main(output_format='svg', temp_path=tempPath, input_file=inputPath, output_file=outputPath, shape="circle")
    else:
        os.system("graph2img --output-format=svg --temp-path=" + tempPath + " " + inputPath + " " + outputPath + ".svg --shape=line")
        # graph2img.main(output_format='svg', temp_path=tempPath, input_file=inputPath, output_file=outputPath, shape="line")
    resp = make_response('OK')
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)