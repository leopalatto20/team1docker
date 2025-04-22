import time
from server.database.get_connection import get_base_connection


def wait_for_sql():
    connected = False
    while not connected:
        try:
            connection = get_base_connection()
            connection.close()
            connected = True
        except Exception as e:
            print("Esperando a mysql: ", str(e))
            time.sleep(3)
