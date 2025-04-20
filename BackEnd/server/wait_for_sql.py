import pymysql
import time


def get_connection():
    return pymysql.connect(
        host="db",
        user="root",
        password="root",
        database="Videojuego",
    )


def wait_for_sql():
    connected = False
    while not connected:
        try:
            connection = get_connection()
            connection.close()
            connected = True
        except Exception as e:
            print("Esperando a mysql: ", str(e))
            time.sleep(3)
