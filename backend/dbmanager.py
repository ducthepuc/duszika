from datetime import datetime, timedelta
from hashlib import sha256
import mysql.connector
from mysql.connector import pooling
import json, string, random
import sys
import os

filename = "../db_secrets.json" if len(sys.argv) == 1 else "db_secrets.json"

with open(filename, "r") as f:
    db_secrets = json.load(f)

dbconfig = {
    "pool_name": "mypool",
    "pool_size": 5,
    "host": "localhost",
    "port": 3306,
    "database": db_secrets['name'],
    "user": db_secrets['un'],
    "password": db_secrets['pw'],
    "autocommit": True,
    "pool_reset_session": True
}

def get_connection():
    try:
        return connection_pool.get_connection()
    except Exception as e:
        print(f"Error getting connection from pool: {e}")
        raise

def execute_query(query, params=None, commit=False):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor(buffered=True)
        if isinstance(params, tuple):
            cursor.execute(query, params)
        elif isinstance(params, list):
            cursor.executemany(query, params)
        else:
            cursor.execute(query, params)
        if commit:
            connection.commit()
        return cursor
    except Exception as e:
        print(f"Database error executing query: {e}")
        print(f"Query: {query}")
        print(f"Params: {params}")
        if connection:
            connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)
except Exception as e:
    print(f"Error creating connection pool: {e}")
    raise

def initialize_database():
    try:
        print("Initializing database...")
        execute_query("""
            CREATE TABLE IF NOT EXISTS courses (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                creator VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_creator (creator),
                INDEX idx_title (title)
            )
        """, commit=True)
        print("Courses table created successfully")

        execute_query("""
            CREATE TABLE IF NOT EXISTS course_progress (
                user_id INT,
                course_title VARCHAR(255),
                progress FLOAT,
                current_step INT,
                PRIMARY KEY (user_id, course_title)
            )
        """, commit=True)
        print("Course progress table created successfully")

        execute_query("""
            CREATE TABLE IF NOT EXISTS course_stars (
                user_id INT NOT NULL,
                course_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, course_id)
            )
        """, commit=True)
        print("Course stars table created successfully")

        execute_query("""
            CREATE TABLE IF NOT EXISTS course_tags (
                id INT NOT NULL AUTO_INCREMENT,
                course_id VARCHAR(255) NOT NULL,
                tag VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                INDEX idx_tag (tag),
                INDEX idx_course (course_id)
            )
        """, commit=True)
        print("Course tags table created successfully")

    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def migrate_courses_from_files():
    """Migrate existing courses from JSON files to the database."""
    try:
        execute_query("DELETE FROM course_tags", commit=True)
        execute_query("DELETE FROM course_stars", commit=True)
        execute_query("DELETE FROM courses", commit=True)
        print("Cleared existing course data")
    except Exception as e:
        print(f"Error clearing existing data: {e}")
        raise

    course_dir = os.path.join(os.path.dirname(__file__), '../cdn/courses')
    
    if not os.path.exists(course_dir):
        print(f"Course directory does not exist: {course_dir}")
        return
    
    print(f"Reading courses from directory: {course_dir}")
    files = os.listdir(course_dir)
    print(f"Found {len(files)} files in directory")
    
    courses_to_insert = []
    tags_to_insert = []
    
    print("Starting course migration...")
    for filename in files:
        if filename.endswith('.json'):
            course_id = filename[:-5]
            try:
                file_path = os.path.join(course_dir, filename)
                print(f"Reading course file: {file_path}")
                with open(file_path) as f:
                    course_data = json.load(f)
                    title = course_data.get('title', 'Untitled')
                    creator = course_data.get('creator', 'Unknown')
                    tags = course_data.get('tags', [])
                    
                    print(f"Course data: title={title}, creator={creator}, tags={tags}")
                    
                    courses_to_insert.append((course_id, title, creator))

                    for tag in tags:
                        tags_to_insert.append((course_id, tag.lower()))
                    
                    print(f"Prepared course for migration: {title}")
            except Exception as e:
                print(f"Error reading course {filename}: {e}")
                continue
    
    try:
        if courses_to_insert:
            print(f"Inserting {len(courses_to_insert)} courses into database")
            execute_query(
                "INSERT INTO courses (id, title, creator) VALUES (%s, %s, %s)",
                courses_to_insert,
                commit=True
            )
            print(f"Successfully migrated {len(courses_to_insert)} courses")
        else:
            print("No courses to insert")
        
        if tags_to_insert:
            print(f"Inserting {len(tags_to_insert)} tags into database")
            execute_query(
                "INSERT INTO course_tags (course_id, tag) VALUES (%s, %s)",
                tags_to_insert,
                commit=True
            )
            print(f"Successfully migrated {len(tags_to_insert)} tags")
        else:
            print("No tags to insert")
            
    except Exception as e:
        print(f"Error during batch migration: {e}")
        raise

try:
    initialize_database()
    cursor = execute_query("SELECT COUNT(*) FROM courses")
    count = cursor.fetchone()[0]
    if count == 0:
        print("Courses table is empty, starting migration...")
        migrate_courses_from_files()
    else:
        print(f"Found {count} existing courses, skipping migration")
except Exception as e:
    print(f"Error during database initialization: {e}")

base_date = datetime(1900, 1, 1).date()

def time_to_dt(days_since_1900):
    return base_date + timedelta(days=days_since_1900)

def dt_to_time(date):
    return (date - base_date).days

def generate_token():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join([random.choice(chars) for _ in range(30)])

class DCData:
    def __init__(self):
        ...

def add_user(name: str, password, pw2, user_email, is_discord, discord_data: DCData):
    if password != pw2:
        raise ValueError("Passwords do not match")

    cursor = execute_query(
        "INSERT INTO profile (username, description, streak) VALUES (%s, %s, %s)",
        (name, "", 0),
        commit=True
    )
    profile_id = cursor.lastrowid

    if is_discord:
        registration_id = 0
    else:
        cursor = execute_query(
            "INSERT INTO classical_registration (email, password) VALUES (%s, %s)",
            (user_email, sha256(password.encode('utf-8')).hexdigest()),
            commit=True
        )
        registration_id = cursor.lastrowid

    token = generate_token()
    execute_query(
        "INSERT INTO user (isDiscord, profile_id, registration_id, token, username, joined, isAccountValid, role) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (is_discord, profile_id, registration_id, token, name.lower(), datetime.now(), True, 'basic'),
        commit=True
    )

def get_user(id):
    cursor = execute_query("SELECT * FROM user WHERE id = %s", (id,))
    row = cursor.fetchone()
    return row

def change_password(id, password):
    user = get_user(id)

def login_user_via_auth(email, password):
    password = sha256(password.encode('utf-8')).hexdigest()

    cursor = execute_query(
        "SELECT * FROM classical_registration WHERE email = %s AND password = %s",
        (email, password)
    )
    registration_data = cursor.fetchone()
    if registration_data is None:
        raise ValueError("Password or email is wrong!")
    
    registration_id = registration_data[0]
    cursor = execute_query(
        "SELECT * FROM user WHERE registration_id = %s",
        (registration_id,)
    )
    user = cursor.fetchone()
    if user is None:
        raise ValueError("User not found!")

    return user

def get_user_by_token(token):
    try:
        print(f"Getting user by token: {token}")
        cursor = execute_query("SELECT * FROM user WHERE token = %s", (token,))
        row = cursor.fetchone()
        if not row:
            print("No user found for token")
            return None
        print(f"Found user: id={row[0]}, username={row[5]}, profile_id={row[2]}")
        return row[0], row[5], row[2]
    except Exception as e:
        print(f"Error in get_user_by_token: {e}")
        return None

def get_profile(profile_id):
    cursor = execute_query("SELECT * FROM profile WHERE id = %s", (profile_id,))
    return cursor.fetchone()

def change_display_name(token, new_name):
    usr = get_user_by_token(token)
    if not usr:
        raise ValueError("Invalid token")
    execute_query(
        "UPDATE profile SET username = %s WHERE id = %s",
        (new_name, usr[2]),
        commit=True
    )

def change_bio(token, new_bio):
    usr = get_user_by_token(token)
    if not usr:
        raise ValueError("Invalid token")
    execute_query(
        "UPDATE profile SET description = %s WHERE id = %s",
        (new_bio, usr[2]),
        commit=True
    )

def get_course_progress(user_id, course_title):
    cursor = execute_query(
        "SELECT progress, current_step FROM course_progress WHERE user_id = %s AND course_title = %s",
        (user_id, course_title)
    )
    result = cursor.fetchone()
    return {
        'progress': result[0] if result else 0,
        'currentStep': result[1] if result else 0
    } if result else {'progress': 0, 'currentStep': 0}

def save_course_progress(user_id, course_title, progress, current_step):
    execute_query(
        """
        INSERT INTO course_progress (user_id, course_title, progress, current_step) 
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        progress = %s, current_step = %s
        """,
        (user_id, course_title, progress, current_step, progress, current_step),
        commit=True
    )

def star_course(user_id, course_id):
    try:
        execute_query(
            "INSERT INTO course_stars (user_id, course_id) VALUES (%s, %s)",
            (user_id, course_id),
            commit=True
        )
        return True
    except mysql.connector.Error as err:
        if err.errno == 1062:  # Duplicate entry error
            return False
        raise

def unstar_course(user_id, course_id):
    execute_query(
        "DELETE FROM course_stars WHERE user_id = %s AND course_id = %s",
        (user_id, course_id),
        commit=True
    )

def get_course_stars(course_id):
    cursor = execute_query(
        "SELECT COUNT(*) FROM course_stars WHERE course_id = %s",
        (course_id,)
    )
    return cursor.fetchone()[0]

def has_user_starred(user_id, course_id):
    cursor = execute_query(
        "SELECT 1 FROM course_stars WHERE user_id = %s AND course_id = %s",
        (user_id, course_id)
    )
    return bool(cursor.fetchone())

def get_user_total_stars(username):
    cursor = execute_query("""
        SELECT COUNT(*) 
        FROM course_stars cs 
        JOIN courses c ON cs.course_id = c.id 
        WHERE c.creator = %s
    """, (username,))
    return cursor.fetchone()[0]

def get_top_users(limit=10):
    cursor = execute_query("""
        SELECT c.creator, COUNT(*) as star_count 
        FROM course_stars cs 
        JOIN courses c ON cs.course_id = c.id 
        GROUP BY c.creator 
        ORDER BY star_count DESC 
        LIMIT %s
    """, (limit,))
    return cursor.fetchall()

def save_course_tags(course_id, tags):
    execute_query(
        "DELETE FROM course_tags WHERE course_id = %s",
        (course_id,),
        commit=True
    )

    if tags:
        values = [(course_id, tag.lower()) for tag in tags]
        execute_query(
            "INSERT INTO course_tags (course_id, tag) VALUES (%s, %s)",
            values,
            commit=True
        )

def get_popular_tags(limit=8):
    cursor = execute_query("""
        SELECT tag, COUNT(*) as count
        FROM course_tags
        GROUP BY tag
        ORDER BY count DESC
        LIMIT %s
    """, (limit,))
    return cursor.fetchall()

def search_courses_by_tag(tag):
    cursor = execute_query("""
        SELECT DISTINCT c.id, c.title, c.creator, 
            (SELECT GROUP_CONCAT(tag) FROM course_tags WHERE course_id = c.id) as tags
        FROM course_tags ct
        JOIN courses c ON ct.course_id = c.id
        WHERE LOWER(ct.tag) = LOWER(%s)
    """, (tag,))
    courses = []
    for course in cursor.fetchall():
        tags = course[3].split(',') if course[3] else []
        courses.append((course[0], course[1], course[2], tags))
    return courses

def get_course_tags(course_id):
    cursor = execute_query("""
        SELECT tag
        FROM course_tags
        WHERE course_id = %s
        ORDER BY created_at DESC
    """, (course_id,))
    return [row[0] for row in cursor.fetchall()]

def save_course(course_id, title, creator, tags=None):
    try:
        execute_query(
            "INSERT INTO courses (id, title, creator) VALUES (%s, %s, %s) "
            "ON DUPLICATE KEY UPDATE title = %s, creator = %s",
            (course_id, title, creator, title, creator),
            commit=True
        )
        
        if tags is not None:
            save_course_tags(course_id, tags)
        
        return True
    except Exception as e:
        print(f"Error saving course: {e}")
        return False

def get_course(course_id):
    cursor = execute_query(
        "SELECT id, title, creator FROM courses WHERE id = %s",
        (course_id,)
    )
    course = cursor.fetchone()
    if course:
        tags = get_course_tags(course_id)
        return {
            'id': course[0],
            'title': course[1],
            'creator': course[2],
            'tags': tags
        }
    return None

def get_all_courses():
    try:
        print("Fetching all courses from database...")
        cursor = execute_query(
            "SELECT id, title, creator FROM courses ORDER BY created_at DESC"
        )
        courses = cursor.fetchall()
        print(f"Found {len(courses)} courses in database")
        
        result = []
        for course in courses:
            try:
                tags = get_course_tags(course[0])
                course_data = {
                    'id': course[0],
                    'title': course[1],
                    'creator': course[2],
                    'tags': tags
                }
                print(f"Processed course: {course_data}")
                result.append(course_data)
            except Exception as e:
                print(f"Error processing course {course[0]}: {e}")
        
        print(f"Returning {len(result)} processed courses")
        return result
    except Exception as e:
        print(f"Error in get_all_courses: {e}")
        return []

def delete_course(course_id):
    try:
        execute_query(
            "DELETE FROM courses WHERE id = %s",
            (course_id,),
            commit=True
        )
        execute_query(
            "DELETE FROM course_tags WHERE course_id = %s",
            (course_id,),
            commit=True
        )
        execute_query(
            "DELETE FROM course_stars WHERE course_id = %s",
            (course_id,),
            commit=True
        )
        return True
    except Exception as e:
        print(f"Error deleting course: {e}")
        return False
