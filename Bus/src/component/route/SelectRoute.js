import React from 'react';
import { Link } from 'react-router-dom';
import './SelectRoute.css';
import image from '../img/R.png';
import Navbar from './Navbar';

export default function Routeselector() {
    return (
        
        <div className='search-box'>
        <div className="rdc"  >
            <div className="form-group inline"></div>
            <div className="main-container">
                <form className="form-inline">
                    <div className='form-bg'>
                    <select name="ad_account_selected" data-style="btn-new" class="selectpicker" >
                        <option>FROM</option>
                        <option>Chennai</option>
                        <option>Bangalore</option>
                        <option>Delhi</option>
                        <option>Mumbai</option>
                    </select><span> </span>
                    <select name="ad_account_selected" data-style="btn-new" class="selectpicker">
                        <option>TO</option>
                        <option>Hyderabad</option>
                        <option>Coimbatore</option>
                        <option>Delhi</option>
                        <option>Vishakapatnam</option>
                        <option>Bangalore</option>
                        <option>Mumbai</option>
                        <option>Chenai</option>
                    </select>
                    <input type="date" className='date'></input>
                    </div><div>
                    <Link to="/buslist"><input type="Submit"  className=" btn btn-primary btn-md getRoute" />
                    </Link>
                    </div>
                    </form>

                <div>
                </div>
                </div>
            </div>
        </div>
    )
}