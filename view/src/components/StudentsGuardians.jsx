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

const URI = 'http://localhost:4000/students/guardian/';

function StudentsGuardians() {

    const [students, setStudents] = useState([]); // Estado para estudiantes
    const {id} = useParams()

    useEffect( () => {
        
        getStudentsByGuardianId(id);
      },[id])


      const getStudentsByGuardianId = async (guardianId) => {
        try {
            const res = await axios.get(`${URI}${guardianId}`);
            setStudents(res.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };
  
  return (
    <div className="w-full mt-2 ">

    <h2 className='mb-4 text-2xl text-primary-700  ml-5'>Lista de hijos</h2>
    <Divider className=' mb-4 w-11/12 mx-auto bg-primary-900'/>
    <div className=" w-10/12 mx-auto">

        {students.length > 0 ? (
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
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Edad</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.age}</TableCell>
                            <TableCell>
                                <Tooltip content="Ver detalles">
                                    <Link to={`/ProfileStudent/${student.id}`}>
                                        <Eye />
                                    </Link>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            <p>No hay hijos registrados.</p>
        )}
    </div>

    </div>
  )
}

export default StudentsGuardians