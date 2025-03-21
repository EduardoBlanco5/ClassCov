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
    <div className="w-full bg-primary-200  ">

      <Navbar  onMenuOpenChange={setIsMenuOpen} maxWidth="full" id="navBar" className=" bg-transparent   py-3 ">
        <NavbarContent justify="start"  className=" w-[100px]">
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

        <NavbarContent justify="center" className=" px-14 w-full">

          <ul className="flex w-full  " ref={dropdownRef}>
            {isLoggedIn ? (
              <div className=" flex justify-between  w-full">
                <li className=" flex items-center mr-12 text-xl text-secondary-50 border-b border-secondary-50">
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
                        className=" border-primary-400 text-primary-400 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
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
                    <Button 
                          variant="bordered"
                          onPressEnd={() => toggleDropdown("profesores")}
                          className=" border-secondary-600 text-secondary-600 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                        >
                          Profesores
                      </Button>
                      {openDropdown === "profesores" && (
                        <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                        isBlurred>
                          <CardHeader className=" relative justify-between ">
                              <li>
                                <Link
                                  className="  px-4  w-full "
                                  to="/CreateTeacher"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button 
                                  // color="secondary" 
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >

                                    Crear profesor
                                  </Button>
                                </Link>
                              </li>
                          </CardHeader>
                          <Divider/>
                          <CardBody>
                              <li>
                                
                                <Link
                                  className="px-4  w-full "
                                  to="/ShowTeachers"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >
                                    Ver profesores 
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
                        //         to="/CreateTeacher"
                        //         onClick={() => setOpenDropdown(null)}
                        //       >
                        //         Crear Profesor
                        //       </Link>
                        //     </li>
                        //     <li>
                        //       <Link
                        //         className="text-black block px-4 py-2"
                        //         to="/ShowTeachers"
                        //         onClick={() => setOpenDropdown(null)}
                        //       >
                        //         Ver Profesores
                        //       </Link>
                        //     </li>
                        //   </ul>
                        // </div>
                      )}
                    </div>

                    

                    {/* Menú Alumnos */}
                    <div className="relative">
                      <Button 
                          variant="bordered"
                          onPressEnd={() => toggleDropdown("Alumnos")}
                          className=" border-auxColors-300/80 text-auxColors-300/80 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                        >
                          Alumnos
                      </Button>
                      
                      {openDropdown === "Alumnos" && (
                        <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                        isBlurred>
                          <CardHeader className=" relative justify-between ">
                              <li>
                                <Link
                                  className="  px-4  w-full "
                                  to="/CreateStudent"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button 
                                  // color="secondary" 
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >

                                    Crear Alumno
                                  </Button>
                                </Link>
                              </li>
                          </CardHeader>
                          <Divider/>
                          <CardBody>
                              <li>
                                
                                <Link
                                  className="px-4  w-full "
                                  to="/ShowStudents"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >
                                    Ver alumnos 
                                  </Button>
                                </Link>
                              </li>
                          </CardBody>
                          
                        </Card>
                        
                      )}
                    </div>

                    {/* Menú Tutores */}
                    <div className="relative">
                    <Button 
                          variant="bordered"
                          onPressEnd={() => toggleDropdown("Tutores")}
                          className=" border-auxColors-550 text-auxColors-550 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                        >
                          Tutores
                      </Button>
                      
                      {openDropdown === "Tutores" && (
                        <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                        isBlurred>
                          <CardHeader className=" relative justify-between ">
                              <li>
                                <Link
                                  className="  px-2  w-full "
                                  to="/CreateGuardian"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button 
                                  // color="secondary" 
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >

                                    Crear Tutor
                                  </Button>
                                </Link>
                              </li>
                          </CardHeader>
                          <Divider/>
                          <CardBody>
                              <li>
                                
                                <Link
                                  className=" px-2  w-full "
                                  to="/ShowGuardians"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >
                                    Ver tutores 
                                  </Button>
                                </Link>
                              </li>
                          </CardBody>
                          
                        </Card>
                        
                      )}
                    </div>

                    {/* Menú Admins */}
                    <div className="relative">
                    <Button 
                          variant="bordered"
                          onPressEnd={() => toggleDropdown("Admin")}
                          className=" border-auxColors-350 text-auxColors-350 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                        >
                          Administradores
                      </Button>
                      
                      {openDropdown === "Admin" && (
                        <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                        isBlurred>
                          <CardHeader className=" relative justify-between ">
                              <li>
                                <Link
                                  className="  px-4  w-full "
                                  to="/CreateAdmins"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button 
                                  // color="secondary" 
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >

                                    Crear Administrador
                                  </Button>
                                </Link>
                              </li>
                          </CardHeader>
                          <Divider/>
                          <CardBody>
                              <li>
                                
                                <Link
                                  className="px-4  w-full "
                                  to="/ShowAdmins"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >
                                    Ver Administradores 
                                  </Button>
                                </Link>
                              </li>
                          </CardBody>
                          
                        </Card>
                        
                      )}
                    </div>

                    {/* Menú Anuncios */}
                    <div className="relative">
                      <Button 
                            variant="bordered"
                            onPressEnd={() => toggleDropdown("Anuncios")}
                            className=" border-auxColors-250 text-auxColors-250 text-md hover:text-primary-300 hover:border-primary-300 hover:duration-500"
                          >
                            Anuncios
                      </Button>
                      
                      {openDropdown === "Anuncios" && (
                        <Card className=" absolute header right-0 mt-2 w-auto border-none border-transparent bg-white/70  " 
                        isBlurred>
                          
                          
                          <Divider/>
                          <CardBody>
                              <li>
                                
                                <Link
                                  className="px-4  w-full "
                                  to="/ShowAnnouncements"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <Button
                                  className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                                  >
                                    Ver Anuncios 
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
                        //         to="/CreateAnnouncements"
                        //         onClick={() => setOpenDropdown(null)}
                        //       >
                        //         Crear Anuncio
                        //       </Link>
                        //     </li>
                        //     <li>
                        //       <Link
                        //         className="text-black block px-4 py-2"
                        //         to="/ShowAnnouncements"
                        //         onClick={() => setOpenDropdown(null)}
                        //       >
                        //         Ver Anuncios
                        //       </Link>
                        //     </li>
                        //   </ul>
                        // </div>
                      )}
                    </div>
                  </>
                )}

                {/*                roles               */}

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
                              className="  px-2  w-full "
                              to="/ShowClass"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Button 
                              // color="secondary" 
                              className="text-md text-primary-200 bg-transparent hover:bg-primary-900 hover:text-primary-300 hover:duration-500 "
                              >

                                Ver Clases
                              </Button>
                            </Link>
                          </li>
                      </CardHeader>
                    </Card>
                    
                  )}
                </div>
                )}

                {/*TUTORES */}
                {role === "guardian" && (
                  <>
                    <li>
                      <Link className="text-white" to={`/StudentsGuardian/${id}`}>
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

              </div>
            ) : (
              <li>
                <Link className="text-white" to="/">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </NavbarContent>
        
        <NavbarContent justify="end">
              {/* cerrar sesion */}
              <li>
                  <Button
                    className="text-white bg-red-500 px-3 py-1 rounded-md"
                    onPressEnd={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </li>
        </NavbarContent>
        

      </Navbar>
    </div>
  );
}






export default NavBar;