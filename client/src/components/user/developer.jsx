import React from 'react';
import styles from './developer.module.css'; // Optional: If you want to use an external CSS file
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div id={styles.outWrapper}>
      <div id={styles.mainHead}>Designed & Developed by</div>
      <div className={styles.cardContainer1}>
        <div className={styles.cardContainer}>
          <div id={styles.img}>
            <img src="/assets/amit1.JPG" alt=""  />
          </div>
          <div id={styles.name}>Amit Verma</div>
          <div id={styles.query}>For any query contact:-</div>
          <div id={styles.phone}>
            <span id={styles.phoneSpan}>Phone:-</span> 7505574391
          </div>
          <div id={styles.email}>
            <span >Email:-</span> root.avanti@gmail.com
          </div>
          <div id={styles.linked}>

            
            <span >LinkedIn:-</span> <a href="https://www.linkedin.com/in/amitk007" >amitk007</a>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default App;