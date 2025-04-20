import React, { useEffect, useState } from "react";
import Student from "../components/Student";
import Question from "../components/Question";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "./../assets/Escudo.png";

interface Alumno {
  IDAlumno: number;
  NumLista: number;
  Genero: string;
  Grupo: string;
}

interface Preguntas {
  IDPregunta: number;
  Texto: string;
  Respuesta: string;
}

const Admin: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [preguntas, setPreguntas] = useState<Preguntas[]>([]);
  const [mostrandoFormularioAlumno, setMostrandoFormularioAlumno] = useState(false);
  const [mostrandoFormularioPregunta, setMostrandoFormularioPregunta] = useState(false);

  const [nuevoAlumno, setNuevoAlumno] = useState({ NumLista: 0, Genero: "", Grupo: "" });
  const [nuevaPregunta, setNuevaPregunta] = useState({ Texto: "", Respuesta: "" });

  const fetchAlumnos = async () => {
    try {
      const IDMaestro = localStorage.getItem("IDMaestro");
      if (!IDMaestro) {
        console.error("No se encontró el ID del maestro en localStorage.");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/get_alumnos/${IDMaestro}`
      );
      const data = await response.json();
      setAlumnos(data);
    } catch (err) {
      console.error("Error al obtener la información de los alumnos:", err);
    }
  };

  const deleteAlumno = async (IDAlumno: number) => {
    try {
      await axios.delete(`http://localhost:8000/delete_alumno/${IDAlumno}`);
      setAlumnos((prevAlumnos) =>
        prevAlumnos.filter((alumno) => alumno.IDAlumno !== IDAlumno)
      );
      console.log(`Alumno con ID ${IDAlumno} eliminado.`);
    } catch (err) {
      console.error("Error al eliminar el alumno:", err);
    }
  };

  const agregarAlumno = async () => {
    const IDMaestro = localStorage.getItem("IDMaestro");
    const Grupo = localStorage.getItem("Grupo");
  
    // Validación
    if (
      !nuevoAlumno.NumLista ||
      !nuevoAlumno.Genero ||
      !Grupo ||
      !IDMaestro
    ) {
      alert("Por favor completa todos los campos para agregar un alumno.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("NumLista", nuevoAlumno.NumLista.toString());
      formData.append("Genero", nuevoAlumno.Genero);
      formData.append("Grupo", Grupo);
      formData.append("IDMaestro", IDMaestro);
  
      await axios.post("http://localhost:8000/alumno/agregar", formData);
      fetchAlumnos();
      setMostrandoFormularioAlumno(false);
    } catch (err) {
      console.error("Error al agregar alumno:", err);
    }
  };
  

  const fetchPreguntas = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/preguntas_completas/nivel1"
      );
      const data = await response.json();
      setPreguntas(data.questions);
    } catch (err) {
      console.error("Error al obtener la información de las preguntas:", err);
    }
  };

  const deletePregunta = async (IDPregunta: number) => {
    console.log("PRegunta eliminar: ", IDPregunta);
    try {
      await axios.delete(`http://localhost:8000/borrar_pregunta/${IDPregunta}`)
      setPreguntas((prevPreguntas) =>
        prevPreguntas.filter((pregunta) => pregunta.IDPregunta !== IDPregunta)
      );
      console.log(`Pregunta con ID ${IDPregunta} eliminado`);
    } catch (err) {
      console.error("Error al obtener la informacion de las preguntas", err);
    }
  };

  const editPregunta = async (IDPregunta: number, nuevoTexto: string, nuevaRespuesta: string) => {
    try {
      const formData = new FormData();
      formData.append("Texto", nuevoTexto);
      formData.append("Respuesta", nuevaRespuesta);

      await axios.put(
        `http://localhost:8000/actualizar_pregunta/${IDPregunta}`,
        formData
      );

      setPreguntas((prevPreguntas) =>
        prevPreguntas.map((p) =>
          p.IDPregunta === IDPregunta
            ? { ...p, Texto: nuevoTexto, Respuesta: nuevaRespuesta }
            : p
        )
      );
      console.log("Pregunta actualizada");
    } catch (err) {
      console.error("Error al actualizar la pregunta:", err);
    }
  };

  const agregarPregunta = async () => {
    // Validación
    if (
      !nuevaPregunta.Texto.trim() ||
      nuevaPregunta.Respuesta === ""
    ) {
      alert("Por favor completa el texto y la respuesta de la pregunta.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("Texto", nuevaPregunta.Texto);
      formData.append("Respuesta", nuevaPregunta.Respuesta);
  
      await axios.post("http://localhost:8000/pregunta/agregar", formData);
      fetchPreguntas();
      setMostrandoFormularioPregunta(false);
    } catch (err) {
      console.error("Error al agregar pregunta:", err);
    }
  };
  

  const eliminarSesiones = async () => {
    const Grupo = localStorage.getItem('Grupo');
    try {
      await axios.delete(`http://localhost:8000/delete_sesiones/${Grupo}`);
      console.log("Sesiones eliminadas");
    }
    catch (err) {
      console.error("Error al eliminar sesiones:", err);
    }
  };

  const handleAlertEliminarSesiones = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar TODAS las sesiones?")) {
      eliminarSesiones();
    }
  }

  const navigate = useNavigate();
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    fetchAlumnos();
    fetchPreguntas();
  }, []);

  return (
    <div className="bg-gray-100 font-serif min-h-screen flex flex-col">
      <header className="bg-azulInstitucional text-white p-6">
        <div className="px-4 sm:px-6 flex items-center justify-between">
          <img className="h-16" src={Logo} />

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-lg font-bold">Admin</div>
            <button
              type="button"
              className="rounded-lg p-3 bg-verdeInstitucional hover:bg-verdeInstitucionalDark cursor-pointer duration-300 hover:scale-110"
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 p-4 bg-gray-100">
        <div id="alumnos" className="p-4 bg-gray-100">
          <div className="grid-rows-2 rounded-lg gap-4 bg-azulInstitucional text-white text-2x justify-center items-center">
            <div className="row-auto p-4 text-white text-2xl font-bold text-center">
              Alumnos
            </div>

            <div className="row-auto p-4 text-white md:text-xl text-sm text-center">
              Número de Lista | Grupo | Género
            </div>
          </div>


          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-4 bg-gray-100">
            {alumnos.map((alumno) => (
              <Student
                key={alumno.IDAlumno}
                listNum={alumno.NumLista}
                group={alumno.Grupo}
                gender={alumno.Genero}
                onDeleteButton={() => deleteAlumno(alumno.IDAlumno)}
              />
            ))}
          </div>
          {mostrandoFormularioAlumno && (
            <div className="bg-white shadow-md rounded-lg p-4 my-4 border border-blue-300">
              <input
                type="number"
                placeholder="Número de lista"
                value={nuevoAlumno.NumLista}
                onChange={(e) =>
                  setNuevoAlumno({ ...nuevoAlumno, NumLista: parseInt(e.target.value) })
                }
                className="border rounded p-2 mb-2 w-full"
              />

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Género:</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Genero"
                      value="H"
                      checked={nuevoAlumno.Genero === "H"}
                      onChange={(e) =>
                        setNuevoAlumno({ ...nuevoAlumno, Genero: e.target.value })
                      }
                      className="mr-2"
                    />
                    Hombre (H)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Genero"
                      value="M"
                      checked={nuevoAlumno.Genero === "M"}
                      onChange={(e) =>
                        setNuevoAlumno({ ...nuevoAlumno, Genero: e.target.value })
                      }
                      className="mr-2"
                    />
                    Mujer (M)
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={agregarAlumno}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrandoFormularioAlumno(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="row-auto text-white text-xl text-center">
            <button
              onClick={() => setMostrandoFormularioAlumno(true)}
              className="bg-blue-300 text-white py-2 rounded-lg hover:bg-azulInstitucional w-full">
              Agregar alumno
            </button>
          </div>
        </div>

        <div id="segunda-columna" className="p-4 bg-gray-100">
          <div className="grid-rows-2 rounded-lg gap-4 bg-azulInstitucional text-white text-2x justify-center items-center">
            <div className="row-auto p-4 text-white text-2xl font-bold text-center">
              Preguntas nivel 1
            </div>

            <div className="row-auto p-4 text-white text-xl text-center">
              Pregunta | Respuesta
            </div>
          </div>


          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-4 bg-gray-100">
            {preguntas.map((pregunta) => (
              <Question
                key={pregunta.IDPregunta}
                texto_pregunta={pregunta.Texto}
                respuesta={pregunta.Respuesta}
                onDeleteButton={() => deletePregunta(pregunta.IDPregunta)}
                onEditButton={(nuevoTexto, nuevaRespuesta) =>
                  editPregunta(pregunta.IDPregunta, nuevoTexto, nuevaRespuesta)
                }
              />
            ))}
          </div>
          {mostrandoFormularioPregunta && (
            <div className="bg-white shadow-md rounded-lg p-4 my-4 border border-blue-300">
              <input
                type="text"
                placeholder="Texto de la pregunta"
                value={nuevaPregunta.Texto}
                onChange={(e) =>
                  setNuevaPregunta({ ...nuevaPregunta, Texto: e.target.value })
                }
                className="border rounded p-2 mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Respuesta"
                value={nuevaPregunta.Respuesta}
                onChange={(e) =>
                  setNuevaPregunta({ ...nuevaPregunta, Respuesta: e.target.value })
                }
                className="border rounded p-2 mb-2 w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={agregarPregunta}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrandoFormularioPregunta(false)}
                  className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          <div className="row-auto text-white text-xl text-center">
            <button
              onClick={() => setMostrandoFormularioPregunta(true)}
              className="bg-blue-300 text-white py-2 rounded-lg hover:bg-azulInstitucional w-full">
              Agregar pregunta
            </button>
          </div>
        </div>
      </div>

      <div className="row-auto text-white text-xl text-center">
        <button
          onClick={handleAlertEliminarSesiones}
          className="bg-red-400 text-white py-5 px-9 rounded-lg hover:bg-red-600">
          Eliminar todas las sesiones
        </button>
      </div>
    </div>
  );
};

export default Admin;
