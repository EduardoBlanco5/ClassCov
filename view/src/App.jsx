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
import CreateStudentClass from './administration/Classes/CreateStudentClass';
import ListStudentClasses from './administration/Classes/ListStudentsClass';
import ClassStudents from './administration/Classes/ClassStudents';
import GradingTask from './teachers/Tasks/GradingTask';
import CreateAttendance from './teachers/Attendances/CreateAttendance';
import CreateSubject from './administration/Subjects/CreateSubject';
import ShowSubjects from './administration/Subjects/ShowSubjects';
import SubjectCard from './administration/Subjects/SubjectCard';
import UpdatedSubject from './administration/Subjects/UpdatedSubject';
import ShowAttendances from './teachers/Attendances/ShowAttendances';
import Dashboard from './components/Dashboard';
import SubjectTask from './administration/Subjects/SubjectTask';



function App() {
  const role = localStorage.getItem('role');

  return (
    <AuthProvider>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>

          <Route path='/' element={<Login/>}>Login</Route>
          <Route path='/Profile/:id' element={<Profile/>}></Route>


          
           {/* Rutas protegidas */}
           <Route path='/Home' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'guardian', 'student']} />}>
            <Route index element={<Home />} />
          </Route>

          {/* Rutas para ADMINISTRADORES */}

          {/* Crear */}

          <Route path='/CreateAdmins' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateAdmin/>}></Route>
          </Route>
          <Route path='/CreateStudent' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateStudent/>}></Route>
          </Route>
          <Route path='/CreateStudentClass' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateStudentClass/>}></Route>
          </Route>
          <Route path='/CreateGuardian' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateGuardian/>}></Route>
          </Route>
          <Route path='/CreateTeacher' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateTeacher/>}></Route>
          </Route>
          <Route path='/CreateClass' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateClass/>}></Route>
          </Route>
          <Route path='/CreateSubject' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<CreateSubject/>}></Route>
          </Route>
          <Route path='/Createannouncements/:class_id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route index element={<CreateAnnouncements/>}></Route>
          </Route>
          <Route path='/CreateAttendances/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route index element={<CreateAttendance/>}></Route>
          </Route>

          {/* Ver */}

          <Route path='/ShowTeachers' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowTeachers/>}></Route>
          </Route>
          <Route path='/ShowAdmins' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowAdmins/>}></Route>
          </Route>
          <Route path='/ShowGuardians' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ShowGuardians/>}></Route>
          </Route>
          <Route path='/ShowStudents' element={<ProtecttedRoute allowedRoles={['admin', 'guardian', 'teacher']} />}>
            <Route index element={<ShowStudents/>}></Route>
          </Route>
          <Route path='/ShowAnnouncements' element={<ProtecttedRoute allowedRoles={['admin', 'guardian', 'teacher', 'student']} />}>
            <Route index element={<ShowAnnouncements/>}></Route>
          </Route>
          <Route path='/ShowStudentsClass' element={<ProtecttedRoute allowedRoles={['admin',]} />}>
            <Route index element={<ListStudentClasses/>}></Route>
          </Route>
          <Route path='/ShowClass' element={<ProtecttedRoute allowedRoles={['admin', 'guardian', 'teacher', 'student']} />}>
            <Route index element={<ShowClass/>}></Route>
          </Route>
          <Route path='/ShowSubjects' element={<ProtecttedRoute allowedRoles={['admin', 'guardian', 'teacher', 'student']} />}>
            <Route index element={<ShowSubjects/>}></Route>
          </Route>
          <Route path='/ProfileTeacher/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ProfileTeacher/>}></Route>
          </Route>
          <Route path='/ProfileAdmin/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ProfileAdmin/>}></Route>
          </Route>
          <Route path='/ProfileStudent/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route index element={<ProfileStudent/>}></Route>
          </Route>
          <Route path='/ProfileGuardian/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<ProfileGuardian/>}></Route>
          </Route>
          <Route path='/ClassCard/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
            <Route index element={<ClassCard/>}></Route>
          </Route>
          <Route path='/SubjectCard/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
            <Route index element={<SubjectCard/>}></Route>
          </Route>
          <Route path='/AnnouncementCard/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student', 'guardian']} />}>
            <Route index element={<AnnouncementCard/>}></Route>
          </Route>
          <Route path='/ClassTasks/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
            <Route index element={<ClassTasks/>}></Route>
          </Route>
          <Route path='/ClassStudents/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
            <Route index element={<ClassStudents/>}></Route>
          </Route>
          <Route path='/ClassAnnouncements/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student', 'guardian']} />}>
            <Route index element={<ClassAnnouncements/>}></Route>
          </Route>
          <Route path='/TaskCard/:id' element={<ProtecttedRoute allowedRoles={['admin', 'student', 'teacher']} />}>
            <Route index element={<TaskCard/>}></Route>
          </Route>
          <Route path='/GradingTask/:id' element={<ProtecttedRoute allowedRoles={['admin','teacher']} />}>
            <Route index element={<GradingTask/>}></Route>
          </Route>
          <Route path='/ShowAttendances/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route index element={<ShowAttendances/>}></Route>
          </Route>
          <Route path='/Dashboard/:id' element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student', 'guardian']} />}>
            <Route index element={<Dashboard/>}></Route>
          </Route>
          <Route path="/SubjectTask/:id" element={<ProtecttedRoute allowedRoles={['admin', 'teacher', 'student', 'guardian']} />}>
            <Route index element={<SubjectTask/>}></Route>
          </Route>
          
          
          {/* Actualizar */}
          <Route path='/Updatedstudent/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdatedStudent/>}></Route>
          </Route>
          <Route path='/UpdatedTeacher/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdatedTeacher/>}></Route>
          </Route>
          <Route path='/UpdatedAdmin/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdatedAdmin/>}></Route>
          </Route>
          <Route path='/UpdatedGuardian/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdatedGuardian/>}></Route>
          </Route>
          <Route path='/UpdateClass/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdateClass/>}></Route>
          </Route>
          <Route path='/UpdatedAnnouncement/:id' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<UpdatedAnnouncement/>}></Route>
          </Route>
          <Route path='/UpdatedTask/:id' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<UpdatedTask/>}></Route>
          </Route>
          <Route path='/UpdatedSubject/:id' element={<ProtecttedRoute allowedRoles={['admin']} />}>
            <Route index element={<UpdatedSubject/>}></Route>
          </Route>

          


          {/* Rutas para PROFESORES*/}
          <Route path='/CreateTask/:class_id' element={<ProtecttedRoute allowedRoles={['teacher']} />}>
            <Route index element={<CreateTask />} />
          </Route>

          <Route path='/ShowTasks' element={<ProtecttedRoute allowedRoles={['teacher', 'student', 'admin']} />}>
            <Route index element={<ShowTask />} />
          </Route>
          

          {/* Rutas para ESTUDIANTES */}
      
          <Route path='/student/show-up-tasks' element={<ProtecttedRoute allowedRoles={['student']} />}>
            <Route index element={<ShowUpTasks />} />
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
