
import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  
    const navigate = useNavigate();

    const register = () => {
        navigate('/login');
    };



 
    return (
        <div id={styles.mainWrapper}>
            <div id={styles.navBar}>
                <div id={styles.srms}>SRMS CET</div>
                <button id={styles.regBtnRight} onClick={register}>Register</button>
            </div>

            <div className={styles.container}>
                <div className={styles.contentHead}>
                    <div id={styles.mainHead}>Virasat</div>
                    <div id={styles.mainSub}>A legacy to hold</div>
                    <div id={styles.mainDesc}>
                        Zest, the much-anticipated annual cultural fest of Shri Ram Murti Smarak College of Engineering and Technology (SRMS CET), Bareilly, is a vibrant celebration of India's diverse cultural heritage. The theme for this year’s fest, "Virasat", beautifully encapsulates the essence of our nation’s rich and timeless legacy. "Virasat," which translates to "heritage" or "legacy," aims to showcase the cultural, historical, and artistic treasures that define India’s identity.
                    </div>
                    <div id={styles.registerHead}>
                        <div id={styles.date}>Date: 29th & 30th Nov 2024</div>
                        <button id={styles.regBtn} onClick={register}>Register</button>

                        <div id={styles.note}><span>Note:-</span> Registeration will be done on this portal only<br />
                            Registeration will be done only from 25th Nov to 28th Nov 2024<br />
                            After that no registeration will be done
                        </div>
                    </div>
                </div>
            </div>

            <div id={styles.highlightSection}>
                <div id={styles.highHed}>Key Highlights</div>

                <div id={styles.cardWrap}>
                    <div id={styles.card}>
                        <img src="assets/famous-family-red-bull-dance-your-style-2021-india-finals.avif" alt="" />
                        <div id={styles.cardHead}>Group Dance</div>
                        <div id={styles.cardDesc}>
                            A street play is a short, outdoor performance that uses drama, music, and social messages to engage and entertain audiences.
                        </div>
                    </div>
                    <div id={styles.card}>
                        <img src="assets/street.jpg" alt="" />
                        <div id={styles.cardHead}>Street Play</div>
                        <div id={styles.cardDesc}>
                            A street play is a short, outdoor performance that uses drama, music, and social messages to engage and entertain audiences.
                        </div>
                    </div>
                    <div id={styles.card}>
                        <img src="assets/band.jpg" alt="" />
                        <div id={styles.cardHead}>Battle of Bands</div>
                        <div id={styles.cardDesc}>
                            Group dance is a coordinated performance by multiple dancers, blending rhythm, movement, and expression to tell a story collectively.
                        </div>
                    </div>
                    <div id={styles.card}>
                        <img src="assets/fashion.jpg" alt="" />
                        <div id={styles.cardHead}>Renaissance</div>
                        <div id={styles.cardDesc}>
                            Group dance is a coordinated performance by multiple dancers, blending rhythm, movement, and expression to tell a story collectively.
                        </div>
                    </div>
                    <div id={styles.card}>
                        <img src="assets/dj.png" alt="" />
                        <div id={styles.cardHead}>DJ Night</div>
                        <div id={styles.cardDesc}>
                            Group dance is a coordinated performance by multiple dancers, blending rhythm, movement, and expression to tell a story collectively.
                        </div> </div>
                </div>
            </div>


            <div id={styles.extraInfo}>
                <div id={styles.moreInfoHead}>For More Information</div>




                <a href="/assets/Rulebook.pdf" target="_blank" rel="noopener noreferrer">
                    <button id={styles.moreInfoDesc}>
                        Rulebook
                    </button>
                </a>

            </div>
        </div>
    );
};

export default Home;