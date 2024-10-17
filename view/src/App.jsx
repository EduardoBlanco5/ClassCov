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
import Profile from './pages/Profile';


function App() {
  const role = localStorage.getItem('role');

  return (
    <AuthProvider>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>

          <Route path='/' element={<Login/>}>Login</Route>
          <Route path='/Profile' element={<Profile/>}></Route>


          
           {/* Rutas protegidas */}
           <Route path='/Home' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'guardian', 'student']} />}>
            <Route index element={<Home />} />
          </Route>

          {/* Rutas para ADMINISTRADORES */}

          <Route path='/CreateAdmins' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateAdmin/>}></Route>
          </Route>
          <Route path='/CreateStudent' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateStudent/>}></Route>
          </Route>
          <Route path='/CreateGuardian' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateGuardian/>}></Route>
          </Route>
          <Route path='/CreateTeacher' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateTeacher/>}></Route>
          </Route>
          <Route path='/ShowTeachers' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowTeachers/>}></Route>
          </Route>
          <Route path='/ShowGuardians' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowGuardians/>}></Route>
          </Route>
          <Route path='/ShowStudents' element={<ProtecttedRoute allowedRoles={['admin', 'guardian']} />}>
            <Route index element={<ShowStudents/>}></Route>
          </Route>
          


          {/* Rutas para PROFESORES*/}
          <Route path='/CreateTask' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<CreateTask />} />
          </Route>

          <Route path='/ShowTasks' element={<ProtecttedRoute allowedRoles={['teacher', 'student']} />}>
            <Route index element={<ShowTask />} />
          </Route>
          

          {/* Rutas para ESTUDIANTES */}
          <Route path='/ShowTasks' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<ShowTask />} />
          </Route>
          <Route path='/student/show-up-tasks' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<ShowUpTasks />} />
          </Route>
          <Route path='/ShowTasks' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<ShowTask />} />
          </Route>

           {/* Rutas para TUTORES */}
           <Route path='/ShowStudents' element={<ProtecttedRoute allowedRoles={['guardian']} />}>
            <Route index element={<ShowStudents />} />
          </Route>
          <Route path='/student/show-up-tasks' element={<ProtecttedRoute allowedRoles={['guardian']} />}>
            <Route index element={<ShowUpTasks />} />
          </Route>
          


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
