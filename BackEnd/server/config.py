from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from server.database.initdb import init_db
from server.database.insertdata import insert_data
from server.database.wait_for_sql import wait_for_sql

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando la base de datos")
    wait_for_sql()
    init_db("./server/database/script/setup.sql")
    insert_data(
        "./server/database/data/maestros.json",
        "./server/database/data/niveles.json",
        "./server/database/data/preguntas.json",
    )
    yield
    print("Cerrando la aplicacion")


app = FastAPI(lifespan=lifespan)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
