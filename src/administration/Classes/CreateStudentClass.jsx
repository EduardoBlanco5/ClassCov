import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {Button,Input,
  Card, CardBody, Image, Slider, Form,
  CardHeader, Select, SelectItem,
  Divider, Avatar} from "@heroui/react";

import { FilePlus2,UserRoundPlus , Search} from 'lucide-react';

const URICLASS = 'http://localhost:4000/classes';
const URISTUDENTS = 'http://localhost:4000/studentsSearch';

const classItems = [
  
]

const CreateStudentClass = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classId, setClassId] = useState('');
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(URICLASS);
        setClasses(response.data);
      } catch (error) {
        console.error('Error al obtener clases:', error);
      }
    };

    fetchClasses();
    console.log(selectedStudent)

  }, []);

  const fetchStudents = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        setStudents([]);
        return;
      }

      try {
        const response = await axios.get(`${URISTUDENTS}?search=${searchTerm}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error al buscar estudiantes:', error);
      }
    },
    [setStudents]
  );

  const debounceFetchStudents = useCallback(
    debounce((term) => fetchStudents(term), 500),
    [fetchStudents]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceFetchStudents(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !classId) {
      alert('Selecciona un estudiante y una clase.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/studentClass', {
        student_id: selectedStudent,
        class_id: classId,
      });
      alert('Estudiante inscrito en la clase correctamente');
      navigate('/ShowStudentsClass');
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      alert('Hubo un problema al inscribir el estudiante');
    }
  };

  const uploadExcel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:4000/studentClass-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Alumnos importados a la clase correctamente');
    } catch (error) {
      console.error('Error al subir el archivo Excel:', error);
      alert('Error al subir el archivo');
    }
  };

  return (
    <div className="w-[100vw] max-h-[82vh] h-auto mt-6 flex  justify-center ">
      <Card className="max-w-[1000px] w-[600px] flex " isBlurred>
        <div className='bg-secondary-200 justify-center flex-col  w-full px-10 py-6 rounded-md flex'>

          <Form onSubmit={handleSubmit} className=' w-full'>
            <CardHeader className=' flex gap-3 justify-center'>
            <UserRoundPlus className=" text-white w-12 h-12" />
              <h2 className="text-white flex">Inscribir Estudiante a Clase</h2>
            </CardHeader>
            {/* <label className="text-white flex">Buscar Estudiante:</label> */}
            <Input
              // isClearable
              classNames={{
                label: "text-primary-900 dark:text-white/90 my-4 ",
                input: [
                  "bg-transparent", 
                  " text-primary-900 dark:text-white/90",
                  " placeholder:text-secondary-800/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent mt-[20px] text-primary-900",
                inputWrapper: [
                  "shadow-xl py-4 ",
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focus=true]:bg-default-200/50",
                  "dark:group-data-[focus=true]:bg-default/60",
                  "!cursor-text text-red",
                ],
              }}
              label="Buscar por nombre o correo"
              placeholder="Estudiante ..."
              radius="lg"
              startContent={
                <Search className="text-primary-900/50  dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                
              }
              value={searchTerm}
              onChange={handleSearchChange}
              
            />
            {students.length > 0 && (
              <ul className="bg-white rounded-md shadow-md max-h-40 overflow-auto">
                {students.map((student) => (
                  <li
                    key={student.id}
                    className="px-4 py-4 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setSearchTerm(`${student.name} (${student.email})`);
                      setStudents([]);
                    }}
                  >
                    {student.name} ({student.email})
                  </li>
                ))}
              </ul>
            )}

            <label className="text-white flex mt-4 ">Clase:</label>
            <Select
              label="Selecciona la clase"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              variant='underlined'
              className="w-full  px-4 mb-5  text-white "
            >
              {classes.map((clase) => (
                <SelectItem
                className='data-[selectable=true]:focus:bg-primary-500 
                  text-secondary-900 
                  data-[hover=true]:bg-primary-100
                  data-[hover=true]:text-primary-500 
                  data-[pressed=true]:opacity-95
                  data-[focus-visible=true]:ring-primary-300'
                
                key={clase.id} >
                  {clase.grade + clase.salon} 
                </SelectItem>
              ))}
            </Select>

            <Button type="submit" 
            className="
            text-white mx-auto 
            w-[200px] bg-secondary-700 
            rounded-md p-3 duration-500
            hover:bg-primary-100
            hover:shadow-sm
            hover:shadow-primary-900
            hover:scale-110
          ">
              Inscribir
            </Button>
          </Form>
              <Divider className=' bg-white w-full my-6'/>
          <Card isBlurred className=" bg-slate-900/50 max-w-md w-full flex mx-auto mt-4">
            <Form onSubmit={uploadExcel}>
              <CardHeader>
              <h1 className="font-bold text-white text-center text-2xl">Subir Excel de Alumnos</h1>
              </CardHeader>
              
              <CardBody className=' w-11/12 mx-auto'>

              <Input
                type='file'
                label='Selecciona el Archivo Excel'
                id="excelFile"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx,.xls"
                required
                classNames={{
                  label: "text-primary-900 dark:text-white/90 my-4 ",
                  input: [
                    "bg-transparent ", 
                    " text-primary-900 dark:text-white/90",
                    " placeholder:text-secondary-800/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent mt-[20px] text-primary-900",
                  inputWrapper: [
                    "shadow-xl py-4 ",
                    "bg-primary-200/90",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-primary-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-primary-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text ",
                  ],
                }}
              />
              </CardBody>
              
              <Button type="submit" 
                className="
                text-white mx-auto my-2
                w-[200px] bg-secondary-700 
                rounded-md p-3 duration-500
                hover:bg-primary-100
                hover:shadow-sm
                hover:shadow-primary-900
                hover:scale-110
              ">
                  Subir Excel
            </Button>
            </Form>
          </Card>
        </div>
      </Card>
    </div>
  );
};

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default CreateStudentClass;