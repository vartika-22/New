import React from "react";
import '../route/Navbar.css'

class NavBeforeLogin extends React.Component {
  state = {};
  render() {
    return (
      <header>
        <nav className="navbar">
          <ul>
            <li><a href="/">Home </a></li>
            <span><ul className="login">
            <li><a href="/login">LogIn</a></li>
            <li><a href="/signup"> Sign-Up</a></li>
          </ul></span>
          </ul>
        </nav>
      </header>
    );
  }
}

export default NavBeforeLogin;
