import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const URI = 'http://localhost:4000/classes'

function ShowClass() {

    const [salons, setSalon] = useState([]);
    useEffect(() => {
        getClasses()
    },[])


    //Mostrar Tareas
    const getClasses = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setSalon(res.data);
        } else {
            setSalon([]);
        }
   
    }

    if (salons.length === 0) {
        return(

            <Link to={'/CreateClass'}>
                <h1>No hay Tutores</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Clase</button>
        
            </Link>
        )
      }

  return (
    <>

        <Link to={'/CreateClass'}>
            <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Clase</button>
        </Link>
    
        <div className=" max-w-md w-full p-10 rounded-md my-2 px-4 py-2 ">
        {salons.map ((salon) => (
        

                <tr  key={salon.id} >

                    <Link to={`/ClassCard/${salon.id}`}>  
                    <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                        <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{salon.grade}{salon.salon}</h1>
                        <div className="w-full px-4 py-2 my-2">
                        <p className="text-black font-semibold"> {salon.shift}</p>
                        

                            <Link to={`/UpdateClass/${salon.id}`}>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md ">
                                Actualizar
                            </button>
                            </Link>

                            
            
                            
                        </div>
                    </header>
                </Link>
            
                </tr>
            ))}

        </div>
        
    </>
  )
}

export default ShowClass