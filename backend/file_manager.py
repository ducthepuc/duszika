import os
import json
from flask import request, jsonify, Blueprint

file_bp = Blueprint("file_manager", __name__)

COURSE_DIRECTORY = '../cdn/courses'

def get_course_names_from_files():
    course_names = []
    for course in os.listdir(COURSE_DIRECTORY):
        if course.endswith(".json"):
            course_names.append(course.split(".")[0])
    return course_names

@file_bp.route('/api/file_upload', methods=['POST'])
def save_course():
    try:
        course_data = request.json

        if not course_data:
            return jsonify({"error": "No JSON data received"}), 400

        course_title = course_data.get('title', 'untitled_course')

        course_names = get_course_names_from_files()

        if course_title in course_names:
            return jsonify({"error": "Course title already exists"}), 400

        save_directory = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
        os.makedirs(save_directory, exist_ok=True)

        if 'elements' not in course_data or not isinstance(course_data['elements'], list) or not course_data['elements']:
            return jsonify({"error": "Course elements cannot be empty"}), 400

        file_path = os.path.join(save_directory, f"{course_title}.json")
        with open(file_path, 'w') as f:
            json.dump(course_data, f, indent=2)

        return jsonify({"message": "Course saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    

@file_bp.route('/api/get_course_names', methods=['GET'])
def get_course_names():
    try:
        course_names = get_course_names_from_files()
        return jsonify({"course_names": course_names}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    

@file_bp.route('/api/courses/<courseTitle>', methods=['GET'])
def get_course(courseTitle):
    course_data = None
    for course in os.listdir(COURSE_DIRECTORY):
        if course.split(".")[0] == courseTitle:
            course_file_path = os.path.join(COURSE_DIRECTORY, course)
            with open(course_file_path, 'r') as file:
                try:
                    course_data = json.load(file)
                except json.JSONDecodeError:
                    return jsonify({"error": f"Failed to parse {courseTitle} course data"}), 500
    
    if course_data:
        return jsonify(course_data)
    else:
        return jsonify({"error": "Course not found"}), 404
