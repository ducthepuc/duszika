import os
import json
from flask import request, jsonify, Blueprint, send_from_directory
from werkzeug.utils import secure_filename
import uuid
from typing import Tuple, List

file_bp = Blueprint("file_manager", __name__)

COURSE_DIRECTORY = '../cdn/courses'


def get_course_names_from_files():
    course_names = []
    for course in os.listdir(COURSE_DIRECTORY):
        if course.endswith(".json"):
            course_name = course.split(".")[0].replace('_', ' ')
            course_names.append(course_name)
    return course_names


def get_course_objects() -> List[Tuple[str, str]]:
    course_data: List[Tuple[str, str]] = []
    for course in os.listdir(COURSE_DIRECTORY):
        if course.endswith(".json"):
            course_id = course.split(".")[0]
            with open(os.path.join(COURSE_DIRECTORY, course)) as f:
                course_data.append((course_id, json.load(f)["title"]))

    return course_data


@file_bp.route('/api/file_upload', methods=['POST'])
def save_course():
    try:
        auth = request.headers.get("Authorization")
        if not auth:
            return {
                "result": False,
                "reason": "Authorization fail"
            }

        course_data = request.json

        if not course_data:
            return jsonify({"error": "No JSON data received"}), 400

        gen_name = uuid.uuid4()
        print(get_course_names_from_files())
        while gen_name in get_course_names_from_files():
            gen_name = uuid.uuid4()

        print("apple")
        course_title = course_data.get('title', 'untitled_course')
        course_data['title'] = course_title

        course_names = get_course_names_from_files()

        if course_title in course_names:
            return jsonify({"error": "Course title already exists"}), 400

        save_directory = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
        os.makedirs(save_directory, exist_ok=True)

        if 'elements' not in course_data or not isinstance(course_data['elements'], list) or not course_data[
            'elements']:
            return jsonify({"error": "Course elements cannot be empty"}), 400

        file_path = os.path.join(save_directory, f"{gen_name}.json")
        with open(file_path, 'w') as f:
            json.dump(course_data, f, indent=2)

        return jsonify({"message": "Course saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Ez borzalmas fos
@file_bp.route('/api/get_course_names', methods=['GET'])
def get_course_names():
    try:
        course_names = get_course_names_from_files()
        return jsonify({"course_names": course_names}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@file_bp.route("/api/get_course_objects")
def course_objects():
    return jsonify({
        "response": True,
        "result": get_course_objects(),
    })


@file_bp.route('/api/courses/<courseId>', methods=['GET'])
def get_course(courseId):
    filename = secure_filename(courseId) + '.json'

    return send_from_directory(COURSE_DIRECTORY, filename)
