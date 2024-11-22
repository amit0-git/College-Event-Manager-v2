// Navbar.js
import React, { useState } from 'react';
import {  useNavigate} from 'react-router-dom';
import styles from './navbar.module.css'; // Import the CSS module
import Cookies from 'js-cookie';
import axios from "axios";
import { faUser, faLink,faList, faRightFromBracket,faHouse,faUserTie,faRightToBracket } from '@fortawesome/free-solid-svg-icons'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                    <a href="/"><FontAwesomeIcon  className={styles.icon} icon={faHouse} />Home</a>
                    <a href="/login"><FontAwesomeIcon icon={faRightToBracket}  className={styles.icon} />Sign In</a>
                    <a href="/profile"> <FontAwesomeIcon  className={styles.icon} icon={faUser} />Profile</a>
                    <a href="/invitation"><FontAwesomeIcon className={styles.icon} icon={faLink} />Invitation</a>
                    <a href="participation"><FontAwesomeIcon  className={styles.icon} icon={faList} />Participation</a>
                    <a href="/developer"><FontAwesomeIcon className={styles.icon} icon={faUserTie} />Developer</a>
                    <a href="#" onClick={handleLogout}><FontAwesomeIcon className={styles.icon} icon={faRightFromBracket} />Log Out</a>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;