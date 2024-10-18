import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";

import { AuthContext } from './AuthContext';

function Navbar() {
  

  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cerrar sesión
    navigate('/'); // Redirigir al login
  };

  const role = localStorage.getItem('role'); // Obtener el rol del usuario
  const name = localStorage.getItem('name'); // Obtener el nombre del usuario
  const id = localStorage.getItem('id'); // Obtener el nombre del usuario



  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to="/Home">
        <h1 className="text-2xl font-bold text-white">Inicio</h1>
      </Link>

      <ul className="flex gap-x-4">
        {isLoggedIn ? (
          <>

          <li className="text-white" >
            <Link to={`/Profile/${id}`}>{`${name}, ${id}` }</Link>
            
          </li>
            {role === 'admin' && (
              <>
                <li>
                  <Link className="text-white" to="/CreateTeacher">Crear Profesor</Link>
                  
                </li>
                <li>
                  <Link className="text-white" to="/ShowTeachers">Ver Profesores</Link>
                </li>
                {/* Agrega más enlaces para Administradores */}
              </>
            )}

            {role === 'teacher' && (
              <>
                <li>
                  <Link className="text-white" to="/CreateTask">Crear Tarea</Link>
                </li>
                <li>
                  <Link className="text-white" to="/ShowTasks">Ver Tareas</Link>
                </li>
                {/* Agrega más enlaces para Profesores */}
              </>
            )}

            {role === 'student' && (
              <>
                <li>
                  <Link className="text-white" to="/student/up-task">Subir Tarea</Link>
                </li>
                <li>
                  <Link className="text-white" to="/ShowTasks">Ver Tareas Subidas</Link>
                </li>
                {/* Agrega más enlaces para Estudiantes */}
              </>
            )}

            {role === 'guardian' && (
              <>
                <li>
                  <Link className="text-white" to="/ShowStudents">Ver Hijos</Link>
                </li>
                {/* Agrega más enlaces para Tutores */}
              </>
            )}

            <li>
              <button
                className="text-white bg-red-500 px-3 py-1 rounded-md"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link className="text-white" to="/">Iniciar sesión</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar
