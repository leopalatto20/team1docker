from fastapi import HTTPException, Form
import uvicorn
from datetime import datetime
from server.models import MaestroLogin
from server.config import app
from server.database.get_connection import get_connection


@app.post("/alumno/login")
async def alumno_login(  # Login que usa el alumno para hacer login en el videojuego
    Genero: str = Form(...), Grupo: str = Form(...), NumLista: int = Form(...)
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT IDAlumno FROM Alumno WHERE Genero = %s AND Grupo = %s AND NumLista = %s",
                (Genero, Grupo, NumLista),
            )
            result = cursor.fetchone()
            # Si el alumno existe, se devuelve el IDAlumno para usarse en el juego
            if result:
                return {"Valido": True, "IDAlumno": result["IDAlumno"]}
            else:
                return {"Valido": False, "IDAlumno": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/maestro/login")  # Login que se usa para el maestro en el dashboard
async def maestro_login(maestro: MaestroLogin):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT IDMaestro FROM Maestro WHERE Correo = %s AND Grupo = %s",
                (maestro.Correo, maestro.Grupo),
            )
            result = cursor.fetchone()
            # Misma lógica que el login del alumno, se devuelve el IDMaestro para usarse en el dashboard
            if result:
                return {"Valido": True, "IDMaestro": result["IDMaestro"]}
            else:
                return {"Valido": False, "IDMaestro": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#### CRUD DE LA BASE DE DATOS ####


## LEER
@app.get(
    "/preguntas_completas/nivel1"
)  # Regresa toda la lista de preguntas del nivel 1, para usarse en el dashboard
async def obtener_preguntas_nivel1():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT IDPregunta, Texto, Respuesta FROM Pregunta WHERE NumNivel = 1",
            )
            result = cursor.fetchall()
            if result:
                return {"questions": result}
            else:
                return {"questions": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_alumnos/{IDMaestro}")  # Regresa la lista de alumnos del maestro
async def obtener_info_alumnos(IDMaestro: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = "SELECT IDAlumno, NumLista, Genero, Grupo FROM Alumno WHERE IDMaestro = %s;"
            cursor.execute(query, (IDMaestro,))
            result = cursor.fetchall()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


## ELIMINAR
@app.delete("/delete_alumno/{IDAlumno}")  # Elimina un alumno de la base de datos
async def eliminar_alumno(IDAlumno: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM Alumno WHERE IDAlumno = %s", (IDAlumno,))
            connection.commit()
            return {"message": "Alumno eliminado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/borrar_pregunta/{IDPregunta}")  # Elimina una pregunta de la base de datos
async def eliminar_pregunta(IDPregunta: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM Pregunta WHERE IDPregunta = %s", (IDPregunta,))
            connection.commit()
            return {"message": "Pregunta eliminada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/delete_sesiones/{Grupo}")  # Elimina todas las sesiones de un grupo
async def eliminar_sesiones(Grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM SesionNivel WHERE IDAlumno IN (SELECT IDAlumno FROM Alumno WHERE Grupo = %s)",
                (Grupo,),
            )
            connection.commit()
            return {"message": "Sesiones eliminadas"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


## CREAR
@app.post("/alumno/agregar")  # Agrega un alumno a la base de datos
async def agregar_alumno(
    NumLista: int = Form(...),
    Genero: str = Form(...),
    Grupo: str = Form(...),
    IDMaestro: int = Form(...),
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Alumno ( NumLista, Genero, Grupo, IDMaestro) VALUES (%s, %s, %s, %s)",
                (NumLista, Genero, Grupo, IDMaestro),
            )
            connection.commit()
            return {"message": "Alumno agregado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/pregunta/agregar")  # Agrega una pregunta a la base de datos
async def agregar_pregunta(
    Texto: str = Form(...),
    Respuesta: str = Form(...),
    NumNivel: int = 1,
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Pregunta (Texto, Respuesta, NumNivel) VALUES (%s, %s, %s)",
                (Texto, Respuesta, NumNivel),
            )
            connection.commit()
            return {"message": "Pregunta agregada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


## ACTUALIZAR
@app.put(
    "/actualizar_pregunta/{IDPregunta}"
)  # Actualiza una pregunta de la base de datos
async def actualizar_pregunta(
    IDPregunta: int,
    Texto: str = Form(...),
    Respuesta: str = Form(...),
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE Pregunta SET Texto = %s, Respuesta = %s WHERE IDPregunta = %s",
                (Texto, Respuesta, IDPregunta),
            )
            connection.commit()
            return {"message": "Pregunta actualizada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### FIN DEL CRUD


@app.post("/sesion/nivel")  # Recibe un form desde Unity, con los datos ya formateados
async def sesion_nivel(
    IDAlumno: int = Form(...),
    NumNivel: int = Form(...),
    Aciertos: int = Form(...),
    Errores: int = Form(...),
    Tiempo: str = Form(...),
    Completado: bool = Form(...),
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            # para la fecha, se usa la fecha actual del sistema
            fecha = datetime.now()
            cursor.execute(
                "INSERT INTO SesionNivel (IDAlumno, NumNivel, Aciertos, Errores, Tiempo, Fecha, Completado) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (
                    IDAlumno,
                    NumNivel,
                    Aciertos,
                    Errores,
                    Tiempo,
                    fecha,
                    Completado,
                ),
            )
            connection.commit()
            return {"Insertado": True}
    except Exception as e:
        print("Error: ", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/tops/grupo/{grupo}"
)  # Top 5 de alumnos por grupo, ordenados por aciertos y tiempo
async def top_grupo(grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            # Se buscan a los alumnos con la mayor cantidad de aciertos con el menor tiempo
            cursor.execute(
                """SELECT Alumno.NumLista, Alumno.Genero
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno 
                WHERE Alumno.Grupo = %s
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC
                LIMIT 5""",
                (grupo,),
            )
            result = cursor.fetchall()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/top/global")
async def top_global():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT Alumno.NumLista, Alumno.Genero, Alumno.Grupo
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno 
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC
                """
            )
            result = cursor.fetchone()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/top/global/mujer")
async def top_global_mujer():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT Alumno.NumLista, Alumno.Grupo
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno
                WHERE Alumno.Genero = 'M'
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC
                """
            )
            result = cursor.fetchone()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/top/global/hombre")
async def top_global_hombre():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT Alumno.NumLista, Alumno.Grupo
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno
                WHERE Alumno.Genero = 'H'
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC
                """
            )
            result = cursor.fetchone()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/tops/grupo/mujeres/{grupo}"
)  # Top 5 de mujeres por grupo, ordenadas por aciertos y tiempo
async def top_grupo_mujeres(grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT Alumno.NumLista
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno 
                WHERE Alumno.Grupo = %s AND Alumno.Genero = 'M' 
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC 
                LIMIT 5""",
                (grupo,),
            )
            result = cursor.fetchall()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/tops/grupo/hombres/{grupo}"
)  # Top 5 de hombres por grupo, ordenados por aciertos y tiempo
async def top_grupo_hombres(grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT Alumno.NumLista
                FROM SesionNivel 
                JOIN Alumno ON SesionNivel.IDAlumno = Alumno.IDAlumno 
                WHERE Alumno.Grupo = %s AND Alumno.Genero = 'H' 
                GROUP BY Alumno.IDAlumno, Alumno.NumLista, Alumno.Genero
                ORDER BY MAX(SesionNivel.Aciertos) DESC, MIN(SesionNivel.Tiempo) ASC 
                LIMIT 5""",
                (grupo,),
            )
            result = cursor.fetchall()
            if result:
                return result
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/nivel/{num_nivel}"
)  # Regresa la informacion del nivel, la cual se muestra en el menu de pausa de Unity
async def obtener_nivel(num_nivel: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT NumNivel, NumPreguntas, Descripcion FROM Nivel WHERE NumNivel = %s",
                (num_nivel,),
            )
            result = cursor.fetchone()
            if result:
                return {
                    "NumNivel": result["NumNivel"],
                    "NumPreguntas": result["NumPreguntas"],
                    "Descripcion": result["Descripcion"],
                }
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/pregunta/nivel1")  # Regresa 3 preguntas aleatorias para usarse en el nivel 1
async def obtener_pregunta_nivel1():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT Texto, Respuesta FROM Pregunta WHERE NumNivel = 1 ORDER BY RAND() LIMIT 3",
            )
            result = cursor.fetchall()
            if result:
                return {"questions": result}
            else:
                return {"questions": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/alumno/ultimasesion"
)  # Regresa la ultima sesion del alumno para regresarlo a ese nivel
async def obtener_ultima_sesion(
    IDAlumno: int = Form(...),
):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = "SELECT NumNivel FROM SesionNivel WHERE IDAlumno = %s AND Completado = 1 ORDER BY NumNivel DESC;"
            cursor.execute(query, (IDAlumno,))
            result = cursor.fetchone()
            if result:
                return {"level": result["NumNivel"]}
            else:
                return {"level": 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/alumno/puntuaciones/{NumNivel}"
)  # Regresa las ultima puntuacion del alumno en un nivel especifico
async def obtener_puntuaciones(IDAlumno: int, NumNivel: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = "SELECT Aciertos, Errores FROM SesionNivel WHERE IDAlumno = %s AND NumNivel = %s AND Completado = 1;"
            cursor.execute(
                query,
                (
                    IDAlumno,
                    NumNivel,
                ),
            )
            result = cursor.fetchone()
            if result:
                return {
                    "puntuaciones": {
                        "Aciertos": result["Aciertos"],
                        "Errores": result["Errores"],
                    }
                }
            else:
                return {"puntuaciones": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/alumno/tiempos/{NumNivel}"
)  # Regresa el tiempo de la ultima sesion del alumno en un nivel especifico
async def obtener_tiempos(IDAlumno: int, NumNivel: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = "SELECT Tiempo FROM SesionNivel WHERE IDAlumno = %s AND NumNivel = %s AND Completado = 1;"
            cursor.execute(
                query,
                (
                    IDAlumno,
                    NumNivel,
                ),
            )
            result = cursor.fetchone()
            if result:
                return {"tiempos": result["Tiempo"]}
            else:
                return {"tiempos": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/fallos/grupo/{grupo}"
)  # Obtiene el total de errores por cada nivel para un grupo
async def fallos_por_grupo(grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = """
            SELECT 
                sn.NumNivel,
                COALESCE(SUM(sn.Errores), 0) AS TotalErrores
            FROM 
                SesionNivel sn
            JOIN 
                Alumno a ON sn.IDAlumno = a.IDAlumno
            WHERE 
                a.Grupo = %s
            GROUP BY 
                sn.NumNivel
            ORDER BY 
                sn.NumNivel
            """
            cursor.execute(query, (grupo,))
            results = cursor.fetchall()
            if results:
                return results
            else:
                return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/porcentaje/avance/grupal/{grupo}"
)  # Calcula el porcentaje de avance de un grupo
async def porcentaje_avance(grupo: str):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            """
            El avance se calcula como el promedio de los porcentajes de avance de cada alumno en el grupo
            El porcentaje se toma como el número máximo de niveles alcanzados por el alumno dividido entre el número total de niveles
            Si el alumno no tiene ninguna sesion se usa COALESCE para que el porcentaje sea 0
            """
            query = """
            SELECT AVG(PorcentajeAvance) AS PromedioAvanceGrupo
            FROM (
            SELECT 
                a.IDAlumno,
                COALESCE((MAX(sn.NumNivel) * 100.0 / (SELECT MAX(NumNivel) FROM Nivel)), 0) AS PorcentajeAvance
            FROM 
                Alumno a
            LEFT JOIN 
                SesionNivel sn ON a.IDAlumno = sn.IDAlumno
            WHERE 
                a.Grupo = %s
            GROUP BY 
                a.IDAlumno
            ) AS AvanceAlumnos;
            """
            cursor.execute(query, (grupo,))
            result = cursor.fetchone()
            if result:
                return result
            else:
                return 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == ("__main__"):
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
