import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef  } from "react";
import { AuthContext } from "./AuthContext";
import Dashboard from "./Dashboard";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const id = localStorage.getItem("id");

  // Alternar los menús desplegables según el rol
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to="/Home">
        <h1 className="text-2xl font-bold text-white">Inicio</h1>
      </Link>

      <ul className="flex gap-x-4" ref={dropdownRef}>
        {isLoggedIn ? (
          <>
            <li className="text-white">
              <Link to={`/Profile/${id}`}>{`${name}`}</Link>
            </li>

            {/*ADMINS */}
            {role === "admin" && (
              <>
              {/* Menú Clases */}
              <div className="relative">
                  <button
                    onClick={() => toggleDropdown("clases")}
                    className="text-white bg-green-500 px-3 py-1 rounded-md"
                  >
                    Clases
                  </button>
                  {openDropdown === "clases" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">


                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateClass"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Clase
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateStudentClass"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Añadir Estudiantes 
                          </Link>
                        </li>


                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowClass"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Clases
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Menú Materias */}
              <div className="relative">
                  <button
                    onClick={() => toggleDropdown("materias")}
                    className="text-white bg-sky-900 px-3 py-1 rounded-md"
                  >
                    Materias
                  </button>
                  {openDropdown === "materias" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">


                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateSubject"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Materia
                          </Link>
                        </li>


                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowSubjects"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Materias
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Menú Profesores */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("profesores")}
                    className="text-white bg-blue-500 px-3 py-1 rounded-md"
                  >
                    Profesores
                  </button>
                  {openDropdown === "profesores" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateTeacher"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Profesor
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowTeachers"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Profesores
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                

                {/* Menú Alumnos */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("Alumnos")}
                    className="text-white bg-yellow-500 px-3 py-1 rounded-md"
                  >
                    Alumnos
                  </button>
                  {openDropdown === "Alumnos" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateStudent"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Alumno
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowStudents"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Alumnos
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Menú Tutores */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("Tutores")}
                    className="text-white bg-purple-500 px-3 py-1 rounded-md"
                  >
                    Tutores
                  </button>
                  {openDropdown === "Tutores" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateGuardian"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Tutor
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowGuardians"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Tutores
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Menú Admins */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("Admin")}
                    className="text-white bg-orange-500 px-3 py-1 rounded-md"
                  >
                    Administradores
                  </button>
                  {openDropdown === "Admin" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateAdmins"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Admin
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowAdmins"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Admins
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Menú Anuncios */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("Anuncios")}
                    className="text-white bg-pink-500 px-3 py-1 rounded-md"
                  >
                    Anuncios
                  </button>
                  {openDropdown === "Anuncios" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/CreateAnnouncements"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Crear Anuncio
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowAnnouncements"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Anuncios
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {/*PROFES */}
            {role === "teacher" && (
              <>
                {/* Menú Clases */}
              <div className="relative">
                  <button
                    onClick={() => toggleDropdown("clases")}
                    className="text-white bg-green-500 px-3 py-1 rounded-md"
                  >
                    Clases
                  </button>
                  {openDropdown === "clases" && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                      <ul className="py-1">


                        <li>
                          <Link
                            className="text-black block px-4 py-2"
                            to="/ShowClass"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Ver Clases
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

              </>
            )}

            {/*ALUMNOS*/}
            {role === "student" && (
              <>
              <div className="relative">
              <button
                onClick={() => toggleDropdown("clases")}
                className="text-white bg-green-500 px-3 py-1 rounded-md"
              >
                Clases
              </button>
              {openDropdown === "clases" && (
                <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                  <ul className="py-1">
                    <li>
                      <Link
                        className="text-black block px-4 py-2"
                        to="/ShowClass"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Ver Clases
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button className="text-white bg-blue-800 px-3 py-1 rounded-md">
              <Link to={`/Dashboard/${id}`}> Dashboard</Link>
              </button>
            </div>

            </>
            

            

            )}
            

            {/*TUTORES */}
            {role === "guardian" && (
              <>
                <li>
                  <Link className="text-white" to={`/GuardianStudent/${id}`}>
                    Ver Hijos
                  </Link>
                </li>
                <li>
                  <Link className="text-white" to="/ShowTasks">
                    Ver Tareas
                  </Link>
                </li>
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
            <Link className="text-white" to="/">
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;