import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardHeader, CardBody, CardFooter, Avatar, Divider } from '@heroui/react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import {UserPen, Eye} from 'lucide-react' 
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/guardian/'
const URIS = 'http://localhost:4000/students/'

const columns = [
  {name:"NOMBRE" , uid: "name"},
  {name:"TELEFONO" , uid: "phone"},
  {name:"F. NACIMIENTO" , uid: "date_of_birth"},
  {name:"ROL" , uid: "role"},
  {name:"ESTATUS" , uid: "status"},
  {name: "ACCIONES", uid: "actions"},
];

const statusColorMap = {
  activo: "success",
  inactivo: "danger",
  vacation: "warning",
};


function ProfileGuardian() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [file, setfile] = useState(null)

    const [students, setStudents] = useState([]); // Estado para estudiantes
  
    const {id} = useParams()
    // Obtener el rol del usuario desde el objeto `user` o localStorage
   const roleA = localStorage.getItem('role'); 

   const renderCell = useCallback((user, columnKey) => {
  const cellValue = user[columnKey];

  switch (columnKey) {
      case "name":
      return (
          <User
          avatarProps={{radius: "lg", src: user.file}}
          description={user.email}
          name={cellValue}
          >
          {user.email}
          </User>
      );
      case "phone":
      return (
          <div className="flex flex-col">
          <p className="text-bold text-sm capitalize text-primary-600/70">{cellValue}</p>
          {/* <p className="text-bold text-sm capitalize text-default-400">{user.phone}</p> */}
          </div>
      );
      case "date_of_birth":
      return (
          <div className="flex flex-col">
          <p className="text-bold text-sm capitalize text-default-400">{cellValue}</p>
          
          {/* <p className="text-bold text-sm capitalize text-default-400">{formatter.format(parseDate(user.date_of_birth))}</p> */}
          </div>
      );
      case "role":
      return (
          <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">{cellValue}</p>
          <p className="text-bold text-sm capitalize text-primary-600/70">{user.role}</p>
          </div>
      );
      case "status":
      return (
          <Chip className="capitalize text-slate-700 " color={statusColorMap[user.status.toLowerCase()]}
          size="sm" variant="bordered">
          {cellValue}
          </Chip>
      );
      case "actions":
      return (
          <div className="relative flex justify-center items-center gap-4 ">
          <Tooltip content="Mostrar usuario">
              <Link to={`/ProfileStudent/${user.id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Eye className='hover:text-secondary-500 hover:duration-300' />
                  </span>
              </Link>
          </Tooltip>
          
          {/* <Tooltip content="Editar Usuario">
              <Link to={`/UpdatedTeacher/${user.id}`} >
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <UserPen className='hover:text-auxColors-350 hover:duration-300' />
                  </span>
              </Link>
          </Tooltip> */}
          
          </div>
      );
      default:
      return cellValue;
  }
  }, []);

  let formatter = useDateFormatter({dateStyle: "full"});
    
  
    useEffect( () => {
      getGuardianById()
      getStudentsByGuardianId(id);
    },[id])
  
    const getGuardianById = async () => {
      const res = await axios.get(URI+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setRole(res.data.role)
      setStatus(res.data.status)
      setfile(res.data.file)  
      
    }

    
    const getStudentsByGuardianId = async (guardianId) => {
      const res = await axios.get(`${URIS}guardian?guardian_id=${guardianId}`);
      setStudents(res.data); // Establecer solo los estudiantes del tutor actual
  };

  return (
    <div className='flex justify-center flex-col'>
        <div className='bg-primary-900/70 max-w-md w-full p-10 rounded-md text-white mt-8 mx-auto'>
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                  <Link to={`/UpdatedGuardian/${id}`} className=" ">
                    <Button className='absolute top-[140px] right-4 px-7 bg-[#f5a525] text-white hover:text-black'
                    variant='flat'
                    color='warning'
                    >
                      Editar Tutor
                    </Button>
                  </Link>
                </div>
                // <div>
                //     <Link to={`/UpdatedGuardian/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                //         Editar Tutor
                //     </Link>
                // </div>
            )}
          
          <Card className=' w-md p-5 bg-primary-300 mx-auto'>
            <CardHeader className=' justify-between'>
            <div className=' flex gap-5'>
                {file && (
                  <Avatar
                    isBordered
                    radius="full"
                    size="lg"
                    src={file}
                  />
                )}
                    <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-primary-900">{name}</h4>
                    <h5 className="text-small tracking-tight text-default-400 hover:text-red-500 hover:duration-700">{email}</h5>
                  </div>

                </div>
              
            </CardHeader>  
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className='text-primary-900'>Telefono:<span className='text-default-900 ml-5'>{phone}</span> </p>
              <p className='pt-2'>Fecha de nacimiento: <span className='ml-5 text-default-900'>{date_of_birth}</span> </p>
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                
                <p className="font-semibold text-primary-900 text-small ">Status: </p>
                <p className=" text-default-900 text-small ml-1">{status}</p>
              </div>

            </CardFooter>
          </Card>  
          {/* Mostrar la imagen si existe
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
            <h1>Nombre: {name}</h1>
            <p>Correo: <span className='text-red-700'>{email}</span></p>
            <p>Telefono: {phone}</p>
            <p>Fecha de nacimiento: {date_of_birth}</p>
            <p>Status: {status}</p> */}
        </div>
        <Divider className='my-4'/>
        <div className='w-[70%] mx-auto' >
          <Table aria-label='students table' 
            isHeaderSticky
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
            className='w-full h-full overflow-scroll'>
                <TableHeader columns={columns}
                className=''
                >
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" || column.uid === "status"  ? "center" : "start"}
                        className=' '>
                            <div>
                                {column.name}
                                
                            </div>
                        </TableColumn>
                    )
                    }
                </TableHeader>
                <TableBody items={students}>
                    {(item)=>(
                        <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    
                    )}
                </TableBody>
            </Table>
            {/* <h2 className="font-bold text-white text-2xl text-center mt-4">Estudiantes:</h2>
                <ul className="mt-2">
                  {console.log(students)}
                    {students.map(student => (

                    <Link to={`/ProfileStudent/${student.id}`}> 
                      <li key={student.id} className="text-center">{student.name}</li> 
                    </Link>

                    ))}
                </ul> */}

        </div>
    </div>
  )
}

export default ProfileGuardian