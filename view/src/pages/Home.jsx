import axios from "axios";
import { useEffect, useState, useContext } from "react";
// import { AuthContext } from './AuthContext' // Asegúrate de importar el contexto correcto.
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ShowTask from "../teachers/Tasks/ShowTask";
import ShowAnnouncements from "../teachers/Announcements/ShowAnnouncements";
import ShowClass from "../administration/Classes/ShowClass";
import dashProfile from "../components/dashProfile";
import { AuthContext } from "../components/AuthContext";

function Home() {
  const URI = "http://localhost:4000/tasks";

  const [tasks, setTask] = useState([]);
  useEffect(() => {
    getTasks();
  }, []);

  //Mostrar Tareas
  const getTasks = async () => {
    const res = await axios.get(URI);
    setTask(res.data);
  };
    // Recuperar rol del usuario desde AuthContext o localStorage
      const { user } = useContext(AuthContext); // Si usas AuthContext
      const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo
      console.log(user)

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-between ">
      {
        role === "student" && (
        <div className=" w-[90%] mx-auto">
          <dashProfile>

          </dashProfile>

        </div>
        )
      }
    </div>
  );
}

export default Home;
