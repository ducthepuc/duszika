import os
import json
from flask import request, jsonify, Blueprint, send_from_directory
from werkzeug.utils import secure_filename
import urllib.parse

file_bp = Blueprint("file_manager", __name__)

COURSE_DIRECTORY = '../cdn/courses'


def get_course_names_from_files():
    course_names = []
    for course in os.listdir(COURSE_DIRECTORY):
        if course.endswith(".json"):
            course_name = course.split(".")[0].replace('_', ' ')
            course_names.append(course_name)
    return course_names


@file_bp.route('/api/file_upload', methods=['POST'])
def save_course():
    try:
        course_data = request.json

        if not course_data:
            return jsonify({"error": "No JSON data received"}), 400

        course_title = course_data.get('title', 'untitled_course').replace(' ', '_')
        course_data['title'] = course_title

        course_names = get_course_names_from_files()

        if course_title in course_names:
            return jsonify({"error": "Course title already exists"}), 400

        save_directory = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
        os.makedirs(save_directory, exist_ok=True)

        if 'elements' not in course_data or not isinstance(course_data['elements'], list) or not course_data[
            'elements']:
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
    try:
        # Decode the URL-encoded course title and replace spaces with underscores
        courseTitle = urllib.parse.unquote(courseTitle).replace(' ', '_')

        # Sanitize the course title and ensure it has .json extension
        filename = secure_filename(courseTitle) + '.json'

        # Get absolute path to course directory
        course_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY))
        course_path = os.path.join(course_dir, filename)

        # Check if the file exists
        if not os.path.exists(course_path):
            return jsonify({
                'error': f'Course "{courseTitle}" not found',
                'debug_info': {
                    'requested_file': filename,
                    'search_path': course_path
                }
            }), 404

        # Read and return the course data
        try:
            with open(course_path, 'r', encoding='utf-8') as file:
                course_data = json.load(file)
                return jsonify(course_data)
        except json.JSONDecodeError:
            return jsonify({
                'error': f'Invalid JSON format in course file: {filename}'
            }), 500
        except Exception as e:
            return jsonify({
                'error': f'Error reading course file: {str(e)}'
            }), 500

    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'debug_info': {
                'course_title': courseTitle
            }
        }), 500
