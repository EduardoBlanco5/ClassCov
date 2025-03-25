import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {Button,
    Card, CardBody, Image, Slider, Form,
    CardHeader, Select, SelectItem,
    Divider, Avatar,
    Input} from "@heroui/react";
  import { FilePlus2 } from 'lucide-react';

const URI = 'http://localhost:4000/subject/'

const gradeItem = [
    {key:"1", label:"Primero"},
    {key:"2", label:"Segundo"},
    {key:"3", label:"Tercero"},
    {key:"4", label:"Cuarto"},
    {key:"5", label:"Quinto"},
    {key:"6", label:"Sexto"},
  ]
  
function UpdatedSubject() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [grade, setGrade] = useState('')

    const [teacher_id, setTeacher_id] = useState('')

    const {id} = useParams()
    const navigate = useNavigate()

    const update = async (e) => {
        e.preventDefault()
        try {
        await axios.put(URI+id, {
            
            name: name,
            description: description,
            grade: grade,
            
        })
        navigate('/ShowSubjects')
        } catch (error) {
        console.error('Error al actualizar la clase:', error.response.data);
    }

    }

    useEffect( () => {
        getSubject()
    },[])

    const getSubject = async () => {
        const res = await axios.get(URI+id)
        
        setGrade(res.data.grade)
        setName(res.data.name)
        setDescription(res.data.description)
     

        console.log(res.data.id)
    }


    return (
        <div className=' w-[100vw] h-auto mt-12 flex  justify-center'>
        <Card className=' max-w-[1000px] w-[600px] flex ' isBlurred >
            <div className='bg-secondary-200 justify-center  w-full p-10 rounded-md flex'>
            <Form onSubmit={update} className='w-full' >
              <CardHeader className=' flex gap-3 justify-center'>
                <FilePlus2 className=" text-white w-12 h-12" />
                <h1 className='font-bold text-white text-center text-3xl'>Materias</h1>
              </CardHeader>
              <Divider className=' bg-white'/>
              <CardBody>
                <Input
                placeholder='Español, Matemáticas, Historia,...'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mb-4'
                />
    
                <Input
                type='text'
                placeholder='Breve descripción de la materia'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                >
                </Input>
    
    
                <Select
                  label = "Seleccione el Grado"
                  value={grade}
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
                
              </CardBody>
    
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
                type='submit'>Guardar</Button>
            </Form>
            </div>
        </Card>
      </div>
        // <div className='flex justify-center'>
    
        //     <div className='bg-zinc-800 max-w-md w-full p-32 py- rounded-md justify-center flex '>
        //         <form onSubmit={update} className="">
                    
                    
        //             <h1 className="font-bold text-white text-3xl text-center">Nombre: </h1>
        //             <input
        //             type="text"
        //             placeholder="Español, Mátematicas, ..."
        //             value={name}
        //             onChange={ (e) => setName(e.target.value)}
        //             className='w-100 mx-40 mt-3 text-center rounded-md '
        //             >
        //             </input>
        //             <h1 className="font-bold text-white text-3xl text-center">Descripción: {description}</h1>
        //             <input
        //             type="text"
        //             placeholder=""
        //             value={description}
        //             onChange={ (e) => setDescription(e.target.value)}
        //             className='w-100 mx-40 mt-3 text-center rounded-md '
        //             >
        //             </input>
                    
        //             <label className="text-white text-3xl font-bold px-10">Grado</label>
        //             <select
        //                 value={grade}
        //                 onChange={(e) => setGrade(e.target.value)}
        //                 className='w-100 mx-40 mt-3 text-center rounded-md '
        //             >
        //                 <option value="" disabled>Selecciona un grado</option>
        //                 <option value="1">1</option>
        //                 <option value="2">2</option>
        //                 <option value="3">3</option>
        //                 <option value="4">4</option>
        //                 <option value="5">5</option>
        //                 <option value="6">6</option>
        //             </select>


        //             <button className='bg-green-600 hover:bg-green-800 rounded-md w-20 mx-[38%]  mt-3' type='submit'>Actualizar</button>
        //         </form>
        //     </div>
        // </div>
    
    )
}

export default UpdatedSubject