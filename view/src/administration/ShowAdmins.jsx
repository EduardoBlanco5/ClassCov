import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const URI = 'http://localhost:4000/admins'

function ShowAdmins() {

    const [admins, setAdmins] = useState([]);
    useEffect(() => {
        getAdmins()
    },[])


    //Mostrar Tareas
    const getAdmins = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setAdmins(res.data);
        } else {
            setAdmins([]);
        }
   
    }

    if (admins.length === 0) {
        return(

            <Link to={'/CreateAdmin'}>
                <h1>No hay Administradores</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Administrador</button>
        
            </Link>
        )
      }

  return (
    <>

        <Link to={'/Admin'}>
            <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Administrador</button>
        </Link>
        <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[40%]">

            <div className=" max-w-md w-full p-10 rounded-md my-2 px-4 py-2 ">
            {admins.map ((admin) => (


                    <tr  key={admin.id} >

                        <Link to={`/ProfileAdmin/${admin.id}`}>  
                        <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                            <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{admin.name}</h1>
                            <div className="w-full px-4 py-2 my-2">
                            <h1>{admin.email}</h1>   
                            <h1>{admin.phone}</h1>   
                            <h1>{admin.date_of_birth}</h1>   
                            <h1>{admin.role}</h1>   
                            <h1>{admin.status}</h1>   
                            <p className="text-black font-semibold"> {admin.shift}</p>
                        
                                <Link to={`/UpdatedAdmin/${admin.id}`}>
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

export default ShowAdmins