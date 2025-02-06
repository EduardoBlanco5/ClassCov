import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/subject/'

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
        <div className='flex justify-center'>
    
            <div className='bg-zinc-800 max-w-md w-full p-32 py- rounded-md justify-center flex '>
                <form onSubmit={update} className="">
                    
                    
                    <h1 className="font-bold text-white text-3xl text-center">Nombre: </h1>
                    <input
                    type="text"
                    placeholder="Español, Mátematicas, ..."
                    value={name}
                    onChange={ (e) => setName(e.target.value)}
                    className='w-100 mx-40 mt-3 text-center rounded-md '
                    >
                    </input>
                    <h1 className="font-bold text-white text-3xl text-center">Descripción: {description}</h1>
                    <input
                    type="text"
                    placeholder=""
                    value={description}
                    onChange={ (e) => setDescription(e.target.value)}
                    className='w-100 mx-40 mt-3 text-center rounded-md '
                    >
                    </input>
                    
                    <label className="text-white text-3xl font-bold px-10">Grado</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className='w-100 mx-40 mt-3 text-center rounded-md '
                    >
                        <option value="" disabled>Selecciona un grado</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>


                    <button className='bg-green-600 hover:bg-green-800 rounded-md w-20 mx-[38%]  mt-3' type='submit'>Actualizar</button>
                </form>
            </div>
        </div>
    
    )
}

export default UpdatedSubject