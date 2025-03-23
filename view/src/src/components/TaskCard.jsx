import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

import {Card, CardBody, CardFooter, Image, Button ,Input, Divider, CardHeader,
  Modal, ModalHeader,ModalContent, ModalBody,ModalFooter, useDisclosure, Form
} from "@heroui/react";

const URI = 'http://localhost:4000/task/';
const UPLOAD_URI = 'http://localhost:4000/uploadTask';
const URI_SUBJECT = 'http://localhost:4000/subject/';

const TaskCard = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedTask, setUploadedTask] = useState(null); // Para almacenar la tarea enviada
  const [message, setMessage] = useState('');

  const [subject_id, setSubject_id] = useState('');
  const [subject_name, setSubject_name] = useState('');

  const { user } = useContext(AuthContext);
  const student_id = localStorage.getItem('student_id');
  const role = user?.role || localStorage.getItem('role');

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = useState("md");

  useEffect(() => {
      getTaskById();
      checkTaskSubmission();
      
  }, []);

  useEffect(() => {
    if (subject_id) {
      getSubjectById(subject_id);
    }
    
  }, [subject_id]);
  

  const getSubjectById = async (subject_id) => {
    const res = await axios.get(URI_SUBJECT + subject_id);
    setSubject_name(res.data.name);
  };

  //Información de la tarea dejada por el maestro
  const getTaskById = async () => {
      try {
          const res = await axios.get(`http://localhost:4000/task/${id}`);
          setTitle(res.data.title);
          setDescription(res.data.description);
          setDeliveryDate(res.data.deliveryDate);
          setFile(res.data.file);
          setSubject_id(res.data.subject_id);
          console.log(res.data.file)
          
      } catch (error) {
          console.error('Error al obtener la tarea:', error);
      }
  };

  const checkTaskSubmission = async () => {
    let studentIdToCheck = student_id;
  
    // Si el usuario es tutor, obtenemos el id del estudiante asociado
    if (role === 'guardian') {
      studentIdToCheck = localStorage.getItem('student_id'); // Asegúrate de que está guardado en el localStorage
    }
  
    if (!studentIdToCheck) return;
  
    try {
      const res = await axios.get('http://localhost:4000/uptask', {
        params: { task_id: id, student_id: studentIdToCheck },
      });
      setUploadedTask(res.data); // Si existe, almacenamos los datos
    } catch (error) {
      if (error.response?.status === 404) {
        setUploadedTask(null); // No hay tarea enviada
      } else {
        console.error('Error al verificar tarea:', error);
      }
    }
  };

  const handleUpload = async (e) => {
      e.preventDefault();
      if (!file) {
          setMessage('Por favor selecciona un archivo para subir.');
          return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('task_id', id);
      formData.append('student_id', student_id);
      formData.append('subject_id', subject_id);

      try {
          await axios.post('http://localhost:4000/uploadTask', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
          setMessage('Archivo subido exitosamente.');
          checkTaskSubmission(); // Actualizamos el estado después de subir
      } catch (error) {
          console.error('Error al subir archivo:', error);
          setMessage('Error al subir el archivo. Intenta nuevamente.');
      }
  };

   // Función para verificar si el archivo es imagen o pdf
  // const isImage = (fileType) => fileType.match(/.(jpg|jpeg|png|gif)$/i);
  const isImage = (fileType) => new RegExp(/.(jpg|jpeg|png|gif)/i)
  const isPdf = (fileType) => fileType === 'application/pdf';

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  return (
    <div className="flex justify-center w-10/12 h-auto max-h-[80%] mx-auto mt-8">
        
      <Card className='w-full h-full'>
          <CardHeader className='bg-primary-200'>
            <div className='w-full' >  
              <h1 className=' text-2xl text-secondary-100'>Título: {title}</h1>
              <div className=' w-[97%]  flex justify-between'>
                <p className=' text-small text-default-600 hover:text-secondary-900 hover:duration-500'>Materia: {subject_name}</p>
                {uploadedTask != null? uploadedTask.qualification ? (
                        <p className="text-green-500 font-semibold">
                            Calificación: {uploadedTask.qualification} / 10
                        </p>
                    ):( 
                        <p className='text-yellow-500 font-semibold'>
                          Pendiente
                        </p>
                    ):(<p className='text-yellow-500 font-semibold'>
                        0 / 10
                    </p>)
                  }
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div>
              <Card>
                <CardHeader className='flex flex-col'>
                  <div className=' w-full flex justify-end absolute right-4'>
                    <p>Fecha de entrega: {deliveryDate}</p>
                  </div>
                  <div className='w-full'>
                    <h2>Descripcion : </h2>
                  </div>
                </CardHeader>
                <CardBody className=' w-[90%] mx-auto overflow-scroll'>
                  <p>{description}</p>
                </CardBody>
              </Card>
            </div>
              
              {/* Mostrar el archivo de la tarea si existe */}
              {role === 'teacher' && (
                <>
                  {file && (
                    <>
                    
                      {isImage(file) ? (
                        <div>
                        <Button onPress={()=> handleOpen('md')} >
                          Ver archivo
                        </Button>
                        
                        <Modal isOpen={isOpen} size='md' onClose={onClose}>
                          <ModalContent>
                            {(onClose)=>(
                              <>
                              <ModalHeader className="flex flex-col gap-1">
                                Tarea 
                              </ModalHeader>
                              <ModalBody>
                                <Image
                                  src={file}
                                  alt="Tarea"
                                  className="max-w-full max-h-96"
                                  width={250}
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                  Cerrar
                                </Button>
                              </ModalFooter>
                              </>
                            )}
                          </ModalContent>

                        </Modal>
                        
                      </div>



                      ) : isPdf(file) ? (
                        <div>
                            <Button onPress={()=> handleOpen('5xl')}  >
                              Ver archivo
                            </Button>
                            {/* // Mostrar imagen */}
                            <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
                              <ModalContent>
                                {(onClose)=>(
                                  <>
                                  <ModalHeader className="flex flex-col gap-1">
                                    Tarea
                                  </ModalHeader>
                                  <ModalBody>
                                  {/* // Mostrar PDF */}
                                    <iframe
                                      src={file}
                                      width="100%"
                                      height="400px"
                                      title="Archivo PDF"
                                      className="my-4"
                                    />
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                      Cerrar
                                    </Button>
                                  </ModalFooter>
                                  </>
                                )}
                              </ModalContent>

                            </Modal>
                              
                          </div>

                        
                      ) : (
                        <div>
                          <p className="text-yellow-500">Para ver el archivo, presiona el botón</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
          </CardBody>

          {/* El botón de ver archivo siempre aparece */}
          {file && (
            <div className='w-1/3 mx-auto mb-3'>
              <Button 
              variant='ghost'
              color='warning'
              className='w-full bg'>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" "
                >
                  Ver archivo
                </a>
              </Button>
            </div>
          )}
    
          {role === 'student' && (
            <div className="mt-4">
              
            
              {uploadedTask ? (
                <div className=" flex flex-col mt-4">
                  <div className=' w-[95%] mx-auto flex justify-between'>
                    <p className="text-green-500">Tarea Enviada</p>
                    
                  </div>
                  <div className=" p-4  bg-primary-200 flex justify-end">
                    {console.log(uploadedTask.file)}
                    {uploadedTask.file.endsWith('.jpg') ||
                    uploadedTask.file.endsWith('.jpeg') ||
                    uploadedTask.file.endsWith('.png') ? (
                      <div>
                        <Button onPress={()=> handleOpen('md')} variant='flat' 
                        className=' border-primary-500 bg-primary-500 hover:duration-500
                        hover:bg-primary-50 hover:text-white w-[300px] hover:scale-105
                        ' >
                          Ver archivo
                        </Button>
                        // Mostrar imagen
                        <Modal isOpen={isOpen} size='md' onClose={onClose}>
                          <ModalContent>
                            {(onClose)=>(
                              <>
                              <ModalHeader className="flex flex-col gap-1">
                                Tarea Enviada
                              </ModalHeader>
                              <ModalBody>
                                <Image
                                  src={uploadedTask.file}
                                  alt="Tarea subida"
                                  className="max-w-full max-h-96"
                                  width={250}
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                  Cerrar
                                </Button>
                              </ModalFooter>
                              </>
                            )}
                          </ModalContent>

                        </Modal>
                      </div>
                      
                    ) : uploadedTask.file.endsWith('.pdf') ? (
                      <div>
                        
                        <Button onPress={()=> handleOpen('5xl')} variant='flat' 
                        className=' border-primary-500 bg-primary-500 hover:duration-500
                        hover:bg-primary-50 hover:text-white w-[300px] hover:scale-105
                        '  >
                          Ver archivo
                        </Button>
                        
                        {/* // Mostrar imagen */}
                        <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
                          <ModalContent>
                            {(onClose)=>(
                              <>
                              <ModalHeader className="flex flex-col gap-1">
                                Tarea Enviada
                              </ModalHeader>
                              <ModalBody>
                              {/* // Mostrar PDF */}
                                <iframe
                                  src={uploadedTask.file}
                                  title="Tarea subida"
                                  className="w-full h-96 border-0"
                                ></iframe>
                              </ModalBody>
                              <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                  Cerrar
                                </Button>
                              </ModalFooter>
                              </>
                            )}
                          </ModalContent>

                        </Modal>
                          
                      </div>
                    ) : (
                      // Mostrar texto como fallback
                      <p>Tipo de archivo no soportado para vista previa. Descárgalo para verlo.</p>
                    )}
                  </div>
                  
                </div>
              ) : (
                <>
                <div className='w-full'>

                  <CardFooter className='w-full  flex flex-col'>

                    <h3 className="w-full text-lg font-bold">Sube tu tarea:</h3>
                    <Divider/>
                    <Form onSubmit={handleUpload} className='w-full mt-5  '>
                      <div className='w-full flex items-center gap-3 justify-between'>
                        <Input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          classNames={{
                            label:"text-white",
                            inputWrapper:[
                              "shadow-xl",
                              "bg-primary-200",
                              "focus-within:!bg-priamry-200",
                            ],
                            innerWrapper:'bg-transparent ',
                            mainWrapper:"text-white ",
                            
                          }}
                          className=" w-[80%] cursor-pointer
                          text-white 
                          "
                        />
                        <Button
                          type="submit"
                          variant='flat'
                          className=" bg-primary-100 text-white hover:text-primary-700 hover:scale-105"
                        >
                          Subir archivo
                        </Button>
                      </div>
                    </Form>
                    {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
                  </CardFooter>
                </div>
                </>
              )}
            </div>
          )}
      </Card>
        

      {/* Mostrar vista previa de la tarea subida por el alumno para el tutor */}
      {role === 'guardian' && (
        <div className="ml-5">
          {uploadedTask ? (
            <Card>
              <CardHeader className='bg-secondary-200'>
                  <p className="text-white">El alumno ha entregado la tarea</p>

              </CardHeader>
              <CardBody>
                <div>
                  {uploadedTask.file.endsWith('.jpg') ||
                        uploadedTask.file.endsWith('.jpeg') ||
                        uploadedTask.file.endsWith('.png') ? (
                          <div>
                            <Button onPress={()=> handleOpen('md')} variant='flat' 
                            className=' border-primary-500 bg-primary-500 hover:duration-500
                            hover:bg-primary-50 hover:text-white w-[300px] hover:scale-105
                            ' >
                              Ver archivo
                            </Button>
                            
                            <Modal isOpen={isOpen} size='md' onClose={onClose}>
                              <ModalContent>
                                {(onClose)=>(
                                  <>
                                  <ModalHeader className="flex flex-col gap-1">
                                    Tarea Enviada
                                  </ModalHeader>
                                  <ModalBody>
                                    <Image
                                      src={uploadedTask.file}
                                      alt="Tarea subida"
                                      className="max-w-full max-h-96"
                                      width={250}
                                    />
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                      Cerrar
                                    </Button>
                                  </ModalFooter>
                                  </>
                                )}
                              </ModalContent>

                            </Modal>
                          </div>
                          
                        ) : uploadedTask.file.endsWith('.pdf') ? (
                          <div>
                            
                            <Button onPress={()=> handleOpen('5xl')} variant='flat' 
                            className=' border-primary-500 bg-primary-500 hover:duration-500
                            hover:bg-primary-50 hover:text-white w-[300px] hover:scale-105
                            '  >
                              Ver archivo
                            </Button>
                            
                            {/* // Mostrar imagen */}
                            <Modal isOpen={isOpen} size='5xl' onClose={onClose}>
                              <ModalContent>
                                {(onClose)=>(
                                  <>
                                  <ModalHeader className="flex flex-col gap-1">
                                    Tarea Enviada
                                  </ModalHeader>
                                  <ModalBody>
                                  {/* // Mostrar PDF */}
                                    <iframe
                                      src={uploadedTask.file}
                                      title="Tarea subida"
                                      className="w-full h-96 border-0"
                                    ></iframe>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                      Cerrar
                                    </Button>
                                  </ModalFooter>
                                  </>
                                )}
                              </ModalContent>

                            </Modal>
                              
                          </div>
                        ) : (
                          // Mostrar texto como fallback
                          <p>Tipo de archivo no soportado para vista previa. Descárgalo para verlo.</p>
                        )}
                  {/* {uploadedTask.file.endsWith('.jpg') ||
                  uploadedTask.file.endsWith('.jpeg') ||
                  uploadedTask.file.endsWith('.png') ? (
                    <img
                      src={uploadedTask.file}
                      alt="Tarea subida"
                      className="max-w-full max-h-96"
                    />
                  ) : uploadedTask.file.endsWith('.pdf') ? (
                    <iframe
                      src={uploadedTask.file}
                      title="Tarea subida"
                      className="w-full h-96 border-0"
                    ></iframe>
                  ) : (
                    <p>Tipo de archivo no soportado para vista previa.</p>
                  )} */}
                  {/* Botón para ver tarea en nueva pestaña */}
                  {/* <a
                    href={uploadedTask.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded block text-center mt-2"
                  >
                    Ver tarea del alumno
                  </a> */}
                </div>

              </CardBody>
            </Card>
          ) : (
            <Card className='min-w-[200px]'>
              <CardHeader className='bg-secondary-200'>
              <p className="text-red-500">tarea sin entregar</p>

              </CardHeader>
              <CardBody>
                
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
