import pymysql
from pymysql.cursors import DictCursor
import json


def get_connection():
    return pymysql.connect(
        host="db",
        user="root",
        password="root",
        database="Videojuego",
        cursorclass=DictCursor,
    )


def insert_data(maestros_path, niveles_path, preguntas_path):
    print("Insertando informacion a la base de datos")
    insert_maestros(maestros_path)
    insert_niveles(niveles_path)
    insert_preguntas(preguntas_path)


def insert_maestros(json_path):
    connection = get_connection()
    with open(json_path, "r", encoding="UTF-8") as file:
        maestros = json.load(file)

    select_query = "SELECT * FROM Maestro WHERE Correo=%s AND Grupo=%s AND Nombre=%s"
    insert_query = "INSERT INTO Maestro(Correo, Grupo, Nombre) VALUES(%s, %s, %s)"
    try:
        with connection.cursor() as cursor:
            for maestro in maestros:
                cursor.execute(
                    select_query,
                    (maestro["Correo"], maestro["Grupo"], maestro["Nombre"]),
                )
                if cursor.fetchone():
                    print(f"Omitiendo a {maestro['Nombre']}")
                else:
                    cursor.execute(
                        insert_query,
                        (maestro["Correo"], maestro["Grupo"], maestro["Nombre"]),
                    )
            connection.commit()

    except Exception as e:
        print("Error en sql: ", str(e))


def insert_niveles(json_path):
    connection = get_connection()
    with open(json_path, "r", encoding="UTF-8") as file:
        niveles = json.load(file)

    select_query = (
        "SELECT * FROM Nivel WHERE NumNivel=%s AND NumPreguntas=%s and Descripcion=%s"
    )
    insert_query = (
        "INSERT INTO Nivel(NumNivel, NumPreguntas, Descripcion) VALUES (%s, %s, %s)"
    )

    try:
        with connection.cursor() as cursor:
            for nivel in niveles:
                cursor.execute(
                    select_query,
                    (nivel["NumNivel"], nivel["NumPreguntas"], nivel["Descripcion"]),
                )
                if cursor.fetchone():
                    print(f"Omitiendo el nivel {nivel['NumNivel']}")
                else:
                    cursor.execute(
                        insert_query,
                        (
                            nivel["NumNivel"],
                            nivel["NumPreguntas"],
                            nivel["Descripcion"],
                        ),
                    )
            connection.commit()
    except Exception as e:
        print("Error en sql: ", str(e))


def insert_preguntas(json_path):
    connection = get_connection()
    with open(json_path, "r", encoding="UTF-8") as file:
        preguntas = json.load(file)

    select_query = (
        "SELECT * FROM Pregunta WHERE Texto=%s and NumNivel=%s AND Respuesta=%s"
    )
    insert_query = (
        "INSERT INTO Pregunta(Texto, NumNivel, Respuesta) VALUES (%s, %s, %s)"
    )

    try:
        with connection.cursor() as cursor:
            for pregunta in preguntas:
                cursor.execute(
                    select_query,
                    (pregunta["Texto"], pregunta["NumNivel"], pregunta["Respuesta"]),
                )
                if cursor.fetchone():
                    print(f"Omitiendo la pregunta {pregunta['Texto']}")
                else:
                    cursor.execute(
                        insert_query,
                        (
                            pregunta["Texto"],
                            pregunta["NumNivel"],
                            pregunta["Respuesta"],
                        ),
                    )
            connection.commit()
    except Exception as e:
        print("Error en sql: ", str(e))
