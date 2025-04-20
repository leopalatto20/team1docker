import axios from 'axios';

/*Se reciben los parametros de entrada del usuario, se hace un post con esos datos 
 * y se regresa el resultado, el cual se evalua en private routes*/
export const maestroLogin = async (correo: string, grupo: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/maestro/login', {
      Correo: correo,
      Grupo: grupo,
    });
    return response.data;
  }
  catch (error) {
    console.error('Error en el login: ', error);
    return { Valido: false };
  }
}
