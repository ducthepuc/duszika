from datetime import datetime, timedelta
from hashlib import sha256

from mysql import connector
import json, string, random

with open("../db_secrets.json", "r") as f:
    db_secrets = json.load(f)

sql = connector.connect(port=3306,
                        database=db_secrets['name'],
                        user=db_secrets['un'],
                        password=db_secrets['pw'])

cursor = sql.cursor(buffered=True)

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


def add_user(name, password, pw2, user_email, is_discord, discord_data: DCData):
    if password != pw2:
        raise ValueError("Passwords do not match")

    cursor.execute("INSERT INTO profile (username, description, streak) VALUES (%s, %s, %s)",
                   params=(name, "", 0))

    profile_id = cursor.lastrowid

    if is_discord:
        # cursor.execute("INSERT INTO")
        registration_id = 0
        ...
    else:
        cursor.execute("INSERT INTO classical_registration (email, password) VALUES (%s, %s)",
                       params=(user_email, sha256(password.encode('utf-8')).hexdigest()))
        registration_id = cursor.lastrowid

    token = generate_token()
    cursor.execute(
        "INSERT INTO user (isDiscord, profile_id, registration_id, token, username, joined, isAccountValid) VALUES "
        "(%s,%s,%s,%s,%s,%s,%s)", params=(is_discord, profile_id, registration_id, token,
                                          name, datetime.now(), True))

    sql.commit()


def get_user(id):
    cursor.execute("SELECT * FROM user WHERE id = %s", (id))
    row = cursor.fetchone()

    return row


def change_password(id, password):
    user = get_user(id)


def login_user_via_auth(email, password):
    password = sha256(password.encode('utf-8')).hexdigest()

    cursor.execute("SELECT * FROM classical_registration WHERE email = %s AND password = %s",
                   (email, password))
    registration_data = cursor.fetchone()
    if registration_data is None:
        raise ValueError("Password or email is wrong!")
    registration_id = registration_data[0]
    cursor.execute("SELECT * FROM user WHERE registration_id = %s", (registration_id,))
    user = cursor.fetchone()
    if user is None:
        raise ValueError("User not found!")

    return user


def get_user(token):
    cursor.execute("SELECT * FROM user WHERE token = %s", (token))
    row = cursor.fetchone()

    return row

# cursor.close()
