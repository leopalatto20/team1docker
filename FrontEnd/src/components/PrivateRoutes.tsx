import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRoutesProps {
  isAuthenticated: boolean;
}

/*Si el usuario esta autenticado, lo deja pasar a otras rutas,
 * si no, lo redirige siempre a login*/
const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
