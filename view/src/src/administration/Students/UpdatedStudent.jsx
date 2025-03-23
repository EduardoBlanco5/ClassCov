import { Checkbox, DateInput, Divider, Input, Select, SelectItem, Button } from "@heroui/react"
import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {parseDate,CalendarDate} from "@internationalized/date";


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
    const birthD = date_of_birth.toString()
    const [nameG, setNameG] = useState('') //Nombre del padre
    const [searchTerm, setSearchTerm] = useState('');
    const [guardians, setGuardians] = useState([]);


    const [currentImage, setCurrentImage] = useState(null); // Imagen actual del servidor
    const [preview, setPreview] = useState(null); // Previsualización de la nueva imagen
    const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña
  
    const {id} = useParams()

  const statusS = [
    {key:"Activo", label:"Activo"},
    {key:"Inactivo", label:"Inactivo"}
  ];


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
        // birthD = new Date(res.data.date_of_birth)
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
    <div className='flex justify-center items-center w-[90%] bg-primary-100/70 rounded-2xl  mx-auto mt-4 h-[82vh] overflow-scroll'>
      <div className='bg-primary-300  w-[85%] p-10 rounded-md flex flex-col h-[87%]'>
        <form onSubmit={update} className=" flex" >
          <div className="w-[200px] h-[72vh] mr-5 flex flex-col items-center ">
            <div className="flex justify-center flex-col my-4 gap-6">
              <h1 className="text-primary-900 font-bold text-3xl text-center mb-5">Alumno</h1>
                {/* Mostrar la imagen actual o la previsualización de la nueva */}
              <img
                src={preview || currentImage || 'https://via.placeholder.com/150'}
                alt="Previsualización"
                className="w-32 h-32 object-cover rounded-full"
                />
                {/* {console.log('imagen: ',currentImage)} */}
            </div>

            <div className="my-5">
            
              <Input
              label='Selecciona un archivo'
                type="file"
                onChange={handleFileChange}
                className=""
                classNames={{
                  inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
                }}
                
              />
            </div>

            {/* <label className="text-white">Estatus</label> */}
            <Select
            label="Estatus del alumno"
            placeholder=" estatus ..."
            value={status}
            defaultSelectedKeys={['Activo']}
            onChange={(e) => setStatus(e.target.value)}
            classNames={{
              
              trigger:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
            }}
            >
              {/* {console.log(status)} */}
              {statusS.map((statu)=> (
                <SelectItem key={statu.key}>{statu.label}</SelectItem>
              ))}
            </Select>

          </div>
          <div className="w-[75%] mx-auto">
            <div className="">
              <h3 className=" mb-2">Datos personales</h3>
              <Divider className="mb-3"/>
                {/* <label className="text-white">Nombre</label> */}
                <Input
                  label='Nombre del alumno'
                  defaultValue={name}
                  value={name}
                  placeholder="Nombre del alumno ..."
                  type="text"
                  onChange={ (e) => setName(e.target.value)}
                  classNames={{
                    inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70 ",
                    
                  }}
                  className="text-white"
                />
                
                {/* <label className="text-white">Correo</label> */}
                <Input
                label="Correo del alumno"
                defaultValue={email}
                value={email}
                placeholder="Correo del alumno ..."
                type="email"
                onChange={ (e) => setEmail(e.target.value)}
                className="my-2"
                classNames={{
                  inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
                }}
                />
                
                <div className=" flex justify-around">
                  <Input
                  label="Telefono del alumno"
                  defaultValue={phone}
                  value={phone}
                  placeholder="telefono del alumno ..."
                  type="tel"
                  onChange={ (e) => setPhone(e.target.value)}
                  className="my-2"
                  classNames={{
                    inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
                  }}
                  />
                  <div className=" ml-5">

                    <label className="text-primary-900 mx-1">Fecha de nacimiento</label>
                    <input
                    type='date'
                    placeholder='0000-00-00'
                    value={date_of_birth}
                    onChange={ (e) => setDate_of_birth(e.target.value)}
                    className='py-1 rounded-md my-1 px-5 bg-primary-900 text-white'
                    >
                  </input>
                  </div>
                </div>
            </div>
            
            <div>
              <h3>Datos escolares</h3>
              <Divider className="mb-3"/>
              
              <div className="flex items-center mt-2">
                <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                defaultValue={password}
                validate={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
                }}
                />
                
                <div className="text-white ml-2 flex items-center flex-col gap-2 justify-center">
                  <span className="ml-1 text-small">Mostrar</span>
                    <Checkbox
                    color="danger"
                    size="md"
                    name="Mostrar"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    >
                    </Checkbox>
                  
                  
                </div>
              </div>
                <div className=" mt-4">
                  <label className="text-primary-900 text-left">Tutor:  </label>
                  <span>{nameG}</span>
                </div>
                
                
              <Input
              label="Buscar Tutor"
                type="text"
                placeholder="Buscar por nombre o correo"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-md my-2"
                classNames={{
                  inputWrapper:"bg-primary-900 hover:bg-primary-900/70 focus:bg-primary-900/70",
                }}
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

            </div>

              <div className="w-full flex justify-end">
                <Button color='success' variant='faded' 
                className=' border-auxColors-350 px-10 text-auxColors-350 bg-transparent hover:bg-auxColors-350/80 hover:text-white hover:duration-500' 
                type='submit'>Actualizar</Button>
              </div>
          </div>
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