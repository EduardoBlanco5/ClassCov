import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker,Textarea} from '@heroui/react'
import {parseDate, getLocalTimeZone, today, now} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

dayjs.extend(timezone);

const URI = "http://localhost:4000/announcement";

function CreateAnnouncements() {
  const { register, handleSubmit } = useForm();

  const { class_id } = useParams(); // Obtener el id de la clase desde la URL
  const teacher_id = localStorage.getItem("teacher_id") || "1"; // Asegúrate de guardar este dato al iniciar sesión


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [date, setDate] = useState(''); // Inicializa con la fecha local
  const [date, setDate] = useState(today(getLocalTimeZone())); // Inicializa con la fecha local
  const [file, setFile] = useState(null);
  const [valueDate, setValueDate] = useState(now(getLocalTimeZone()));
  let formatter = useDateFormatter({dateStyle: "full"});

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const create = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    
    formData.append('date', date.toString());

    
    // Agregar el archivo al FormData

    if (file) {
    formData.append('file', file);
    }

    formData.append('teacher_id', teacher_id); // Añade teacher_id
    formData.append('class_id', class_id); // Asegúrate de que `class_id` provenga de `useParams`

    try {
        // Enviar el FormData con una solicitud POST
        await axios.post(URI, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate('/ShowClass')
        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
      navigate(`/ClassCard/${class_id}`)
  };

  return (
    <div className='flex justify-center gap-1'>
      <div className='w-[60%] p-10 rounded-md flex'>
        <Card className='bg-primary-300 w-full'>
          <CardHeader className='bg-primary-900'>
            <h1 className='font-bold text-white text-center text-3xl'>Anuncios</h1>

          </CardHeader>
          <form onSubmit={create}>
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
                label='Fecha de asistencia'
                labelPlacement='inside'
                hideTimeZone
                showMonthAndYearPickers
                value={date}
                onChange={setDate}
                variant='underlined'
                className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                
                />
                <p className="text-default-500 text-sm">
                  {date ? formatter.format(date.toDate(getLocalTimeZone())) : "--"}
                </p>
                
              </div>
              <Input
              label="File"
              htmlFor='file'
              type='file'
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
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
  );
}

export default CreateAnnouncements;
