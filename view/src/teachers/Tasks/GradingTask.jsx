import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { Card, Divider,  CardHeader, CardBody, CardFooter, 
    Button, Tabs, Tab, Table, TableBody, TableHeader, TableColumn,TableRow,TableCell ,
    Modal,ModalContent,ModalHeader, ModalBody,ModalFooter,useDisclosure, Image, Input
} from '@heroui/react';

import {parseDate, getLocalTimeZone, today, now} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const URI = 'http://localhost:4000/task/';
const UP_URI = 'http://localhost:4000/UpTasks/';
const URI_SUBJECT = 'http://localhost:4000/subject/';

function GradingTask() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(today(getLocalTimeZone()))

    const [file, setFile] = useState(null);
    const [subject_id, setSubject_id] = useState('');
    const [averageGrade, setAverageGrade] = useState(null);
    let formatter = useDateFormatter({dateStyle: "full"});

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [size, setSize] = useState("md");

    

    const [upTasks, setUpTasks] = useState([]);
    
    const { user } = useContext(AuthContext);
    const student_id = localStorage.getItem('student_id');
    const role = user?.role || localStorage.getItem('role');

    const [subject_name, setSubject_name] = useState('');

    useEffect(() => {
        getTaskById();
        getUpTask();
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

    const getTaskById = async () => {
        try {
            const res = await axios.get(URI + id);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setDeliveryDate(parseDate(res.data.deliveryDate));
            setFile(res.data.file);
            setSubject_id(res.data.subject_id);
        } catch (error) {
            console.error('Error al obtener la tarea:', error);
        }
    };

    const getUpTask = async () => {
        try {
            const res = await axios.get(`${UP_URI}${id}`);
            // console.log(res.data[0].file)
            // let url1 = res.data[0].file
            // console.log(url1.replace('http://localhost:4000/',''))
            if (Array.isArray(res.data)) {
                setUpTasks(res.data);
            

            } else {
                setUpTasks([]);
            }
        } catch (error) {
            console.error('Error al obtener las tareas enviadas:', error);
        }
    };
  
    const handleGrade = async (taskId, qualification) => {
        if (!qualification || isNaN(parseFloat(qualification))) {
            alert('Introduce una calificación válida.');
            return;
        }
    
        try {
            await axios.put(`${UP_URI}grade/${taskId}`, { qualification: parseFloat(qualification) });
            alert('Calificación guardada y promedio actualizado exitosamente.');
            getUpTask();
        } catch (error) {
            console.error('Error al calificar la tarea:', error);
            alert('Hubo un error al guardar la calificación.');
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
        <div className="w-full h-[85vh] overflow-scroll">
            <div className="w-11/12 mx-auto  mt-6 bg-primary-300/90 p-4 rounded-xl mb-4">
                <div className="flex justify-between">
                    <h1 className='text-xl text-primary-900 font-semibold'
                    >Título: <span className='text-lg font-light text-primary-700 ml-2 '>{title}</span></h1>
                    <p>Fecha de entrega: {deliveryDate ? formatter.format(deliveryDate.toDate(getLocalTimeZone())) : "--"}</p>
                </div>
                <p className='text-lg text-primary-700 font-semibold'>Materia: 
                    <span className="text-md font-light text-primary-700 ml-2">{subject_name}</span> 
                </p>

                <div className='flex flex-col mb-6'>
                    <p className='text-lg text-primary-700 font-semibold'>Descripción: </p>
                    <span className="text-md font-light text-primary-700 ml-5 w-[90%] text-wrap">{description}</span> 
                </div>
                
                
                {file ? (
                    file.match(/.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
                    ) : (
                        <div className="flex justify-center">

                            <p className="text-yellow-900">Para mostrar el archivo, presiona el botón</p>
                        </div>

                    
                    )
                ) : null}
                {file && (
                    <div className="w-11/12 mx-auto">

                        <a 
                        href={file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary-200 text-white px-4 py-2 rounded block text-center mt-2 capitalize"
                        >
                        Ver Archivo o descargar archivo
                        </a>
                    </div>

                )}
            </div>
        <div>
        <Divider className='w-11/12 mx-auto bg-primary-900 h-1 rounded-full'/>
            <div className="w-11/12 mx-auto mt-5">
                {upTasks.length > 0 ? (
                    <Table aria-label='Tabla tareas entregadas'
                        isHeaderSticky='true'
                        // selectionMode="single"
                        color='secondary'
                        classNames={{
                            wrapper:"bg-white/70 rounded " ,
                            th:"bg-primary-900/90 text-white hover:bg-primary-900 hover:duration-250",
                            // td: "hover:bg-primary-900 hover:duration-250 rounded-lg", 
                        }}
                    >
                            <TableHeader>
                                <TableColumn>Alumno</TableColumn>
                                <TableColumn>Archivo</TableColumn>
                                <TableColumn>Califacion</TableColumn>

                            </TableHeader>
                            <TableBody>
                                { upTasks.map((UpTask) => (
                                    <TableRow key={UpTask.id}>
                                        <TableCell>{UpTask.studentName || 'Sin nombre'}</TableCell>
                                        <TableCell>
                                            {UpTask.file && (
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
                                                            {console.log(UpTask.file)}
                                                        <Image
                                                            src={UpTask.file}
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
                                                                src={UpTask.file}
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

                                        </TableCell>
                                        <TableCell>
                                        {UpTask.qualification ? (
                                            <p 
                                            className={UpTask.qualification < 6 ? "text-red-800 font-semibold" 
                                                :  "text-green-500 font-semibold"}
                                            >
                                                Calificación: {UpTask.qualification}</p>
                                            ) : (
                                                <>
                                                <div className="flex items-center">

                                                    <Input
                                                        type="number"
                                                        placeholder="Calificación"
                                                        className="my-2 p-1 rounded"
                                                        onChange={(e) => (UpTask.qualification = e.target.value)}
                                                    />
                                                    <Button
                                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                                        onPress={() => handleGrade(UpTask.id, UpTask.qualification)}
                                                    >
                                                        Calificar
                                                    </Button>
                                                </div>
                                                </>
                                            )}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                    </Table>
                        // <tr key={UpTask.id}>
                        //     <header className="w-52 bg-slate-500 hover:bg-slate-700 rounded-md my-2 p-4">
                        //         <h1 className="text-2xl font-bold w-full my-2">
                        //             {UpTask.studentName || 'Sin nombre'}
                        //         </h1>
                        //         <p className="text-black font-semibold my-1">Tarea ID: {UpTask.task_id}</p>
                        //         {UpTask.file ? (
                        //             UpTask.file.match(/.(jpg|jpeg|png|gif)$/i) ? (
                        //                 <img src={UpTask.file} className="w-20 h-20 object-cover rounded-full my-2" />
                        //             ) : (
                        //                 <p className="text-yellow-500">Para mostrar el trabajo, presiona el botón</p>
                        //             )
                        //         ) : null}
                        //         {UpTask.file && (
                        //             <a 
                        //                 href={UpTask.file} 
                        //                 target="_blank" 
                        //                 rel="noopener noreferrer"
                        //                 className="bg-blue-900 text-white px-4 py-2 rounded block text-center mt-2"
                        //             >
                        //                 Ver Archivo
                        //             </a>
                        //         )}
                                // {UpTask.qualification ? (
                                //     <p className="text-green-500 font-semibold">Calificación: {UpTask.qualification}</p>
                                // ) : (
                                //     <>
                                //         <input
                                //             type="number"
                                //             placeholder="Calificación"
                                //             className="my-2 p-1 rounded"
                                //             onChange={(e) => (UpTask.qualification = e.target.value)}
                                //         />
                                //         <button
                                //             className="bg-green-500 text-white px-4 py-2 rounded"
                                //             onClick={() => handleGrade(UpTask.id, UpTask.qualification)}
                                //         >
                                //             Calificar
                                //         </button>
                                //     </>
                                // )}
                        //     </header>
                        // </tr>
                    
                ) : (
                    <p>No hay tareas enviadas para esta tarea.</p>
                )}
            </div>
        </div>
      </div>
    );
  };

export default GradingTask;
