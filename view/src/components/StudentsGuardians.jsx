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
    <div>

<h2>Lista de hijos</h2>
            {students.length > 0 ? (
                <Table>
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
  )
}

export default StudentsGuardians