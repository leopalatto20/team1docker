import pymysql
from pymysql.cursors import DictCursor

def get_base_connection():
    return pymysql.connect(
        host="db",
        user="root",
        password="root",
        cursorclass=DictCursor,
    )


def get_connection():
    return pymysql.connect(
        host="db",
        user="root",
        password="root",
        database="Videojuego",
        cursorclass=DictCursor,
    )
