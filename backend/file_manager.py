import os
import json
from flask import request, jsonify, Blueprint, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import urllib.parse
import uuid
from typing import Tuple, List
import dbmanager as dbm

file_bp = Blueprint("file_manager", __name__)
CORS(file_bp)

COURSE_DIRECTORY = '../cdn/courses'


def get_course_names_from_files():
    course_data = []
    course_dir = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
    
    if not os.path.exists(course_dir):
        os.makedirs(course_dir, exist_ok=True)
        return course_data
        
    for course in os.listdir(course_dir):
        if course.endswith(".json"):
            course_id = course.split(".")[0]
            try:
                with open(os.path.join(course_dir, course)) as f:
                    course_json = json.load(f)
                    course_data.append(course_json["title"])
            except Exception as e:
                print(f"Error reading course file {course}: {str(e)}")
                continue
    return course_data

def get_course_objects() -> List[Tuple[str, str, str, List[str]]]:
    course_data: List[Tuple[str, str, str, List[str]]] = []
    
    course_dir = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
    print(f"Looking for courses in directory: {course_dir}")
    
    if not os.path.exists(course_dir):
        print(f"Course directory does not exist, creating it: {course_dir}")
        os.makedirs(course_dir, exist_ok=True)
        return course_data
    
    courses = os.listdir(course_dir)
    print(f"Found {len(courses)} files in course directory")
        
    for course in courses:
        if course.endswith(".json"):
            course_id = course.split(".")[0]
            course_path = os.path.join(course_dir, course)
            print(f"Reading course file: {course_path}")
            try:
                with open(os.path.join(course_dir, course)) as f:
                    course_json = json.load(f)
                    course_data.append((
                        course_id,
                        course_json["title"],
                        course_json.get("creator", "Unknown"),
                        course_json.get("tags", [])
                    ))
                    print(f"Successfully loaded course: {course_json['title']}")
            except Exception as e:
                print(f"Error reading course file {course}: {str(e)}")
                continue
    
    print(f"Returning {len(course_data)} courses")
    return course_data


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
        user_token = request.headers.get('Authorization')
        print("=== Debug Info ===")
        print("Received token:", user_token)
        print("Headers:", dict(request.headers))
        print("Course data:", json.dumps(course_data, indent=2))

        if not user_token:
            print("No token provided")
            return jsonify({"error": "No authorization token provided"}), 401

        try:
            print("Attempting to get user data from token...")
            user_data = dbm.get_user_by_token(user_token)
            print("User data from DB:", user_data)
            
            if not user_data:
                print("No user found for token in database")
                return jsonify({"error": "Invalid token"}), 401
            
            print(f"Getting profile data for user_id: {user_data[2]}")
            profile_data = dbm.get_profile(user_data[2])
            print("Profile data:", profile_data)
            
            if not profile_data:
                print("No profile found for user")
                return jsonify({"error": "Profile not found"}), 401
                
            username = profile_data[1]
            print("Found username:", username)
            course_data['creator'] = username

        except Exception as e:
            print(f"Database error: {str(e)}")
            print(f"Error type: {type(e)}")
            import traceback
            print("Traceback:", traceback.format_exc())
            return jsonify({"error": f"Database error: {str(e)}"}), 401

        if not course_data:
            return jsonify({"error": "No JSON data received"}), 400

        gen_name = uuid.uuid4()
        print(get_course_names_from_files())
        while gen_name in get_course_names_from_files():
            gen_name = uuid.uuid4()

        print("apple")
        course_title = course_data.get('title', 'untitled_course')
        course_data['title'] = course_title
        print(f"Processing course with title: {course_title}")

        # Generate unique UUID for the file name
        gen_name = str(uuid.uuid4())
        existing_courses = get_course_names_from_files()
        print(f"Existing courses: {existing_courses}")
        while gen_name in existing_courses:
            gen_name = str(uuid.uuid4())
        print(f"Generated unique course ID: {gen_name}")

        save_directory = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
        os.makedirs(save_directory, exist_ok=True)
        print(f"Saving to directory: {save_directory}")

        if 'elements' not in course_data or not isinstance(course_data['elements'], list) or not course_data[
            'elements']:
            return jsonify({"error": "Course elements cannot be empty"}), 400

        # Save course metadata to database
        tags = course_data.get('tags', [])
        if not dbm.save_course(gen_name, course_title, username, tags):
            return jsonify({"error": "Failed to save course metadata"}), 500

        file_path = os.path.join(save_directory, f"{gen_name}.json")
        print(f"Writing course file to: {file_path}")
        with open(file_path, 'w') as f:
            json.dump(course_data, f, indent=2)
        print("Course file written successfully")

        return jsonify({
            "message": "Course saved successfully",
            "courseId": gen_name
        }), 200

    except Exception as e:
        print(f"Error saving course: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@file_bp.route('/api/get_course_names', methods=['GET'])
def get_course_names():
    try:
        course_objects = get_course_objects()
        course_names = [obj[1] for obj in course_objects]
        return jsonify({"course_names": course_names}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@file_bp.route('/api/get_course_objects', methods=['GET'])
def get_course_objects_endpoint():
    try:
        print("Fetching course objects...")
        courses = dbm.get_all_courses()
        print(f"Retrieved {len(courses)} courses from database")

        result = []
        for course in courses:
            try:
                course_data = (
                    course['id'],
                    course['title'],
                    course['creator'],
                    course['tags']
                )
                result.append(course_data)
                print(f"Processed course: {course_data}")
            except Exception as e:
                print(f"Error processing course {course}: {e}")
                continue
        
        print(f"Returning {len(result)} formatted courses")
        return jsonify({
            "response": True,
            "result": result
        })
    except Exception as e:
        print(f"Error in get_course_objects endpoint: {str(e)}")
        return jsonify({
            "response": False,
            "error": str(e)
        }), 500

@file_bp.route('/api/courses/<courseId>', methods=['GET'])
def get_course(courseId):
    try:
        filename = secure_filename(courseId) + '.json'
        course_dir = os.path.join(os.path.dirname(__file__), COURSE_DIRECTORY)
        course_path = os.path.join(course_dir, filename)
        print(f"Attempting to read course: {course_path}")
        
        if not os.path.exists(course_path):
            print(f"Course file not found: {course_path}")
            return jsonify({
                'error': f'Course "{courseId}" not found',
                'debug_info': {
                    'requested_file': filename,
                    'search_path': course_path
                }
            }), 404
        
        print(f"Found course file, sending: {filename}")    
        return send_from_directory(course_dir, filename)
    except Exception as e:
        print(f"Error serving course file: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'debug_info': {
                'course_id': courseId
            }
        }), 500

@file_bp.route('/api/course_progress/<courseId>', methods=['GET', 'OPTIONS'])
def get_course_progress_endpoint(courseId):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error": "No authorization token provided"}), 401

        user_data = dbm.get_user_by_token(user_token)
        if not user_data:
            return jsonify({"error": "Invalid token"}), 401

        progress_data = dbm.get_course_progress(user_data[0], courseId)
        return jsonify(progress_data), 200

    except Exception as e:
        print(f"Error getting course progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/course_progress/<courseId>', methods=['POST', 'OPTIONS'])
def save_course_progress_endpoint(courseId):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error": "No authorization token provided"}), 401

        user_data = dbm.get_user_by_token(user_token)
        if not user_data:
            return jsonify({"error": "Invalid token"}), 401

        progress_data = request.json
        current_step = progress_data.get('currentStep', 0)
        total_steps = progress_data.get('totalSteps', 0)
        
        if total_steps > 0:
            progress = ((current_step + 1) / total_steps) * 100
        else:
            progress = 0

        dbm.save_course_progress(user_data[0], courseId, progress, current_step)
        return jsonify({
            "message": "Progress saved successfully",
            "progress": progress,
            "currentStep": current_step
        }), 200

    except Exception as e:
        print(f"Error saving course progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/course/<courseId>/star', methods=['POST', 'DELETE'])
def handle_course_star(courseId):
    try:
        user_token = request.headers.get('Authorization')
        if not user_token:
            return jsonify({"error": "No authorization token provided"}), 401

        user_data = dbm.get_user_by_token(user_token)
        if not user_data:
            return jsonify({"error": "Invalid token"}), 401

        user_id = user_data[0]

        if request.method == 'POST':
            success = dbm.star_course(user_id, courseId)
            if success:
                return jsonify({"message": "Course starred successfully"}), 200
            return jsonify({"message": "Course already starred"}), 200
        else:
            dbm.unstar_course(user_id, courseId)
            return jsonify({"message": "Star removed successfully"}), 200

    except Exception as e:
        print(f"Error handling course star: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/course/<courseId>/stars', methods=['GET'])
def get_course_stars(courseId):
    try:
        stars = dbm.get_course_stars(courseId)
        user_token = request.headers.get('Authorization')
        has_starred = False
        if user_token:
            user_data = dbm.get_user_by_token(user_token)
            if user_data:
                has_starred = dbm.has_user_starred(user_data[0], courseId)

        return jsonify({
            "stars": stars,
            "hasStarred": has_starred
        }), 200

    except Exception as e:
        print(f"Error getting course stars: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/users/top', methods=['GET'])
def get_top_users():
    try:
        top_users = dbm.get_top_users()
        return jsonify({
            "users": [{
                "username": user[0],
                "stars": user[1]
            } for user in top_users]
        }), 200

    except Exception as e:
        print(f"Error getting top users: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/tags/popular', methods=['GET'])
def get_popular_tags():
    try:
        tags = dbm.get_popular_tags()
        return jsonify({
            "tags": [{
                "name": tag[0],
                "count": tag[1]
            } for tag in tags]
        }), 200
    except Exception as e:
        print(f"Error getting popular tags: {str(e)}")
        return jsonify({"error": str(e)}), 500

@file_bp.route('/api/search', methods=['GET'])
def search_courses():
    try:
        query = request.args.get('q', '').lower()
        tag = request.args.get('tag', '').lower()

        if tag:
            courses = dbm.search_courses_by_tag(tag)
        else:
            cursor = dbm.execute_query("""
                SELECT DISTINCT c.id, c.title, c.creator,
                    (SELECT GROUP_CONCAT(tag) FROM course_tags WHERE course_id = c.id) as tags
                FROM courses c
                LEFT JOIN course_tags ct ON c.id = ct.course_id
                WHERE LOWER(c.title) LIKE %s
                   OR LOWER(c.creator) LIKE %s
                   OR LOWER(ct.tag) LIKE %s
            """, (f"%{query}%", f"%{query}%", f"%{query}%"))
            
            courses = []
            for course in cursor.fetchall():
                tags = course[3].split(',') if course[3] else []
                courses.append((course[0], course[1], course[2], tags))

        return jsonify({
            "courses": [{
                "id": course[0],
                "title": course[1],
                "creator": course[2],
                "tags": course[3]
            } for course in courses]
        }), 200

    except Exception as e:
        print(f"Error searching courses: {str(e)}")
        return jsonify({"error": str(e)}), 500
