import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader,CardFooter, Button , Input, DatePicker, Checkbox,Select, SelectItem} from '@heroui/react'
import {parseDate, getLocalTimeZone, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/teacher/';

function UpdatedTeacher() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [date_of_birth, setDate_of_birth] = useState('');
  const [hire_date, setHire_date] = useState('');
  const [valueDate, setValueDate] = useState(today());
  const [valueAdm, setValueAdm] = useState(today());
  let formatter = useDateFormatter({dateStyle: "full"});
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [file, setFile] = useState(null);
  
  const [currentImage, setCurrentImage] = useState(null); // Imagen actual del servidor
  const [preview, setPreview] = useState(null); // Previsualización de la nueva imagen
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña

 const statusId = [
      {key:"activo", label:"Activo"},
      {key:"inactivo", label:"Inactivo"}
    ]

  const { id } = useParams();

  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    // setValueDate(valueDate)
    setDate_of_birth(valueDate.toString())
    formData.append("date_of_birth", valueDate.toString());
    // setValueAdm(valueAdm)
    setHire_date(valueAdm.toString())
    formData.append("hire_date", valueAdm.toString());
    formData.append("role", role);
    formData.append("status", status);


   
    // Solo agregar el archivo si se seleccionó uno nuevo
    if (file instanceof File) {
      formData.append("file", file);
    }

    // console.log(formData)

    try {
      await axios.put(`${URI}${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/ShowTeachers");
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  useEffect(() => {
    getTeacherById();
    
  }, []);

  const getTeacherById = async () => {
    const res = await axios.get(URI + id);
    setName(res.data.name);
    setEmail(res.data.email);
    setPhone(res.data.phone);
    setPassword(res.data.password);
    setDate_of_birth(res.data.date_of_birth);
    // console.log(res.data.date_of_birth)
    setValueDate(parseDate(res.data.date_of_birth))
    setHire_date(res.data.hire_date);
    setValueAdm(parseDate(res.data.hire_date))
    setRole(res.data.role);
    setStatus(res.data.status);
    setFile(res.data.file);

    // Si hay una imagen, establecerla correctamente
    if (res.data.file) {
      setCurrentImage(res.data.file);
    } else {
      setCurrentImage(null); // Si no tiene imagen, establecer como null
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Actualizar la previsualización solo si se selecciona un nuevo archivo
    if (selectedFile) {
      const filePreview = URL.createObjectURL(selectedFile);
      setPreview(filePreview);
    }
  };

  return (
    <div className='flex justify-center gap-1'>
      <div className='w-[60%] p-10 rounded-md flex'>
        <Card className='bg-primary-300 w-full'>
          <CardHeader className='bg-primary-900 flex flex-col'>
            <h1 className='font-bold text-white text-center text-3xl'>Profesor</h1>
            <div className="flex justify-center my-4">
              {/* Mostrar la imagen actual o la previsualización de la nueva */}
              <img
                src={preview || currentImage || 'https://via.placeholder.com/150'}
                alt="Previsualización"
                className="w-32 h-32 object-cover rounded-full"
                />
                {/* {console.log('imagen: ',currentImage)} */}
            </div>
          </CardHeader>
          <form onSubmit={update}>
            
          <CardBody>

              <Input
                    
                    type='text'
                    label="Nombre del Profesor"
                    placeholder='Digita el nombre ... '
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    classNames={{
                      label: "text-white/90",
                      mainWrapper:"",
                      inputWrapper:[
                        "bg-primary-500 text-primary-900",
                        "hover:bg-primary-500/70",
                        "group-data-[focus=true]:bg-primary-900/50",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                      ],
                      innerWrapper:"bg-transparent",
                      input:[
                        "bg-transparent",
                        "text-primary-700/90 ",
                        "placeholder:text-primary-700/90 ",
                      ],
                    }}
                    className='mb-2'
                    />

                  <Input
                    type='text'
                    label="Correo del Profesor"
                    placeholder='Digita el correo ... '
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    classNames={{
                      label: "text-white/90",
                      mainWrapper:"",
                      inputWrapper:[
                        "bg-primary-500 text-primary-900",
                        "hover:bg-primary-500/70",
                        "group-data-[focus=true]:bg-primary-900/50",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                      ],
                      innerWrapper:"bg-transparent",
                      input:[
                        "bg-transparent",
                        "text-primary-700/90 ",
                        "placeholder:text-primary-700/90 ",
                      ],
                    }}
                    className='mb-2'
                    />

                  <Input
                    type='text'
                    label="Teléfono "
                    placeholder='Digita el telefono ... '
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    classNames={{
                      label: "text-white/90",
                      mainWrapper:"",
                      inputWrapper:[
                        "bg-primary-500 text-primary-900",
                        "hover:bg-primary-500/70",
                        "group-data-[focus=true]:bg-primary-900/50",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                      ],
                      innerWrapper:"bg-transparent",
                      input:[
                        "bg-transparent",
                        "text-primary-700/90 ",
                        "placeholder:text-primary-700/90 ",
                      ],
                    }}
                    className='mb-2'
                    />
              <div className=" flex ">

                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="password***"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  classNames={{
                    label: "text-white/90",
                    mainWrapper:"",
                    inputWrapper:[
                      "bg-primary-500 text-primary-900",
                      "hover:bg-primary-500/70",
                      "group-data-[focus=true]:bg-primary-900/50",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                    ],
                    innerWrapper:"bg-transparent",
                    input:[
                      "bg-transparent",
                      "text-primary-700/90 ",
                      "placeholder:text-primary-700/90 ",
                    ],
                  }}
                  className='mb-2'
                />
                <div className=" flex justify-center items-center flex-col mx-5">
                  <label>
                    Mostrar
                  </label>
                <Checkbox
                
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                </div>
              </div>
              <div className='w-full flex flex-col items-end'>
                {/* {console.log(parseDate(valueDate.toString()))} */}
                    <DatePicker
                    name='dateOfBirth'
                    label='Fecha de nacimiento'
                    labelPlacement='inside'
                    showMonthAndYearPickers
                    value={valueDate}
                    onChange={setValueDate}
                    variant='underlined'
                    className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                    
                    />
                    <p className="text-default-500 text-sm">
                      {valueDate ? formatter.format(valueDate.toDate(getLocalTimeZone())) : "--"}
                    </p>
                    
              </div>
              <div className=' w-full flex flex-col items-end mb-2'>
                {/* {console.log(date_of_birth)} */}
                    <DatePicker
                    name='hireDate'
                    label='Fecha de Admisión'
                    labelPlacement='inside'
                    showMonthAndYearPickers
                    value={valueAdm}
                    onChange={setValueAdm}
                    variant='underlined'
                    className=' bg-primary-500 rounded-t-xl hover:border-primary-900 group-data-[focus=true]:bg-primary-900/50'
                    />
                    <p className="text-default-500 text-sm">
                      {valueAdm ? formatter.format(valueAdm.toDate(getLocalTimeZone())) : "--"}
                    </p>
                    
                  </div>

                  <Select
                  label="Estatus"
                  classNames={{
                    trigger:[
                      "bg-primary-500"
                    ]
                  }}
                  defaultSelectedKeys={[status]}
                  onChange={(e) => setStatus(e.target.value)}
                  >
                      {statusId.map((statu)=>(
                        <SelectItem key={statu.key}>
                          {statu.label}
                        </SelectItem>
                      ))}
                  </Select>

                  <Input
                  label="Foto de Perfil"
                  htmlFor='file'
                  type='file'
                  id="file"
                  onChange={handleFileChange}
                  classNames={{
                    label: "text-white/90",
                    mainWrapper:"",
                    inputWrapper:[
                      "bg-primary-500 text-primary-900",
                      "hover:bg-primary-500/70",
                      "group-data-[focus=true]:bg-primary-900/50",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                    ],
                    innerWrapper:"bg-transparent",
                    input:[
                      "bg-transparent",
                      "text-primary-700/90 ",
                      "placeholder:text-primary-700/90 ",
                    ],
                  }}
                  className='my-2'
                  />
          </CardBody>
          <CardFooter>
            <Button 
              variant='bordered'
              className='bg-primary-900/70 border-primary-900 px-10
              hover:bg-primary-600/70 hover:border-primary-600 hover:text-white hover:duration-500' 
              type='submit'
              >
                Actualizar
            </Button>
          </CardFooter>

            {/* <label className="text-white">Fecha de nacimiento</label>
            <input
              type="date"
              value={date_of_birth}
              onChange={(e) => setDate_of_birth(e.target.value)}
              className="w-full px-2 py-2 rounded-md my-2"
            ></input>

            <label className="text-white">Fecha de contrato</label>
            <input
              type="date"
              value={hire_date}
              onChange={(e) => setHire_date(e.target.value)}
              className="w-full px-2 py-2 rounded-md my-2"
            ></input> */}

            {/* <label className="text-white">Estatus</label>
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
            </select> */}
{/* 
            <label className="text-white">Selecciona un archivo:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-2 py-2 rounded-md my-2"
            /> */}

            {/* <button
              className="bg-green-600 hover:bg-green-800 text-white rounded-md w-full py-2 mt-4"
              type="submit"
            >
              Actualizar
            </button> */}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default UpdatedTeacher;
