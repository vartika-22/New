import React, { useState } from 'react';
import './login_style.css';
import { Link } from 'react-router-dom';

export default function Signin() {
    return (
        <div className='main-header' >
        <div className="container">
            <section className="myform-area">
                <div className="container">
                            <div className="form-area login-form">
                                <div className="form-input">
                                    <h2>Sign-In</h2>
                                    <form> 
                                    <div class="form-group">
                                            <input className="loginInfo" type="number" name="name" required  />
                                            <label>Mobile-Number</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="loginInfo" type="email" name="name" required  />
                                            <label>Email-Id</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="loginInfo" type="password" name="password" required />
                                            <label>password</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="loginInfo" type="password" name=" Re enter password" required />
                                            <label>Confirm-password</label>
                                        </div>
                                        <div className="myform-button">
                                        <Link to="/home"><button type="submit" className="myform-btn">Sign-Up</button></Link>
                                        </div>
                                        <div>
                                            <small className="form-text text-muted signup-text">Already a User?
                                            </small>
                                            <span className="signUPtext"><Link to="/login">Log-In</Link></span>
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