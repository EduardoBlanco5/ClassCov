import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker, Tabs, Tab} from '@heroui/react'
import {parseDate, getLocalTimeZone, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/guardian'

function CreateGuardian() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [valueDate, setValueDate] = useState(today(getLocalTimeZone()));
    let formatter = useDateFormatter({dateStyle: "full"});
    const [role, setRole] = useState('guardian')
    const [status, setStatus] = useState('activo')
    const [file, setFile] = useState(null);

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
        formData.append('date_of_birth', valueDate.toString());
        formData.append('role', role);
        formData.append('status', status);
        // Agregar el archivo al FormData
        formData.append('file', file);

        try {
            // Enviar el FormData con una solicitud POST
            await axios.post(URI, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            navigate('/ShowGuardians');
          } catch (error) {
            console.error('Error al crear el Tutor:', error);
          }
    }

    const uploadExcel = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          await axios.post('http://localhost:4000/guardian-excel', formData, {
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
        <div className='w-[60%] p-10 rounded-md flex flex-col '>
            <Tabs aria-label="Options"
            variant='underlined'
            size='lg'
            classNames={{
                tabContent: [
                    "text-primary-900",
                    "group-data-[selected=true]:text-primary-700",
                    ""
                ],
                cursor: "w-full bg-primary-900",
                tabWrapper:"bg-primary-400"
            }}
            className=' mx-auto text-primary-600'
            >
                <Tab key="createO" title="Tutor">
                    <Card className='bg-primary-300 w-full'>
                        <CardHeader className='bg-primary-900'>
                        <h1 className='font-bold text-white text-center text-3xl'>Tutor</h1>
                        </CardHeader>
                        <form onSubmit={create} >
                            <CardBody>
                                <Input
                            
                                type='text'
                                label="Nombre del Tutor"
                                placeholder='Digita el nombre completo... '
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
                                label="Correo del Tutor"
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
                            {/* <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button> */}
                        </form>
                    </Card>
                </Tab>
                <Tab key="createF" title="Tutores (excel)">
                <Card className='bg-primary-300 w-full'>
                        <CardHeader className='bg-primary-900'>
                        <h1 className='font-bold text-white text-center text-3xl'>Subir Excel de Tutores</h1>
                        </CardHeader>
                        <form onSubmit={create} >
                            <CardBody>


                                <Input
                                label="Selecciona un archivo Excel"
                                htmlFor='excelFile'
                                type='file'
                                id="excelFile"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".xlsx,.xls"
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
                            {/* <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button> */}
                        </form>
                    </Card>
                </Tab>
            </Tabs>

        
        </div>
        {/* <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={uploadExcel}>
                <h1 className="font-bold text-white text-center text-3xl">Subir Excel de Tutores</h1>
                <label htmlFor="excelFile" className="text-white">
                    Selecciona un archivo Excel:
                </label>
                <input
                    type="file"
                    id="excelFile"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".xlsx,.xls"
                    required
                />
                <button className="bg-blue-600 rounded-md w-20 mx-32" type="submit">
                    Subir Excel
                </button>
            </form>
        </div> */}
    </div>
        
    )
}

export default CreateGuardian