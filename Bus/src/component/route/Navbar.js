import React from "react";
import '../route/Navbar.css'

class Navbar extends React.Component {
  state = {};
  render() {
    return (
      <header>
        <nav className="navbar">
          <ul>
            <li><a href="/home"><img src="https://seeklogo.com/images/B/bus-stop-symbol-logo-2DD67FCDE5-seeklogo.com.png" className="logo"/><span> Home</span> </a></li>
            <span><ul className="login">
            <li><a href="/profile"> Profile</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Help</a></li>
            
          </ul></span>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Navbar;
