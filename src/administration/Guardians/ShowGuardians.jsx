import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const URI = 'http://localhost:4000/guardians'

function ShowGuardians() {

    const [guardians, setGuardians] = useState([]);
    useEffect(() => {
        getGuardians()
    },[])


    //Mostrar Tareas
    const getGuardians = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setGuardians(res.data);
        } else {
            setGuardians([]);
        }
   
    }

    if (guardians.length === 0) {
        return(

            <Link to={'/CreateGuardian'}>
                <h1>No hay Tutores</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Tutor</button>
        
            </Link>
        )
      }

  return (
    <>

        <Link to={'/CreateGuardian'}>
            <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Tutor</button>
        </Link>
        <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[40%]">

            <div className=" max-w-md w-full p-10 rounded-md my-2 px-4 py-2 ">
            {guardians.map ((guardian) => (


                    <tr  key={guardian.id} >

                        <Link to={`/ProfileGuardian/${guardian.id}`}>  
                        <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                            <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{guardian.name}</h1>
                            <div className="w-full px-4 py-2 my-2">
                            <h1>{guardian.email}</h1>   
                            <h1>{guardian.phone}</h1>   
                            <h1>{guardian.date_of_birth}</h1>   
                            <h1>{guardian.role}</h1>   
                            <h1>{guardian.status}</h1>   

                            {/* Mostrar la imagen si existe */}
                            {console.log(guardian.file)}
                                {guardian.file && (
                                    <img src={guardian.file} className="w-20 h-20 object-cover rounded-full my-2" />
                                )}

                                <Link to={`/UpdatedGuardian/${guardian.id}`}>
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
        </div>

    </>
  )
}

export default ShowGuardians