import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {Button,
    Card, CardBody, Image, Slider, Form,
    CardHeader, Select, SelectItem,
    Divider, Avatar} from "@heroui/react";

import { FilePlus2, FilePenLine } from 'lucide-react';



const URI = 'http://localhost:4000/class/'
const URIT = 'http://localhost:4000/teachers'

const gradeItem = [
    {key:"1", label:"Primero"},
    {key:"2", label:"Segundo"},
    {key:"3", label:"Tercero"},
    {key:"4", label:"Cuarto"},
    {key:"5", label:"Quinto"},
    {key:"6", label:"Sexto"},
]
const groupItem = [
{key:"A", label:"A"},
{key:"B", label:"B"},

]
const shiftItem = [
{key:"Matutino", label:"Matutino"},
{key:"Vespertino", label:"Vespertino"},

]

function UpdateClass() {

    const [grade, setGrade] = useState('')
    const [salon, setSalon] = useState('')
    const [shift, setShift] = useState('')
    const [teacher_id, setTeacher_id] = useState('')

    useEffect( () => {
        let count = 0
        if (count == 1){
            window.location.reload(false);
            count = count +1
        }
        
        getClassById()
        fetchTeachers();
    },[])
    

    const [teachers, setTeachers] = useState([]); // Lista de materias


    const {id} = useParams()
    const navigate = useNavigate()

    

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
        
    

        console.log(res.data.id+'  '+res.data.grade+'  '+grade)
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
        

        <div className=' w-[100vw]  mt-12 flex  justify-center'>
        <Card className=' max-w-[1000px] w-[600px] flex ' isBlurred >
            <div className='bg-secondary-200 justify-center  w-full p-10 rounded-md flex'>
                <Form onSubmit={update} className='w-full' >
                <CardHeader className=' flex gap-3 justify-center'>
                    <FilePenLine className=" text-white w-12 h-12" />
                    <h1 className='font-bold text-white text-center text-3xl'>Clases</h1>
                </CardHeader>
                <Divider className=' bg-white'/>
                    
                    <Select
                    label = "Seleccione el Grado"
                    value={grade}
                    isRequired
                    defaultSelectedKeys={[grade] }
                    
                    onChange={(e) => setGrade(e.target.value)}
                    className=' w-11/12   text-white text-md'
                    variant="underlined"
                    
                    >
                    {gradeItem.map((gItem)=>(
                        <SelectItem className=' 
                        
                        data-[selectable=true]:focus:bg-primary-500 
                        text-primary-600 
                        data-[hover=true]:bg-primary-100
                        data-[hover=true]:text-primary-500 
                        data-[pressed=true]:opacity-95
                        data-[focus-visible=true]:ring-primary-300
                        ' 
                        key={gItem.key}>{gItem.label}
                        </SelectItem>
                    ))} 
                    </Select>
                    
    
                    
                    <Select
                    label = "Seleccione el Grupo"
                    value={salon}
                    onChange={(e) => setSalon(e.target.value)}
                    className=' w-full text-white text-md'
                    variant="underlined"
                    
                    >
                    {groupItem.map((gItem)=>(
                        <SelectItem className=' 
                        data-[selectable=true]:focus:bg-primary-500 
                        text-primary-600 
                        data-[hover=true]:bg-primary-100
                        data-[hover=true]:text-primary-500 
                        data-[pressed=true]:opacity-95
                        data-[focus-visible=true]:ring-primary-300
                        ' 
                        key={gItem.key}>{gItem.label}
                        </SelectItem>))
                    }
                    
                    </Select>
    
                    
                    <Select
                    label="Seleccione el Turno"
                    value={shift}
                    defaultSelectedKeys={[grade]}
                    onChange={(e) => setShift(e.target.value)}
                    className=' w-11/12 text-white text-md'
                    variant="underlined"
                    >
                    {shiftItem.map((gItem)=>(
                        <SelectItem className=' 
                        data-[selectable=true]:focus:bg-primary-500 
                        text-primary-600 
                        data-[hover=true]:bg-primary-100
                        data-[hover=true]:text-primary-500 
                        data-[pressed=true]:opacity-95
                        data-[focus-visible=true]:ring-primary-300
                        ' 
                        key={gItem.key}>{gItem.label}
                        </SelectItem>))
                    }
                    
                    </Select>
    
                    <Select
                    className="w-full  py-2"
                    value={teacher_id}
                    onChange={(e) => setTeacher_id(e.target.value)}
                    classNames={{
                        label: "group-data-[filled=true]:-translate-y-5",
                        trigger: "min-h-16",
                        listboxWrapper: "max-h-[400px]",
                    }}
                    items={teachers}
                    label="Profesor asignado"
                    listboxProps={{
                        itemClasses: {
                        base: [
                            "rounded-md",
                            "text-primary-500",
                            "transition-opacity",
                            "data-[hover=true]:text-white",
                            "data-[hover=true]:bg-primary-900",
                            "dark:data-[hover=true]:bg-primary-50",
                            "data-[selectable=true]:focus:bg-primary-50",
                            "data-[pressed=true]:opacity-70",
                            "data-[focus-visible=true]:ring-primary-500",
                        ],
                        },
                    }}
                    popoverProps={{
                        classNames: {
                        base: "before:bg-primary-200",
                        content: "p-0 border-small border-divider bg-background",
                        },
                    }}
                    renderValue={(teachers) => {
                        return teachers.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                            <Avatar
                            alt={item.data.name}
                            className="flex-shrink-0"
                            size="sm"
                            src={item.data.file}
                            />
                            <div className="flex flex-col">
                            <span>{item.data.name}</span>
                            <span className="text-default-500 text-tiny">({item.data.email})</span>
                            </div>
                        </div>
                        ));
                    }}
                    variant="underlined"
                    >
                    {(user) => (
                        <SelectItem key={user.id} textValue={user.name}>
                        <div className="flex gap-2 items-center">
                            <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.avatar} />
                            <div className="flex flex-col">
                            <span className="text-small">{user.name}</span>
                            <span className="text-tiny text-default-400">{user.email}</span>
                            </div>
                        </div>
                        </SelectItem>
                    )}
                </Select>
            

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
                type='submit'>Actualizar</Button>
            </Form>
            </div>
        </Card>
    </div>
    
    )
}

export default UpdateClass