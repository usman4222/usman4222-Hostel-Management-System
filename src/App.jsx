import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dash from './pages/Dashboard/Dash'
import Signin from './Signin'
import ProtectedRoute from './ProtectedRoute';
import AllEmployees from './components/EmployeesTable/AllEmployees';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import AddEmployee from './components/EmployeesTable/AddEmployee';
import UpdateUser from './components/EmployeesTable/UpdateUser';
// import AddBlog from './components/Blogs/AddBlog';
// import UpdateBlog from './components/Class/UpdateBlog';
import GuestRoute from './GuestRoute';
import AddExam from './components/Exam/AddExam';
import MarkAttendance from './components/Attendance/MarkAttendance';
import AddClass from './components/Class/AddClass';

function App() {

  const adminId = "adminId";
  const user = localStorage.getItem(adminId);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path='/' element={<Dash />} />
          <Route path='/allemployees' element={<AllEmployees />} />
          <Route path='/adduser' element={<AddEmployee />} />
          <Route path='/view/:id' element={<Profile />} />
          <Route path='/markattendance' element={<MarkAttendance />} />
          <Route path='/update-user/:id' element={<UpdateUser />} />
          <Route path='/add-class' element={<AddClass />} />
          {/* <Route path='/update-blog/:id' element={<UpdateBlog />} /> */}
          <Route path='/add-exam' element={<AddExam />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route element={<Signin />} path="/sign-in" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
