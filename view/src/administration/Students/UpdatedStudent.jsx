import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"


const URI = 'http://localhost:4000/student/'
const URIG = 'http://localhost:4000/Guardian/'
const URIGUARDIANS = 'http://localhost:4000/guardiansSearch';

function UpdatedStudent() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [guardian_id, setGuardian_id] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [file, setFile] = useState(null)

    const [nameG, setNameG] = useState('') //Nombre del padre
    const [searchTerm, setSearchTerm] = useState('');
    const [guardians, setGuardians] = useState([]);


    const [currentImage, setCurrentImage] = useState(null); // Imagen actual del servidor
    const [preview, setPreview] = useState(null); // Previsualización de la nueva imagen
    const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña
  
    const {id} = useParams()

    const navigate =useNavigate()

    const fetchGuardians = useCallback(
      async (searchTerm) => {
        if (!searchTerm.trim()) {
          setGuardians([]);
          return;
        }
  
        try {
          const response = await axios.get(`${URIGUARDIANS}?search=${searchTerm}`);
          setGuardians(response.data);
        } catch (error) {
          console.error('Error al buscar tutores:', error);
        }
      },
      []
    );
    const debounceFetchGuardians = useCallback(
      debounce((term) => fetchGuardians(term), 500),
      [fetchGuardians]
    );
  
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      debounceFetchGuardians(value);
    };
    
    const update = async (e) => {

      e.preventDefault()
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("date_of_birth", date_of_birth);
      formData.append("guardian_id", guardian_id);
      formData.append("role", role);
      formData.append("status", status);
     
    // Solo agregar el archivo si se seleccionó uno nuevo
    if (file instanceof File) {
      formData.append("file", file);
    }

    try {
      await axios.put(`${URI}${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/ShowStudents");
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  
    };
    
    
      
      useEffect( () => {
        getStudentById()
      },[])

      useEffect(() => {
        if (guardian_id) {
            getGuardianById(guardian_id);
        }
    }, [guardian_id]);
    
      const getStudentById = async () => {
        const res = await axios.get(URI+id)
        setName(res.data.name)
        setEmail(res.data.email)
        setPhone(res.data.phone)
        setGuardian_id(res.data.guardian_id)
        setPassword(res.data.password)
        setDate_of_birth(res.data.date_of_birth)
        setRole(res.data.role)
        setStatus(res.data.status)  
        setFile(res.data.file)

            // Si hay una imagen, establecerla correctamente
        if (res.data.file) {
          setCurrentImage(res.data.file);
        } else {
          setCurrentImage(null); // Si no tiene imagen, establecer como null
        } 
      }


      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    
        // Actualizar la previsualización solo si se selecciona un nuevo archivo
        if (selectedFile) {
          const filePreview = URL.createObjectURL(selectedFile);
          setPreview(filePreview);
        }
      };

      const getGuardianById = async (guardianId) => {
        const res = await axios.get(URIG + guardianId);
        setNameG(res.data.name);
      }
      
  return (
    <div className='flex justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={update} >
        <h1 className="text-white font-bold text-3xl text-center">Alumno</h1>

            {/* Mostrar la imagen actual o la previsualización de la nueva */}
          <div className="flex justify-center my-4">
            <img
              src={preview || currentImage || 'https://via.placeholder.com/150'}
              alt="Previsualización"
              className="w-32 h-32 object-cover rounded-full"
              />
              {console.log('imagen: ',currentImage)}
          </div>


            <label className="text-white">Nombre</label>
            <input 
            type='text' 
            placeholder='Nombre'
            value={name}
            onChange={ (e) => setName(e.target.value)}
            className='w-full px-2 py-2 rounded-md my-2'
            autoFocus
            ></input>

            <label className="text-white">Correo</label>
            <input 
            type='text'
            placeholder='ejemplo@correo.com'
            value={email}
            onChange={ (e) => setEmail(e.target.value)}
            className='w-full px-2 py-2 rounded-md my-1'
            ></input>

            <label className="text-white">Telefono</label>
            <input 
            type='text'
            placeholder='3312345678'
            value={phone}
            onChange={ (e) => setPhone(e.target.value)}
            className='w-22 px-1 py-1 rounded-md my-1 mx-8'
            ></input>

          <label className="text-white">Contraseña</label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password***"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-3/4 px-2 py-2 rounded-md my-1"
            />
            <label className="text-white ml-2 flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-1">Mostrar</span>
            </label>
          </div>

            <label className="text-white text-left">Tutor: {nameG} </label>
            <br></br>
            <label className="text-white">Buscar Tutor</label>
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md my-2"
          />
          {guardians.length > 0 && (
            <ul className="bg-white rounded-md shadow-md max-h-40 overflow-auto">
              {guardians.map((guardian) => (
                <li
                  key={guardian.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setGuardian_id(guardian.id);
                    setSearchTerm(`${guardian.name} (${guardian.email})`);
                    setGuardians([]);
                  }}
                >
                  {guardian.name} ({guardian.email})
                </li>
              ))}
            </ul>
          )} 

            <label className="text-white mx-1">Fecha de nacimiento</label>
            <input
            type='date'
            placeholder='0000-00-00'
            value={date_of_birth}
            onChange={ (e) => setDate_of_birth(e.target.value)}
            className='px-1 py-1 rounded-md my-2 mx-5'
            >
            </input>

            

          <label className="text-white">Estatus</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-2 py-2 rounded-md my-2"
          >
            <option value="" disabled>
              Selecciona un estatus
            </option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <label className="text-white">Selecciona un archivo:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-2 py-2 rounded-md my-2"
          />


            <button className='bg-green-600 hover:bg-green-800 rounded-md w-20 mx-32 mt-2' type='submit'>Actualizar</button>
        </form>
      </div>
    </div>
  )
}

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}


export default UpdatedStudent