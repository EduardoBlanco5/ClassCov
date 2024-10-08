import {BrowserRouter, Routes, Route} from 'react-router-dom';

import ShowTask from "./teachers/Tasks/ShowTask";
import CreateTask from "./teachers/Tasks/CreateTask"
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UpdatedTask from './teachers/Tasks/updatedTask';
import TaskCard from './components/TaskCard';
import CreateAnnouncements from './teachers/Announcements/CreateAnnouncements';
import UpdatedAnnouncement from './teachers/Announcements/UpdatedAnnouncement';
import ShowAnnouncements from './teachers/Announcements/ShowAnnouncements';
import AnnouncementCard from './components/AnnouncementCard';
import Login from './pages/Login';
import CreateTeacher from './administration/Professor/CreateTeacher';
import CreateGuardian from './administration/Guardians/CreateGuardian';
import CreateStudent from './administration/Students/CreateStudent';
import CreateAdmin from './administration/CreateAdmin';
import CreateClass from './administration/Classes/CreateClass';
import UpdateClass from './administration/Classes/UpdateClass';
import ShowClass from './administration/Classes/ShowClass';
import ClassCard from './components/ClassCard';
import ProfileAdmin from './components/Profiles/ProfileAdmin';
import ShowAdmins from './administration/ShowAdmins';
import UpdatedAdmin from './administration/UpdatedAdmin';
import UpdatedGuardian from './administration/Guardians/UpdatedGuardian';
import ShowGuardians from './administration/Guardians/ShowGuardians';
import ShowTeachers from './administration/Professor/ShowTeachers';
import UpdatedTeacher from './administration/Professor/UpdatedTeacher';
import ShowStudents from './administration/Students/ShowStudents';
import UpdatedStudent from './administration/Students/UpdatedStudent';
import ProfileGuardian from './components/Profiles/ProfileGuardian';
import ProfileTeacher from './components/Profiles/ProfileTeacher';
import ProfileStudent from './components/Profiles/ProfileStudent';
import ClassTasks from './administration/Classes/ClassTasks';
import ClassAnnouncements from './administration/Classes/ClassAnnouncements';
import UpTask from './administration/Students/UpTask';
import ShowUpTasks from './administration/Students/ShowUpTasks';


function App() {


  return (
    <>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>

          <Route path='/Login' element={<Login/>}>Login</Route>
          
          
          <Route path='/showTasks' element={<ShowTask/>}>Tareas</Route>
          <Route path='/createTask' element={<CreateTask/>}>Crear Tarea</Route>
          <Route path='/' element={<Home/>}>Inicio</Route>
          <Route path='/UpdatedTask/:id' element={<UpdatedTask/>}>Actualizar</Route>
          <Route path='/TaskCard/:id' element={<TaskCard/>}>Task Cards</Route>

          <Route path='/CreateAnnouncements' element={<CreateAnnouncements/>}>Anuncios</Route>
          <Route path='/UpdatedAnnouncement/:id' element={<UpdatedAnnouncement/>}>Actualizar Anuncio</Route>
          <Route path='/ShowAnnouncements' element={<ShowAnnouncements/>}>Mostrar Anuncios</Route>
          <Route path='/AnnouncementCard/:id' element={<AnnouncementCard/>}>Task Anuncio</Route>

          <Route path='/CreateTeacher' element={<CreateTeacher/>}></Route>
          <Route path='/ShowTeachers' element={<ShowTeachers/>}></Route>
          <Route path='/UpdatedTeacher/:id' element={<UpdatedTeacher/>}></Route>
          <Route path='/ProfileTeacher/:id' element={<ProfileTeacher/>}></Route>

          <Route path='/CreateStudent' element={<CreateStudent/>}></Route>
          <Route path='/ShowStudents' element={<ShowStudents/>}></Route>
          <Route path='/UpdatedStudent/:id' element={<UpdatedStudent/>}></Route>
          <Route path='/ProfileStudent/:id' element={<ProfileStudent/>}></Route>
          <Route path='/UpTask' element={<UpTask/>}></Route>
          <Route path='ShowUpTasks' element={<ShowUpTasks/>}></Route>
          

          <Route path='/CreateGuardian' element={<CreateGuardian/>}></Route>
          <Route path='/ShowGuardians' element={<ShowGuardians/>}></Route>
          <Route path='/UpdatedGuardian/:id' element={<UpdatedGuardian/>}></Route>
          <Route path='/ProfileGuardian/:id' element={<ProfileGuardian/>}></Route>


          <Route path='/CreateClass' element={<CreateClass/>}></Route>
          <Route path='/ShowClass' element={<ShowClass/>}></Route>
          <Route path='/UpdateClass/:id' element={<UpdateClass/>}></Route>
          <Route path='/ClassCard/:id' element={<ClassCard/>}></Route>
          <Route path='/ClassTasks/:id' element={<ClassTasks/>}></Route>
          <Route path='/ClassAnnouncements/:id' element={<ClassAnnouncements/>}></Route>

          <Route path='/CreateAdmin' element={<CreateAdmin/>}></Route>
          <Route path='/ShowAdmins' element={<ShowAdmins/>}></Route>
          <Route path='/UpdatedAdmin/:id' element={<UpdatedAdmin/>}></Route>
          <Route path='/ProfileAdmin/:id' element={<ProfileAdmin/>}></Route>




        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
