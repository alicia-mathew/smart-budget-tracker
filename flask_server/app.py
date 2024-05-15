from flask import Flask, jsonify, send_from_directory
import os


app = Flask(__name__, static_folder='../react_frontend/db-app/build')


@app.route('/api/test', methods=['GET'])
def test():
    return jsonify(message="testing")


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
