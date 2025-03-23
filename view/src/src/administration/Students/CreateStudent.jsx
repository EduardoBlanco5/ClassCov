import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker} from '@heroui/react'
import {parseDate, getLocalTimeZone, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";


const URI = 'http://localhost:4000/student'
const URIGUARDIANS = 'http://localhost:4000/guardiansSearch';

function CreateStudent() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [admission, setAdmission] = useState('')
    const [valueAdm, setValueAdm] = useState(today(getLocalTimeZone()));
    let formatterAmd = useDateFormatter({dateStyle: "full"});

    const [phone, setPhone] = useState('')

    const [date_of_birth, setDate_of_birth] = useState('')
    const [valueDate, setValueDate] = useState(today(getLocalTimeZone()));
    let formatter = useDateFormatter({dateStyle: "full"});

    const [role, setRole] = useState('student')
    const [guardian_id, setGuardian_id] = useState ('')
    //const [class_id, setClass_id] = useState ('')
    const [status, setStatus] = useState ('activo')
    const [file, setFile] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [guardians, setGuardians] = useState([]);

    const fetchGuardians = useCallback(
        async (searchTerm) => {
          if (!searchTerm.trim()) {
            setGuardians([]);
            return;
          }
    
          try {
            const response = await axios.get(`${URIGUARDIANS}?search=${searchTerm}`);
            setGuardians(response.data);
          } catch (error) {
            console.error('Error al buscar tutores:', error);
          }
        },
        []
      );
      const debounceFetchGuardians = useCallback(
        debounce((term) => fetchGuardians(term), 500),
        [fetchGuardians]
      );
    
      const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debounceFetchGuardians(value);
      };

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const create = async (e) => {
        e.preventDefault() 
        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('guardian_id', guardian_id);
        //formData.append('class_id', class_id);
        formData.append('password', phone);
        setDate_of_birth(valueDate)
        formData.append('date_of_birth', date_of_birth);
        setAdmission(valueAdm)
        formData.append('admission', admission);
        formData.append('status', status);
        formData.append('phone', phone);
        formData.append('role', role);
        // Agregar el archivo al FormData
        formData.append('file', file);

        try {
            // Enviar el FormData con una solicitud POST
            await axios.post(URI, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            navigate('/ShowStudents')
            } catch (error) {
                console.error('Error al crear el Tutor:', error);
            }
    }

    const uploadExcel = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          await axios.post('http://localhost:4000/student-excel', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          alert('Tutores importados correctamente');
      } catch (error) {
          console.error('Error al subir el archivo Excel:', error);
          alert('Error al subir el archivo');
      }
  };
  return (

    <div className='flex justify-center gap-1'>
        <div className='w-[60%] p-10 rounded-md flex'>
          <Card className='bg-primary-300 w-full'>
            <CardHeader className='bg-primary-900'>
              <h1 className='font-bold text-white text-center text-3xl'>Alumno</h1>
            </CardHeader>
              <form onSubmit={create} >
                <CardBody>
                  <Input
                  
                  type='text'
                  label="Nombre del Alumno"
                  placeholder='Digita el nombre ... '
                  value={name}
                  onChange={ (e) => setName(e.target.value)}
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
                  
                  <Input
                  type='text'
                  label="Correo del Alumno"
                  placeholder='Digita el correo ... '
                  value={email}
                  onChange={ (e) => setEmail(e.target.value)}
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

                  
                  <Input
                  type='text'
                  label="Teléfono de Emergencia"
                  placeholder='Digita el telefono ... '
                  value={phone}
                  onChange={ (e) => setPhone(e.target.value)}
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
                  
                  <Input
                  type='search'
                  label="Buscar Tutor"
                  placeholder='Buscar por nombre o correo ... '
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                  
                {guardians.length > 0 && (
                  <ul className="bg-white rounded-md shadow-md max-h-40 overflow-auto">
                    {guardians.map((guardian) => (
                      <li
                        key={guardian.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setGuardian_id(guardian.id);
                          setSearchTerm(`${guardian.name} (${guardian.email})`);
                          setGuardians([]);
                        }}
                      >
                        {guardian.name} ({guardian.email})
                      </li>
                    ))}
                  </ul>
                )} 


                  <div className='w-full flex flex-col items-end'>
                    <DatePicker
                    name='dateOfBirth'
                    label='Fecha de nacimiento'
                    labelPlacement='inside'
                    showMonthAndYearPickers
                    value={valueDate}
                    onChange={setValueDate}
                    variant='underlined'
                    className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                    
                    />
                    <p className="text-default-500 text-sm">
                      {valueDate ? formatter.format(valueDate.toDate(getLocalTimeZone())) : "--"}
                    </p>
                    
                  </div>
                  
                  <div className=' w-full flex flex-col items-end'>
                    <DatePicker
                    name='dateOfAdm'
                    label='Fecha de Admisión'
                    labelPlacement='inside'
                    showMonthAndYearPickers
                    value={valueAdm}
                    onChange={setValueAdm}
                    variant='underlined'
                    className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                    />
                    <p className="text-default-500 text-sm">
                      {valueAdm ? formatter.format(valueAdm.toDate(getLocalTimeZone())) : "--"}
                    </p>
                    
                  </div>

                  {/* <label className='text-white'>Fecha de Admisión</label>
                  <input
                  type='date'
                  value={admission}
                  onChange={(e) => setAdmission(e.target.value)}
                  className='w-full px-4 py-2 rounded-md my-2'
                  >
                  </input> */}

                  <Input
                  label="Foto de Perfil"
                  htmlFor='file'
                  type='file'
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  isRequired = 'true'
                  required
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
                  {/* <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
                  <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required /> */}

                </CardBody>
                <CardFooter className='flex- justify-end'>
                  <Button 
                  variant='bordered'
                  className='bg-primary-900/70 border-primary-900 px-10
                  hover:bg-primary-600/70 hover:border-primary-600 hover:text-white hover:duration-500' 
                  type='submit'
                  >Guardar</Button>

                </CardFooter>
              </form>

          </Card>
        </div>
        
        <div className='  max-w-md w-full p-10 rounded-md flex'>
          <Card className='w-full bg-primary-300'>
            <form onSubmit={uploadExcel}>
              <CardHeader className='bg-primary-900'>
                <h1 className="font-bold text-white text-center text-3xl">Subir Excel de Alumnos</h1>

              </CardHeader>
              <CardBody>

                  <Input
                    label="Excel de alumnos"
                    
                    type='file'
                    id="excelFile"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".xlsx,.xls"
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
                  
                  {/* <button className="bg-blue-600 rounded-md w-20 mx-32" type="submit">
                      Subir Excel
                  </button> */}
              </CardBody>
              <CardFooter className='flex justify-end'>
                <Button 
                  variant='bordered'
                  className='bg-primary-900/70 border-primary-900 px-10
                  hover:bg-primary-600/70 hover:border-primary-600 hover:text-white hover:duration-500' 
                  type='submit'
                  >
                    Subir Excel
                </Button>
              </CardFooter>
                
              </form>
          </Card>
        </div>
    </div>
    
  )
}

function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

export default CreateStudent