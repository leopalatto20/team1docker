import pymysql
from pymysql.cursors import DictCursor


def get_connection():
    return pymysql.connect(
        host="db",
        user="root",
        password="root",
        cursorclass=DictCursor,
    )


def init_db(sql_path):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            with open(sql_path, "r") as file:
                sql_script = file.read()

            for statement in sql_script.split(";"):
                cursor.execute(statement)

    except Exception as e:
        print("Error en sql: ", str(e))
