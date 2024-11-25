import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = "http://localhost:4000/announcement/";

function UpdatedAnnouncement() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [teacher_id, setTeacher_id] = useState("");
  const [class_id, setClass_id] = useState("");
  const [date, setDate] = useState("");
  const [file, setfile] = useState(null)

  const { id } = useParams();
  const navigate = useNavigate();


  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        formData.append("date", date);
        formData.append("teacher_id", teacher_id);
        formData.append("class_id", class_id);
 
        if (file) formData.append("file", file); // Agregar la imagen
        try {
          await axios.put(`${URI}${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate("/ShowClass");
        } catch (error) {
          console.error("Error updating Announcement:", error);
        } 
  };

  useEffect(() => {
    getannouncementById();
  }, []);

  const getannouncementById = async () => {
    const res = await axios.get(URI + id);
    setTitle(res.data.title);
    setContent(res.data.content);
    setTeacher_id(res.data.teacher_id);
    setClass_id(res.data.class_id);
    setDate(res.data.date);
    setfile(res.data.file)
  };

  return (
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex">
        <form onSubmit={update}>
          <h1 className="font-bold text-white text-3xl text-center">
            Actualizar
          </h1>

          {/* Mostrar la imagen si existe */}
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}

          <label className="text-white text-1xl font-semibold">Titulo</label>
          <input
            type="text"
            placeholder="Titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md my-2"
            autoFocus
          ></input>

          <label className="text-white text-1xl font-semibold">Resumen</label>
          <textarea
            rows="3"
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-md my-2"
          ></textarea>

          

          <label className="text-white text-1xl font-semibold">
            Fecha y hora
          </label>
          <input
            type="datetime-local"
            placeholder="0000-00-00"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-1 py-1 rounded-md my-2 mx-3"
          ></input>

          <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
          <input type="file" id="file" onChange={(e) => setfile(e.target.files[0])} />

          <button className="bg-green-600 rounded-md w-20 mx-32" type="submit">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatedAnnouncement;
