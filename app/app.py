# encoding: utf-8

from flask import Flask, request
from flask import render_template
from flask import jsonify
from werkzeug.utils import secure_filename
import os


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
  ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
  return ext in ALLOWED_EXTS


@app.route('/')
def index():
  return render_template("index.html")


@app.route('/upload', methods=["POST"])
def post_upload():
  if 'file' not in request.files:
    return json_error(status=1, message="no file")
  file = request.files['file']
  if file.filename == '':
    return json_error(status=1, message="no selected file")
  if file and allowed_file(file.filename):
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return send_json()
  return json_error(status=1, message="unknown")


def send_json(data={}, message="ok", status=0):
  return jsonify(dict(status=status,message=message,data=data))


def json_ok(data={}, message="ok"):
  return send_json(data=data, message=message)


def json_error(data={}, message="error", status=1):
  return send_json(data=data, message=message, status=status)
