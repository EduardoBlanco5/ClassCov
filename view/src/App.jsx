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
import ProtecttedRoute from './components/ProtecttedRoute';
import { AuthProvider } from './components/AuthContext';


function App() {
  const role = localStorage.getItem('role');

  return (
    <AuthProvider>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>

          <Route path='/' element={<Login/>}>Login</Route>
          
           {/* Rutas protegidas */}
           <Route path='/Home' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'guardian', 'student']} />}>
            <Route index element={<Home />} />
          </Route>

          {/* Rutas para administradores */}
          <Route path='/admin/create-teacher' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateTeacher />} />
          </Route>
          <Route path='/admin/show-teachers' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowTeachers />} />
          </Route>
          {/* Otras rutas de administración... */}

          {/* Rutas para profesores */}
          <Route path='/teacher/create-task' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<CreateTask />} />
          </Route>

          <Route path='/teacher/show-tasks' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<ShowTask />} />
          </Route>
          

          {/* Rutas para estudiantes */}
          <Route path='/student/up-task' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<UpTask />} />
          </Route>
          <Route path='/student/show-up-tasks' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<ShowUpTasks />} />
          </Route>

          {/* Otras rutas... */}
          


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
