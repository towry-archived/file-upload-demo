# encoding: utf-8

import os
from flask import Flask, request
from flask import render_template
from flask import jsonify
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
    'temp'
)
ALLOWED_EXTS = set(
    ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip']
)


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    """
    pass
    """
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return ext in ALLOWED_EXTS


@app.route('/')
def index():
    """
    pass
    """
    return render_template("index.html")


@app.route('/upload', methods=["POST"])
def post_upload():
    """
    pass
    """
    if 'file' not in request.files:
        return json_error(status=1, message="no file")
    _file = request.files['file']
    if _file.filename == '':
        return json_error(status=1, message="no selected file")

    print("got one file: {}".format(_file.filename))

    if _file and allowed_file(_file.filename):
        filename = secure_filename(_file.filename)
        _file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return send_json()
    return json_error(status=1, message="unknown")


def send_json(data=None, message="ok", status=0):
    """
    pass
    """
    return jsonify(dict(status=status, message=message, data=data or dict()))


def json_ok(data=None, message="ok"):
    """
    pass
    """
    return send_json(data=data, message=message)


def json_error(data=None, message="error", status=1):
    """
    pass
    """
    return send_json(data=data, message=message, status=status)
