import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker,Textarea} from '@heroui/react'
import {parseDate, parseAbsolute, getLocalTimeZone, today, now} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

dayjs.extend(timezone);

const URI = "http://localhost:4000/announcement/";

function UpdatedAnnouncement() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [teacher_id, setTeacher_id] = useState("");
  const [class_id, setClass_id] = useState("");
  
  const [file, setfile] = useState(null)

  // const [date, setDate] = useState(''); // Inicializa con la fecha local
  const [dateT, setDate] = useState(today()); // Inicializa con la fecha local
  let formatter = useDateFormatter({dateStyle: "full"});

  const { id } = useParams();
  const navigate = useNavigate();

  const handleDateChange = (e) => {
    setDate(e.target.value); // Actualiza el estado directamente con el valor del input
  };


  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        setDate(dateT.toString())
        formData.append("date", dateT.toString()); // Convierte a UTC
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
    setDate(parseAbsolute(res.data.date));
    setfile(res.data.file)
  };

  return (
    <div className='flex justify-center gap-1'>
    <div className='w-[60%] p-10 rounded-md flex'>
      <Card className='bg-primary-300 w-full'>
        <CardHeader className='bg-primary-900'>
          <h1 className='font-bold text-white text-center text-3xl'>Anuncios</h1>

        </CardHeader>
        <form onSubmit={update}>
          <CardBody>
            <Input
            type='text'
            label="Titulo"
            placeholder='Digita el titulo ... '
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            classNames={{
              label: "text-white/90",
              mainWrapper:"",
              inputWrapper:[
                "bg-primary-500 text-primary-900",
                "hover:bg-primary-500/70",
                "group-data-[focus=true]:bg-primary-900/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
              ],
              innerWrapper:"bg-transparent",
              input:[
                "bg-transparent",
                "text-primary-700/90 ",
                "placeholder:text-primary-700/90 ",
              ],
            }}
            className='mb-2'
            />

          <Textarea
            type='text'
            label="Reumen"
            placeholder='Digita el contenido ... '
            value={content}
            onChange={(e) => setContent(e.target.value)}
            classNames={{
              label: "text-white/90",
              mainWrapper:"",
              inputWrapper:[
                "bg-primary-500 text-primary-900",
                "hover:bg-primary-500/70",
                "group-data-[focus=true]:bg-primary-900/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
              ],
              innerWrapper:"bg-transparent",
              input:[
                "bg-transparent",
                "text-primary-700/90 ",
                "placeholder:text-primary-700/90 ",
              ],
            }}
            className='mb-2'
            />

            <div className='w-full flex flex-col items-end'>
              <DatePicker
              name='dateOfBirth'
              label='Fecha de nacimiento'
              labelPlacement='inside'
              hideTimeZone
              showMonthAndYearPickers
              value={dateT}
              onChange={setDate}
              variant='underlined'
              className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
              
              />
              <p className="text-default-500 text-sm">
                {dateT ? formatter.format(dateT.toDate(getLocalTimeZone())) : "--"}
              </p>
              
            </div>
            <Input
            label="File"
            htmlFor='file'
            type='file'
            id="file"
            onChange={(e) => setfile(e.target.files[0])}
            classNames={{
              label: "text-white/90",
              mainWrapper:"",
              inputWrapper:[
                "bg-primary-500 text-primary-900",
                "hover:bg-primary-500/70",
                "group-data-[focus=true]:bg-primary-900/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
              ],
              innerWrapper:"bg-transparent",
              input:[
                "bg-transparent",
                "text-primary-700/90 ",
                "placeholder:text-primary-700/90 ",
              ],
            }}
            className='my-2'
            />

          </CardBody>
          <CardFooter>
            <Button 
              variant='bordered'
              className='bg-primary-900/70 border-primary-900 px-10
              hover:bg-primary-600/70 hover:border-primary-600 hover:text-white hover:duration-500' 
              type='submit'
              >
                Guardar
            </Button>
        </CardFooter>

        </form>
      </Card>

    </div>
  </div>
    // <div className="flex justify-center">
    //   <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex">
    //     <form onSubmit={update}>
    //       <h1 className="font-bold text-white text-3xl text-center">
    //         Actualizar
    //       </h1>

    //       {/* Mostrar la imagen si existe */}
    //       {file && (
    //             <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
    //           )}

    //       <label className="text-white text-1xl font-semibold">Titulo</label>
    //       <input
    //         type="text"
    //         placeholder="Titulo"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         className="w-full px-4 py-2 rounded-md my-2"
    //         autoFocus
    //       ></input>

    //       <label className="text-white text-1xl font-semibold">Resumen</label>
    //       <textarea
    //         rows="3"
    //         placeholder="Contenido"
    //         value={content}
    //         onChange={(e) => setContent(e.target.value)}
    //         className="w-full px-4 py-2 rounded-md my-2"
    //       ></textarea>

          

    //       <label className="text-white text-1xl font-semibold">
    //         Fecha y hora
    //       </label>
    //       <input
    //         type='date'
    //         value={date}
    //         onChange={(e) => setDate(e.target.value)} // Asegúrate de actualizar el valor de `date`
    //         className="px-1 py-1 rounded-md my-2 mx-3"
    //       />

    //       <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
    //       <input type="file" id="file" onChange={(e) => setfile(e.target.files[0])} />

    //       <button className="bg-green-600 rounded-md w-20 mx-32" type="submit">
    //         Guardar
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}

export default UpdatedAnnouncement;
