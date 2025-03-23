import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {Tabs, Tab, Card, CardBody, Button, Divider} from "@heroui/react";
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

const URI = 'http://localhost:4000/teachers'


const columns = [
    {name:"NOMBRE" , uid: "name"},
    {name:"TELEFONO" , uid: "phone"},
    {name:"F. NACIMIENTO" , uid: "date_of_birth"},
    {name:"ROL" , uid: "role"},
    {name:"ESTATUS" , uid: "status"},
    {name: "ACCIONES", uid: "actions"},
];
//<h1>{teacher.email}</h1>   
                        //         <h1>{teacher.phone}</h1>   
                        //         <h1>{teacher.date_of_birth}</h1>   
                        //         <h1>{teacher.role}</h1>   
                        //         <h1>{teacher.status}</h1>  

const statusColorMap = {
    activo: "success",
    inactivo: "danger",
    vacation: "warning",
};

function ShowTeachers() {

    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        getTeachers()
    },[])


    //Mostrar Profes
    const getTeachers = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setTeachers(res.data);
        } else {
            setTeachers([]);
        }
   
    }
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
                    <Link to={`/ProfileTeacher/${user.id}`}>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <Eye className='hover:text-secondary-500 hover:duration-300' />
                        </span>
                    </Link>
                </Tooltip>
                
                <Tooltip content="Editar Usuario">
                    <Link to={`/UpdatedTeacher/${user.id}`} >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <UserPen className='hover:text-auxColors-350 hover:duration-300' />
                        </span>
                    </Link>
                </Tooltip>
                
                </div>
            );
            default:
            return cellValue;
        }
        }, []);

        let formatter = useDateFormatter({dateStyle: "full"});

    if (teachers.length === 0) {
        return(

            <Link to={'/CreateTeacher'}>
                <h1>No hay Profesor</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Profesor</button>
        
            </Link>
        )
    }

    

return (
    <>
        <div>
            
            <Link to={'/CreateTeacher'}>
                <Button variant="bordered"  
                className='border-auxColors-350 text-auxColors-350 mt-5 ml-4
                hover:bg-auxColors-350/80 hover:text-white hover:duration-500'
                >
                    Crea Profesor
                </Button>
            </Link>
            <div className=" w-full flex justify-center items-center mt-2  ">
                <div className='w-[90%]  h-[75vh]'>
                    <Table aria-label='Teachers table' 
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
                        <TableBody items={teachers}>
                            {(item)=>(
                                <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            
                            )}
                        </TableBody>
                    </Table>
                </div>

                
            </div>
        </div>

    </>
  )
}

export default ShowTeachers