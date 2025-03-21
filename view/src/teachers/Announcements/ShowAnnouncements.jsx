import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Tooltip
} from "@heroui/react";

import {Trash2, UserPen, Eye} from 'lucide-react'

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
      <Button 
                variant='shadow'
                className='mt-1 ml-2 bg-primary-500 text-primary-700
                hover:bg-primary-600 hover:text-primary-300 hover:duration-500
                '>Crear Anuncio
      </Button>
      </Link>
      <div className="w-full mt-2 ">
        <div className=" w-10/12 mx-auto">
          <Table
          aria-label="Announcements table"
          classNames={{
            wrapper :[
                "bg-primary-300 text-primary-700"
            ],
            th:["bg-primary-500", "text-primary-600"],
            tr:[
                "hover:bg-primary-500/50 hover:rounded-2xl"
            ],
            td:[
                ""
            ]
            
        }}
          >
            <TableHeader>
              <TableColumn>Titulo</TableColumn>
              <TableColumn>Contenido</TableColumn>
              <TableColumn align="center">Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) =>(
                <TableRow key={announcement.id}>
                  <TableCell>{announcement.title}</TableCell>
                  <TableCell>{announcement.content}</TableCell>
                  <TableCell>
                    <div className="relative flex justify-center items-center gap-4 ">
                    <Tooltip content="Mostrar anuncio">
                        <Link to={`/AnnouncementCard/${announcement.id}`}>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <Eye className='hover:text-secondary-500 hover:duration-300' />
                            </span>
                        </Link>
                    </Tooltip>
                    <Tooltip content="editar anuncio">
                        <Link to={`/UpdatedAnnouncement/${announcement.id}`}>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <UserPen className='hover:text-auxColors-350 hover:duration-300' />
                            </span>
                        </Link>
                    </Tooltip>
                    <Tooltip content="eliminar anuncio">
                            <span 
                            onClick={() => {
                              deleteAnnouncement(announcement.id);
                            }}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <Trash2 className='hover:text-red-500 hover:duration-300' />
                            </span>
                        
                    </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>

      </div>
      
      {/* <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[50%]">
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
      </div> */}
    </>
  );
}

export default ShowAnnouncements;
