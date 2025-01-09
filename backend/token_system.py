from apscheduler.schedulers.background import BackgroundScheduler
import sqlite3
from cryptography.fernet import Fernet
from typing import Tuple, Optional
import hashlib

# I hate singletons, will do for now!
class DBHandler:
    instance: Optional["DBHandler"] = None

    def __init__(self, db):
        self.__db = db
        self.__cursor = db.cursor()
        if not DBHandler.instance:
            DBHandler.instance = self

    @property
    def db(self):
        return self.__db

    @property
    def cursor(self):
        return self.__cursor


scheduler = BackgroundScheduler()

def rotate_key():
    print(get_latest_version())


scheduler.add_job(rotate_key, 'interval', days=7)
DBHandler(sqlite3.connect("keys.db", check_same_thread=False))


def initialize():
    DBHandler.instance.cursor.execute("""CREATE TABLE IF NOT EXISTS encryption_keys (
            version TEXT PRIMARY KEY,
            key TEXT NOT NULL
        )""")
    DBHandler.instance.db.commit()

    DBHandler.instance.cursor.execute("SELECT * FROM encryption_keys")
    res = DBHandler.instance.cursor.fetchone()

    if res is None or len(res) == 0:
        DBHandler.instance.cursor.execute("INSERT INTO encryption_keys (version, key) VALUES (?, ?)", [1,
                                                                                    Fernet.generate_key()])
        DBHandler.instance.db.commit()

    # scheduler.start()

def get_latest_version() -> int:
    DBHandler.instance.cursor.execute("SELECT * from encryption_keys")
    return DBHandler.instance.cursor.fetchall()[-1][0]

def decrypt_token(token: str) -> Tuple[bool, str]:
    args = token.split("_") # Expects a v<number>_ format, checked upon parent call
    version = args[0][1]
    token_self = "_".join(args[1::])
    DBHandler.instance.cursor.execute("SELECT * FROM encryption_keys WHERE version = ?", version)
    key = DBHandler.instance.cursor.fetchone()[1]
    if key is None:
        return False, "Key version invalid"

    token_decrypted = Fernet(key).decrypt(token_self)

    return True, token_decrypted.decode()

def encrypt_token(token: str) -> Tuple[bool, str]:
    version = get_latest_version()
    if token[0] == "v":
        version = token[1]

    DBHandler.instance.cursor.execute("SELECT * FROM encryption_keys WHERE version = ?", version)
    key = DBHandler.instance.cursor.fetchone()[1]
    if key is None:
        return False, "No latest key found"

    encrypted_token = Fernet(key).encrypt(token.encode())
    if encrypted_token is None:
        return False, "Cannot encrypt"


    return True, f"v{version}_{encrypted_token.decode()}"

def hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()