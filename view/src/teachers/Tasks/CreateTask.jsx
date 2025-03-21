import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useEffect} from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import {Button,
  Card, CardBody,
  CardHeader, CardFooter, Select, SelectItem,
  Divider,
  Input,
  DatePicker,
  Textarea} from "@heroui/react";
import {parseDate, getLocalTimeZone, today, now} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/task'
const SUBJECTS_URI = 'http://localhost:4000/subjects'; // Endpoint para obtener materias


function CreateTask() {
  const {register, handleSubmit} = useForm()
  const { class_id } = useParams(); // Obtener el id de la clase desde la URL
  const teacher_id = localStorage.getItem("teacher_id") || "1"; // Asegúrate de guardar este dato al iniciar sesión

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  
  const [deliveryDate, setDeliveryDate] = useState(today(getLocalTimeZone()))
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null);

  const [subjects, setSubjects] = useState([]); // Lista de materias
  const [subjectId, setSubjectId] = useState(''); // Materia seleccionada
  let formatter = useDateFormatter({dateStyle: "full"});

  const navigate =useNavigate()

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  })

  useEffect(() => {
    // Obtener materias desde el backend
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(SUBJECTS_URI);
        // console.log(response.data)
        setSubjects(response.data);
      } catch (error) {
        console.error('Error al obtener materias:', error);
      }
    };

    fetchSubjects();
  }, []);

  const create = async (e) => {
    e.preventDefault() 
    const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('notes', notes);
      
        formData.append('deliveryDate', deliveryDate.toString());
        formData.append('status', status);
        // Agregar el archivo al FormData

        if (file) {
        formData.append('file', file);
        }

        formData.append('teacher_id', teacher_id); // Añade teacher_id
        formData.append('class_id', class_id); // Asegúrate de que `class_id` provenga de `useParams`
        formData.append('subject_id', subjectId); // Añade el subject_id seleccionado

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
  }


  return (
    <div className='flex justify-center w-full'>
      <div className='w-[80%] mt-4  mx-auto flex justify-center'>
        <Card className='w-1/2 bg-secondary-200 '>
          <CardHeader>
            <h1 className='font-bold text-white text-center text-3xl'>Crear Tarea</h1>
          </CardHeader>
          <form onSubmit={create} >
            <CardBody>
              <Input
              label="Titulo de la tarea"
              labelPlacement='inside'
              placeholder='Digite el titulo...'
              value={title}
              onChange={ (e) => setTitle(e.target.value)}
              className='mb-2'
              classNames={{
                label: "text-white/90 group-data-[focus=true]:text-secondary-50 ",
                mainWrapper:"",
                inputWrapper:[
                "bg-secondary-100 text-secondary-900",
                "hover:bg-secondary-500/70",
                "group-data-[focus=true]:bg-secondary-600/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                ],
                innerWrapper:"bg-transparent",
                input:[
                "bg-transparent",
                "text-secondary-100/90 ",
                "group-data-[focus=true]:text-secondary-100/50",
                "placeholder:text-secondary-700/90 ",
                ],
            }}
              
              />
              <Textarea
              label="descripcion de la tarea"
              labelPlacement='inside'
              placeholder='Digite la descripcion...'
              value={description}
              onChange={ (e) => setDescription(e.target.value)}
              className='my-2'
              classNames={{
                label: "text-white/90 group-data-[focus=true]:text-secondary-50 ",
                mainWrapper:"",
                inputWrapper:[
                "bg-secondary-100 text-secondary-900",
                "hover:bg-secondary-500/70",
                "group-data-[focus=true]:bg-secondary-600/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                ],
                innerWrapper:"bg-transparent",
                input:[
                "bg-transparent",
                "text-secondary-100/90 ",
                "group-data-[focus=true]:text-secondary-100/50",
                "placeholder:text-secondary-700/90 ",
                ],
            }}

              />

            <div className='w-full flex justify-around gap-2 px-3 my-2'>     
              <div className='w-1/2'>
                
                <Textarea
                label="Notas de la tarea"
                labelPlacement='inside'
                placeholder='Digite la notas...'
                value={notes}
                onChange={ (e) => setNotes(e.target.value)}
                className='mb-2'
                classNames={{
                  label: "text-white/90 group-data-[focus=true]:text-secondary-50 ",
                  mainWrapper:"",
                  inputWrapper:[
                  "bg-secondary-100 text-secondary-900",
                  "hover:bg-secondary-500/70",
                  "group-data-[focus=true]:bg-secondary-600/50",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  ],
                  innerWrapper:"bg-transparent",
                  input:[
                  "bg-transparent",
                  "text-secondary-100/90 ",
                  "group-data-[focus=true]:text-secondary-100/50",
                  "placeholder:text-secondary-700/90 ",
                  ],
              }}

                />
              </div>         
              <div className='w-1/2 flex flex-col items-center mt-3'>
                <DatePicker
                name='dateOfBirth'
                label='Fecha de Entrega'
                labelPlacement='inside'
                hideTimeZone
                showMonthAndYearPickers
                
                value={deliveryDate}
                onChange={setDeliveryDate}
                variant='underlined'
                className='  rounded-t-xl  hover:border-secondary-900 group-data-[focus=true]:bg-secondary-900'
                classNames={{
                  label:"text-white"
                }}
                />
                <p className="text-secondary-50 text-md">
                  {deliveryDate ? formatter.format(deliveryDate.toDate(getLocalTimeZone())) : "--"}
                </p>
                
              </div>
            </div>
            
            <div className=' w-full gap-3 flex justify-around'>

              <Input
                label="Estatus"
                labelPlacement='inside'
                placeholder='Asignada, En revisión, Entregada'
                value={status}
              onChange={ (e) => setStatus(e.target.value)}
                className='my-2'
                classNames={{
                  label: "text-white/90 group-data-[focus=true]:text-secondary-50 ",
                  mainWrapper:"",
                  inputWrapper:[
                  "bg-secondary-100 text-secondary-900",
                  "hover:bg-secondary-500/70",
                  "group-data-[focus=true]:bg-secondary-600/50",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  ],
                  innerWrapper:"bg-transparent",
                  input:[
                  "bg-transparent",
                  "text-secondary-100/90 ",
                  "group-data-[focus=true]:text-secondary-100/50",
                  "placeholder:text-secondary-700/90 ",
                  ],
              }}
                
                />

                  <Input
                    label="Seleccione un Archivo"
                    htmlFor='file'
                    type='file'
                    id="file"
                    classNames={{
                      label: "text-white/90 group-data-[focus=true]:text-secondary-50 ",
                      mainWrapper:"",
                      inputWrapper:[
                      "bg-secondary-100 text-secondary-900",
                      "hover:bg-secondary-500/70",
                      "group-data-[focus=true]:bg-secondary-600/50",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                      ],
                      innerWrapper:"bg-transparent",
                      input:[
                      "bg-transparent",
                      "text-secondary-100/90 ",
                      "group-data-[focus=true]:text-secondary-100/50",
                      "placeholder:text-secondary-700/90 ",
                      ],
                  }}
                    className='my-2'
                    />
            </div>
            
              <Select
                label = "Seleccione la Materia"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className=' w-full  text-secondary-900 text-md'
                variant="underlined"
              >
                {/* {console.log(subjects)} */}
                {subjects.map((gItem)=>(
                  <SelectItem className=' 
                  
                  data-[selectable=true]:focus:bg-secondary-500 
                  text-secondary-900 
                  data-[hover=true]:bg-secondary-900
                  data-[hover=true]:text-secondary-500 
                  data-[pressed=true]:opacity-95

                  data-[focus-visible=true]:ring-secondary-300
                  ' 
                  key={gItem.id}>{gItem.name}
                  </SelectItem>
                ))} 
              </Select>
            </CardBody>
            <CardFooter>
            <Button  
              className='bg-secondary-100 
              rounded-md 
              w-[300px] 
              mt-4 
              mx-auto 
              hover:bg-primary-100 
              duration-500 
              hover:text-white 
              hover:shadow-sm
              hover:shadow-primary-900
              hover:scale-110
              ' 
              type='submit'>Guardar</Button>
            </CardFooter>
            
{/* 
            <label className='text-white text-1xl font-semibold'>Fecha de Entrega</label>
            <input
            type='date'
            placeholder='0000-00-00'
            value={deliveryDate}
            onChange={ (e) => setDeliveryDate(e.target.value)}
            className='px-1 py-1 rounded-md my-2 mx-10'
            >
            </input> */}

            {/* <label className='text-white text-1xl font-semibold'>    Materia</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
            >
              <option value=''>Selecciona una materia</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select> */}

            {/* <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button> */}
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CreateTask
