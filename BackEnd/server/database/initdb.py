from server.database.get_connection import get_base_connection

def init_db(sql_path):
    connection = get_base_connection()
    try:
        with connection.cursor() as cursor:
            with open(sql_path, "r") as file:
                sql_script = file.read()

            for statement in sql_script.split(";"):
                cursor.execute(statement)

    except Exception as e:
        print("Error en sql: ", str(e))
