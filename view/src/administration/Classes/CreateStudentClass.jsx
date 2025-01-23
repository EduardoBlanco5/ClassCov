import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URICLASS = 'http://localhost:4000/classes';
const URISTUDENTS = 'http://localhost:4000/studentsSearch';

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
    console.log(classId)

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
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <h2 className="text-white flex">Inscribir Estudiante a Clase</h2>
        <form onSubmit={handleSubmit}>
          <label className="text-white flex">Buscar Estudiante:</label>
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md my-2"
          />
          {students.length > 0 && (
            <ul className="bg-white rounded-md shadow-md max-h-40 overflow-auto">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
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

          <label className="text-white flex">Clase:</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-4 py-2 rounded-md my-2"
          >
            <option value="">Selecciona una clase</option>
            {classes.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.grade} {clase.salon} 
              </option>
            ))}
          </select>

          <button type="submit" className="text-white flex bg-green-500 rounded-md p-3">
            Inscribir
          </button>
        </form>

        <div className="bg-zinc-800 max-w-md w-full rounded-md flex mt-4">
          <form onSubmit={uploadExcel}>
            <h1 className="font-bold text-white text-center text-3xl">Subir Excel de Alumnos</h1>
            <label htmlFor="excelFile" className="text-white">
              Selecciona un archivo Excel:
            </label>
            <input
              type="file"
              id="excelFile"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".xlsx,.xls"
              required
            />
            <button className="bg-blue-600 rounded-md w-20 mx-32" type="submit">
              Subir Excel
            </button>
          </form>
        </div>
      </div>
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