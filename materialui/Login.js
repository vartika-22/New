import React, { useState } from "react";
import { useNavigate} from 'react-router-dom'; // Import useHistory

import LSimage from '../Images/image.svg'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid, Paper, Avatar, Box, TextField, Button} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"; // Import Axios
import jwt_decode from 'jwt-decode';

function Login() {
    const paperStyle = { padding: 20, height: '650px', justifyContent: 'flex-end' };
    const avatarStyle ={backgroundColor: '#9d0f0f', marginTop: '80px' }
    const buttonStyle = { backgroundColor: '#9d0f0f', margin: '15px', padding: '10px 90px', marginLeft:"140px" };
    const textfieldStyle = { color: '#9d0f0f', width: '70%' ,marginLeft:"100px",marginTop:"20px"};
    const h2Style={marginTop:"20px",marginLeft:"0px"};
    const pStyle={marginLeft:"70px"};
    const logoStyle = {
    margin: '80px',
    fontSize: '90px',
    color: '#fff',
    transition: 'opacity 0.4s ease-in-out',
    display: 'inline-block',
    };
    const grid1Style = {
    backgroundColor: '#9d0f0f',
    backgroundImage: `url(${LSimage})`,
    backgroundSize: '60%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '45px 82%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // Initialize useHistory
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginError, setLoginError] = useState(""); // State to store login error message
    

    const handleLogin= async (e,data) => {
       
        try {
            const response = await axios.post("http://localhost:3002/login",{
                email,      // Make sure this matches your input field for email
                password,// Make sure this matches your input field for password
              });
          
            const token = response.data.token; 
            console.log(token)
            const decodedToken = jwt_decode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', decodedToken.isAdmin);
            localStorage.setItem("userEmailID", data.email);
            localStorage.setItem('userName', decodedToken.name);
            console.log(decodedToken)
            setLoginError(""); // Clear login error if successful
            // Redirect based on user role
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            navigate('/dash');
            
      if (decodedToken.isAdmin) {
        navigate('/aq'); // Redirect to admin page
      } else {
        navigate('/dash'); // Redirect to user dashboard page
      }
    } catch (error) {
      console.error(error.response);
      setLoginError("Invalid email or password");
      toast.error("Invalid email or password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

 

  // ... (rest of your code)


    return ( 
        <Grid container>
        <Grid item xs={7} style={grid1Style}>
          <Box>
            <h1 style={logoStyle}>Perficient</h1>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box display="flex" justifyContent="flex-end">
            <Paper elevation={20} style={paperStyle}>
              <Grid align="center">
              <Avatar style={avatarStyle}>
                </Avatar>
                <h2 style={h2Style}>Sign In</h2>
              </Grid>
              <form onSubmit={handleSubmit(handleLogin)}>
                <Box  sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                  <div>
                    <TextField
                      label="Email"
                      type="email"
                      placeholder="Enter email"
                      variant="filled"
                      style={textfieldStyle}
                      
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      placeholder="Enter Password"
                      autoComplete="current-password"
                      variant="filled"
                      style={textfieldStyle}
                      
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </Box>
                
                  <Button type="submit" variant="contained" style={buttonStyle}>
                    Sign In
                  </Button>
                  
              </form>
              
                <p style={pStyle}>Don't have an account? <Link to="/signup" style={{ color: '#9d0f0f' }}>Sign-Up</Link>
                </p>
              
              <p style={pStyle}><Link to="/reset">Forgot Password</Link></p>
            </Paper>
          </Box>
          <ToastContainer />
        </Grid>
      </Grid>
     );
}
export default Login;

