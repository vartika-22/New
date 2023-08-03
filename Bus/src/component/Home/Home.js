import React from "react";
import Navbar from "../route/Navbar";
import Login from "../LogIn/Login";
import BusList from "../route/practice";
import Routeselector from "../route/SelectRoute";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
function Home() {
    return (
        <div className="home">
            <Navbar/>
            <Routeselector/>
            <BusList/>
        </div>


     );
}

export default Home;
