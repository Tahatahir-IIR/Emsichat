import React from 'react';
import './App.css';
import LoginPage from './pages/authPages/login/LoginPage.jsx';
import RegisterPage from './pages/authPages/register/RegisterPage.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
 } from "react-router-dom"

 import AlertNotification from './components/AlertNotification.jsx';

function App() {
  return (
    <Router>
      <Routes>
         <Route exact path='/login' element={<LoginPage/>}/>
         <Route exact path='/register' element={<RegisterPage/>}/>
         <Route exact path='/Dashboard' element={<Dashboard/>} />
         <Route path='/' element={<Navigate to="Dashboard"></Navigate>}/>
      </Routes>
      <AlertNotification/>
    </Router>
    

  );
}

export default App;
