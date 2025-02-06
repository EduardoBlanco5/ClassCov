import {Link,   useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef  } from "react";
import { AuthContext } from "./AuthContext";
import Dashboard from "./Dashboard";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,

  Button,
  Card, CardHeader, CardBody, CardFooter, Divider
} from "@heroui/react";





function NavBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Admin",
    "Clases",
    "Profesores",
    "Alumnos",
    "Tutores",
    "Administradores",
    "Anuncios",
    "Cerra Sesión"
  ];

  const handleLogout = () => {
    logout();
    const hidenav = document.getElementById("navBar").style.display = 'none'
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
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen} id="navBar" className=" bg-primary-200  flex justify-between  py-5 px-10  ">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/Home">
            <Button variant="flat"  className="text-2xl font-bold text-white">Inicio</Button >
          </Link>
        </NavbarBrand>
      </NavbarContent>
      

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
                  <Button 
                    variant="bordered"
                    onPressEnd={() => toggleDropdown("clases")}
                    className=" border-primary-500 text-primary-500 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                  >
                    Clases
                  </Button>
                  {openDropdown === "clases" && (
                    <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                    isBlurred>
                      <CardHeader className=" relative justify-between ">
                          <li>
                            <Link
                              className="  px-4  w-full "
                              to="/CreateClass"
                              onPressEnd={() => setOpenDropdown(null)}
                            >
                              <Button 
                              // color="secondary" 
                              className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                              >

                                Crear Clase
                              </Button>
                            </Link>
                          </li>
                      </CardHeader>
                      <Divider/>
                      <CardBody>
                          <li>
                            <Link
                              className="text-black block "
                              to="/CreateStudentClass"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Button
                              className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                              >
                                Añadir Estudiantes 
                              </Button>
                            </Link>
                          </li>
                      </CardBody>
                      <Divider/>
                      <CardFooter>
                        <li>
                            <Link
                              className="text-black block px-4 "
                              to="/ShowClass"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Button
                                className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500"
                              >
                              Ver Clases
                              </Button>
                            </Link>
                        </li>
                      </CardFooter>
                    </Card>
                    
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
              <Button 
                    variant="bordered"
                    onPressEnd={() => toggleDropdown("clases")}
                    className=" border-primary-500 text-primary-500 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                  >
                    Clases
                  </Button>
                  {/* <button
                    onClick={() => toggleDropdown("clases")}
                    className="text-white bg-green-500 px-3 py-1 rounded-md"
                  >
                    Clases
                  </button> */}
                  {openDropdown === "clases" && (
                    <Card className=" absolute border shadow-none right-0 mt-2 w-auto  bg-white/70  " 
                    isBlurred>
                      
                      <CardBody>
                        <li>
                            <Link
                              className="text-black block px-4 "
                              to="/ShowClass"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Button
                                className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500"
                              >
                              Ver Clases
                              </Button>
                            </Link>
                        </li>
                      </CardBody>
                    </Card>
                    // <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 w-40">
                    //   <ul className="py-1">


                    //     <li>
                    //       <Link
                    //         className="text-black block px-4 py-2"
                    //         to="/ShowClass"
                    //         onClick={() => setOpenDropdown(null)}
                    //       >
                    //         Ver Clases
                    //       </Link>
                    //     </li>
                    //   </ul>
                    // </div>
                  )}
                </div>
              </>
            )}

            {/*ALUMNOS*/}
            {role === "student" && (
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
            )}

            {/*TUTORES */}
            {role === "guardian" && (
              <>
                <li>
                  <Link className="text-white" to="/ShowStudents">
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
    </Navbar>
  );
}






export default NavBar;