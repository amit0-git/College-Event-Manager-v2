// Navbar.js
import React, { useState } from 'react';
import {  useNavigate} from 'react-router-dom';
import styles from './navbar.module.css'; // Import the CSS module
import Cookies from 'js-cookie';
import axios from "axios";

//dheerendra

function Navbar() {

    
    const [isNavVisible, setNavVisible] = useState(false);
   
   const navigate=useNavigate();
    const toggleNav = () => {
        setNavVisible(!isNavVisible);
    };

    // Function to handle logout
    const handleLogout = async () => {

        try {
            const logout = await axios.post('/api/users/logout', {}, { withCredentials: true });
            if (logout.data) {

                console.log(logout.data);
                Cookies.remove("logged")
                navigate("/login")
              
            }


        }
        catch (error) {
            console.error(error);
        }

    };

    return (
        <header>
            <nav className={styles.nav}>
                <a  className={styles.logo}>
                    SRMS
                </a>

                <div className={styles.hamburger} onClick={toggleNav}>
                    <span className={styles.line}></span>
                    <span className={styles.line}></span>
                    <span className={styles.line}></span>
                </div>

                <div className={`${styles.nav__link} ${isNavVisible ? '' : styles.hide}`}>
                    <a href="/">Home</a>
                    <a href="/login">Sign In</a>
                    <a href="/profile"> Profile</a>
                    <a href="/invitation">Invitation</a>
                    <a href="participation">Participation</a>
                    <a href="/developer">Developer</a>
                    <a href="#" onClick={handleLogout}>Log Out</a>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;