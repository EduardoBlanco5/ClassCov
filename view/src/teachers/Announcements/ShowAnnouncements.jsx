import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const URI = "http://localhost:4000/announcements";

const URID = "http://localhost:4000/announcement/"; //URI especifico para eliminar

function ShowAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    getAnnouncements();
  }, []);

  //Mostrar Tareas
  const getAnnouncements = async () => {
    const res = await axios.get(URI);
    if (Array.isArray(res.data)) {
      setAnnouncements(res.data);
    } else {
      setAnnouncements([]);
    }
  };

  //Eliminar Tarea
  const deleteAnnouncement = async (id) => {
    await axios.delete(`${URID}${id}`);
    getAnnouncements();
  };

  if (announcements.length === 0) {
    return (
      <Link to={"/CreateAnnouncements"}>
        <h1>No hay Anuncios</h1>
        <button className="bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3">
          Crear Anuncio
        </button>
      </Link>
    );
  }

  return (
    <>
      <Link to={"/CreateAnnouncements"}>
        <button className="bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3">
          Crear Anuncios
        </button>
      </Link>
      <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[50%]">
        <div className=" max-w-md w-full rounded-md my-2 px-full py-full flex justify-center">
          {announcements.map((announcement) => (
            <tr key={announcement.id}>
              <Link to={`/AnnouncementCard/${announcement.id}`}>
                <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                  <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">
                    {announcement.title}
                  </h1>
                  <div className="w-full px-4 py-2 my-2">
                    <p className="text-black font-semibold">
                      {" "}
                      {announcement.content}
                    </p>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2  rounded-md "
                      onClick={() => {
                        deleteAnnouncement(announcement.id);
                      }}
                    >
                      Eliminar
                    </button>

                    <Link to={`/UpdatedAnnouncement/${announcement.id}`}>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md ">
                        Actualizar
                      </button>
                    </Link>
                  </div>
                </header>
              </Link>
            </tr>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowAnnouncements;
