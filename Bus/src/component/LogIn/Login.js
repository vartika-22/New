import React from 'react';
import './login_style.css';
import { Link } from 'react-router-dom';
import NavBeforeLogin from '../route/Nav';

export default function Login() {
    return (
        <div className='main-header'>
           <NavBeforeLogin/>
        <div className="container">
            <section className="myform-area">
                <div className="container">
                            <div className="form-area login-form">
                                <div className="form-input">
                                    <h2>Log-In</h2>
                                    <form className='login-form'> 
                                        <div class="form-group">
                                            <input className="loginInfo" type="email" name="name" required  />
                                            <label>Email-Id</label>
                                        </div>
                                        <div class="form-group">
                                            <input className="loginInfo" type="password" name="password" required />
                                            <label>password</label>
                                        </div>
                                        <div class="myform-button">
                                            <Link to="/home"><button type="submit"  className="myform-btn">Login</button></Link>
                                        </div><br/>
                                        <div>
                                            <small className="form-text text-muted signup-text">New User?
                                            </small>
                                            <span className="signUPtext"><Link to="/signup">Sign-Up</Link></span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        
                 
                </div>
            </section>
            </div>

        </div >
    )
}