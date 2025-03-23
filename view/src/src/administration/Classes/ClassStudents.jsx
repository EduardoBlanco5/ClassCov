import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { Divider, Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup,
    Radio, 
    Button} from '@heroui/react'


const URI = 'http://localhost:4000/class/'
const URIST = 'http://localhost:4000/student/'
function ClassStudents() {
    
    const [students, setStudents] = useState([])
    
    const {id} = useParams()

    useEffect( () => {
        
        getStudentsByClassId(id);
        
        
        
    },[id])

    const getStudentsByClassId = async (classId) => {
        const res = await axios.get(`${URI}${classId}/students`);
    setStudents(res.data); // Establece solo los estudiantes de la clase actual
    console.log(res.data)
    };


return (
    <div className='w-full '>
        <div className='mt-3 ml-3'>
            <Link to={`/CreateAttendances/${id}`} className=' '>
                <Button
                variant='ghost'
                color='secondary'
                >
                    
                    Asistencias
                </Button>
            </Link>
        </div>
        <div className='w-10/12 mx-auto'>
            <h2 className="font-bold text-auxColors-500 text-2xl text-center mt-4">Alumnos:</h2>
            <Divider className='mt-5'/>
            <div className='flex flex-col gap-3 w-10/12 mx-auto mt-4'>
                <Table
                    aria-label="tabla alumnos"
                    selectionMode="single"
                    color='secondary'
                    classNames={{
                        wrapper:"bg-transparent " ,
                        th:"bg-auxColors-500/90 text-white",
                        td: "hover:bg-auxColors-500 rounded-lg"
                    }}
                >
                    <TableHeader>
                    <TableColumn>Nombre</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <Link to={`/ProfileStudent/${student.id}`} > 
                                    <div className=' w-full'>
                                        {student.name}
                                    </div>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
            </div>

            
        </div>
    </div>
  )
}

export default ClassStudents