import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker} from '@heroui/react'
import {parseDate, getLocalTimeZone, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/teacher'

function CreateTeacher() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [hire_date, setHire_date] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [valueDate, setValueDate] = useState(today(getLocalTimeZone()));
    const [valueAdm, setValueAdm] = useState(today(getLocalTimeZone()));
    let formatter = useDateFormatter({dateStyle: "full"});
    const [status, setStatus] = useState('activo');
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('teacher')

    const onSubmit = handleSubmit((data) => {
      console.log(data);
    })

    const create = async (e) => {
      e.preventDefault() 
      const formData = new FormData();

      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', phone);
      formData.append('phone', phone);
      setValueDate(valueDate)
      setDate_of_birth(valueDate.toString())
      formData.append('date_of_birth', date_of_birth);
      formData.append('role', role);
      formData.append('status', status)
      setValueAdm(valueAdm)
      setHire_date(valueAdm.toString())
      formData.append('hire_date', hire_date);
      // Agregar el archivo al FormData
      formData.append('file', file);
      
      try {
        // Enviar el FormData con una solicitud POST
        await axios.post(URI, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Navegar a la página de lista de administradores después de guardar
        navigate('/ShowTeachers')
        
      } catch (error) {
        console.error('Error al crear el administrador:', error);
      }
    }




    return (
      <div className='flex justify-center gap-1'>
          <div className='w-[60%] p-10 rounded-md flex'>
            <Card className='bg-primary-300 w-full'>
              <CardHeader className='bg-primary-900'>
                <h1 className='font-bold text-white text-center text-3xl'>Profesor</h1>
              </CardHeader>

              <form onSubmit={create} >
                <CardBody>
                <Input
                  
                  type='text'
                  label="Nombre del Profesor"
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
                  label="Correo del Profesor"
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
                  label="Teléfono "
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
                    name='hireDate'
                    label='Fecha de Admisión'
                    labelPlacement='inside'
                    showMonthAndYearPickers
                    value={valueAdm}
                    onChange={setHire_date}
                    variant='underlined'
                    className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                    />
                    <p className="text-default-500 text-sm">
                      {valueAdm ? formatter.format(valueAdm.toDate(getLocalTimeZone())) : "--"}
                    </p>
                    
                  </div>
{/* {console.log(valueDate.toString() + "   "+ valueAdm.toString())} */}
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
                  {/* <label className='text-white'>Fecha de Nacimiento</label>
                  <input
                  type='date'
                  value={date_of_birth}
                  onChange={(e) => setDate_of_birth(e.target.value)}
                  className='w-full px-4 py-2 rounded-md my-2'
                  >
                  </input>

                  <label className='text-white'>Fecha de Contrato</label>
                  <input
                  type='date'
                  value={hire_date}
                  onChange={(e) => setHire_date(e.target.value)}
                  className='w-full px-4 py-2 rounded-md my-2'
                  >
                  </input> */}

                  {/* <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
                  <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required /> */}
              
                  {/* <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button> */}
              </form>
            </Card>
          </div>
      </div>
    )
}

export default CreateTeacher