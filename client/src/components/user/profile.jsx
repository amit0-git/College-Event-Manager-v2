

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import styles from "./profile.module.css"; // Custom CSS styles

import Cookies from 'js-cookie';


const UserProfile = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    pid: "",
    rollno: "",
    name: "",
    phone: "",
    address: "",
    college: "",
    branch: "",
    year: "",
    verified: ""
  });

  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state

  const fetchData = async () => {
    try {
      const response = await axios.post("/users/getData", {
        withCredentials: true
      });
      setData(response.data.data);
    } catch (error) {

      // navigate("/studentRegister");
      setError("Failed! Please Login.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();



  }, []);

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Button click handlers
  const handleIndividualEvent = () => {
    navigate('/individualEvent');
  };

  const handleTeamEvent = () => {
    navigate('/teamEvent');
  };

  const handleEditEvent = () => {
    //set the registered flag to false

    //reset the registered cookie

    Cookies.remove("registered")

    navigate('/studentRegister');
  };

  return (


    <div className={styles.wrapper}>
      <Helmet>
        <title>Profile</title>

      </Helmet>
      <div className={styles.profileHeader}>
        Your PID: {data.pid || "Not Available"}
      </div>
      <div className={styles.note}>Note:-Verification will be done at college
        <br/>It is mandatory to bring Aadhar card for verification
      </div>

      <div className={styles.userProfile}>
        User Profile
      </div>
      <div className={styles.profileTable}>
        <img src="/assets/wheel.png" alt="" srcset="" className={styles.wheel} />
        <table>
          <tbody>

            <tr className={styles.table_cell}>
              <td>Status</td>
              <td style={{ color: data.verified === 1 ? 'green' : 'red' }}>
                {data.verified === 1 ? 'Verified' : 'Not Verified'}
              </td>
            </tr>

            <tr className={styles.table_cell}>
              <td>Email</td>
              <td>{data.email || "Not Available"}</td>
            </tr>
            <tr>
              <td>Aadhar No</td>
              <td>{data.rollno || "Not Available"}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{data.name || "Not Available"}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>{data.gender || "Not Available"}</td>
            </tr>
            <tr>
              <td>Accomodation</td>
              <td>{data.accomodation || "Not Available"}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{data.phone || "Not Available"}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{data.address || "Not Available"}</td>
            </tr>
            <tr>
              <td>College</td>
              <td>{data.college || "Not Available"}</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>{data.branch || "Not Available"}</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>{data.year || "Not Available"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.participateSection}>
        <h2>Participate In</h2>
        <div id={styles.note}><span>Note:-</span>Click on <span>Edit</span> to edit your personal details<br />
          To participate in individual event click on <span>Individual Event</span><br />
          To participate in team event click on <span> Team Event</span>
        </div>
        <div className={styles.buttonWrap}>
          <button onClick={handleEditEvent} className={styles.editBtn}>Edit</button>
          <button onClick={handleIndividualEvent} className={styles.individualBtn}>Individual Event</button>
          <button onClick={handleTeamEvent} className={styles.teamBtn}>Team Event</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
