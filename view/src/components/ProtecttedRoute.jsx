import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  const token = localStorage.getItem('token');
  return !!token; // Retorna true si existe el token
};
const getUserRole = () => {
  return localStorage.getItem('role'); // Obtiene el rol del usuario desde localStorage
};

const ProtecttedRoute = ({ allowedRoles }) => {

  const isAuth = useAuth();
  const userRole = getUserRole();

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  // Si el rol del usuario no está permitido, también redirige
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />; // Permite el acceso a la ruta

}

export default ProtecttedRoute
