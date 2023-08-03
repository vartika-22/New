import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Login from './component/LogIn/Login';
import Signin from './component/LogIn/SignIn';
import Routeselector from './component/route/SelectRoute';
import Navbar from './component/route/Navbar';
import BusList from './component/buslist/Buslist';
import Home from './component/Home/Home';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import CreateBus from './component/buslist/creat-bus';
import Profile from './component/Profile/profile';



function App() {
  const [token, setToken] = useState();
  return (
    <div className="App">
      

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Profile/>}/>
        {/* <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signin/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/buslist" element={<BusList/>}/> */}
      </Routes>
      </BrowserRouter>
      
      
      
         
    </div>
  );
}

export default App;
