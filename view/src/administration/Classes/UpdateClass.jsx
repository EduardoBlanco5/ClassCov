import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/class/'
const URIT = 'http://localhost:4000/teachers'

function UpdateClass() {

    const [grade, setGrade] = useState('')
    const [salon, setSalon] = useState('')
    const [shift, setShift] = useState('')
    const [teacher_id, setTeacher_id] = useState('')

    const [grado, setGrado] = useState('')

    const [teachers, setTeachers] = useState([]); // Lista de materias


    const {id} = useParams()
    const navigate = useNavigate()

    useEffect( () => {
        getClassById()
        fetchTeachers();
    },[])

    const update = async (e) => {
        e.preventDefault()
        try {
        await axios.put(URI+id, {
            
            teacher_id: teacher_id,
            grade: grade,
            salon: salon, 
            shift: shift,
            
        })
        navigate('/ShowClass')
        } catch (error) {
        console.error('Error al actualizar la clase:', error.response.data);
    }

    }

    // Obtener materias desde el backend
    const fetchTeachers = async () => {
        try {
          const response = await axios.get(URIT);
          setTeachers(response.data);
        } catch (error) {
          console.error('Error al obtener materias:', error);
        }
      };



    const getClassById = async () => {
        const res = await axios.get(URI+id)
        
        setTeacher_id(res.data.teacher_id)
        setGrade(res.data.grade)
        setSalon(res.data.salon)
        setShift(res.data.shift)
     

        console.log(res.data.id)
    }

    const ConvertirGrado = (grade) => {
        switch (grade) {
            case 1:
                return 'Primero';
                break;
            case 2:
                return 'Segundo';
                break;
            case 3:
                return 'Tercero';
                break;
            case 4:
                return 'Cuarto';
                break;
            case 5:
                return 'Quinto';
                break;
            case 6:
                return 'Sexto';
                break;

            default:
                return `Grado: ${grade}`
                break;
        }
    }

    return (
        <div className='flex justify-center'>
    
            <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md justify-center flex '>
                <form onSubmit={update} className="">
                    
                    <h1 className="font-bold text-white text-3xl text-center">Actualizar Clase</h1>
                    
                    <label className="text-white">Grado</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-4 py-2 rounded-md my-2"
                    >
                        <option value="" disabled>Selecciona un grado</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>

                    <label className='text-white'>Grupo</label>
                    <select
                        value={salon}
                        onChange={(e) => setSalon(e.target.value)}
                        className="w-full px-4 py-2 rounded-md my-2"
                    >
                        <option value="" disabled>Selecciona un grupo</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        
                    </select> 
                    <label className='text-white'>Turno</label>
                    <select
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        className="w-full px-4 py-2 rounded-md my-2"
                    >
                        <option value="" disabled>Selecciona un turno</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        
                    </select>
                    
                    <label className='text-white text-1xl font-semibold'>    Profesor</label>
                    <select
                        value={teacher_id}
                        onChange={(e) => setTeacher_id(e.target.value)}
                        className='w-full px-4 py-2 rounded-md my-2'
                    >
                        <option value=''>Selecciona un Profesor</option>
                        {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                        </option>
                        ))}
                    </select>


                    <button className='bg-green-600 hover:bg-green-800 rounded-md w-20 mx-[38%]  mt-3' type='submit'>Actualizar</button>
                </form>
            </div>
        </div>
    
    )
}

export default UpdateClass