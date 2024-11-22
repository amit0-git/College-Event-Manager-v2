import React, { useEffect, useState } from 'react'
import styles from "./student.module.css"
import axios from "axios";
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function studentRegister() {

    //register button update 
    const [reg, setReg] = useState("Register")

    const [formData, setFormData] = useState({

        rollno: '',
        name: '',
        phone: '',
        genderSelect:'Male',
        accomodationSelect:'No',
        address: '',
        collegeSelect: 'SRMS CET', // Default value
        branchSelect: 'CSE', // Default value
        yearSelect: '1', // Default value
    });


    //get the editable data from the form if the use is logged in 
    //i.e email is in the localstorage 



    async function getUserData() {
        try {



            const response = await axios.post("/api/users/getData"
                , { withCredentials: true });

            console.log("edit data", response.data.data);

            // Assuming the response data structure matches the formData structure
            const userData = response.data.data;

            // Update state with the fetched user data
            setFormData(prevState => ({
                ...prevState,
                rollno: userData.rollno || '',
                name: userData.name || '',
                genderSelect: userData.gender || 'Male',
                accomodationSelect: userData.accomodation|| 'No',
                phone: userData.phone || '',
                address: userData.address || '',
                collegeSelect: userData.college || 'SRMS CET',
                branchSelect: userData.branch || 'CSE',
                yearSelect: userData.year || '1',
            }));




            //set the reg button to update
            setReg("Update")



        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserData();

    }, [])




    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const registerStudent = async () => {
        try {
            const response = await axios.post("api/users/register", {
                // email:"sample@gmail.com",
                rollno: formData.rollno.trim(),
                name: formData.name.trim(),
                gender: formData.genderSelect,
                accomodation: formData.accomodationSelect,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                college: formData.collegeSelect,
                branch: formData.branchSelect,
                year: formData.yearSelect

            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }, { withCredentials: true })

            console.log("Response from Reister:", response.data); // Log the response data
            return response.data; // Return the data
        }
        catch (error) {
            console.log("Register Error:", error)
            setMessage(error.response.data.message)
            return null;
        }
    }


    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send formData to the server)

        const registerd = await registerStudent();

        if (registerd) {
            //store email in localstorage
            console.log("registered: ", registerd.data)

            //afterregistering the student set registered to true 

            Cookies.set('registered', 'true', { expires: 1 / 24 });



            //redirect to profile page
            navigate("/profile");
        }
        console.log('Form submit:', formData);
    };




    //chk the  registered flag
    useEffect(() => {
        const registered = Cookies.get('registered');
        console.log("Registered", registered)
        if (registered === "true") {

            //if the use is logged in then navigate to profile  page
            navigate("/profile")
        }
    }, [navigate]);



    return (
        <div id={styles.wrapper}>
            <Helmet>
                <title>Personal Details</title>

            </Helmet>

            <div id={styles.left}>

                <div className={styles.formHead}>User Registration</div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rollno">Roll No/Reg. No</label>
                    <input
                        type="text"
                        name="rollno"
                        id="rollno"
                        required
                        value={formData.rollno}
                        onChange={handleChange}
                    />
                    <br />

                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <br />

                    <label htmlFor="genderSelect">Gender</label>
                    <select
                        name="genderSelect"
                        value={formData.genderSelect}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                       
                    </select>

                    <label htmlFor="Select">Accomodation required?</label>
                    <select
                        name="accomodationSelect"
                        value={formData.accomodationSelect}
                        onChange={handleChange}
                    >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                 
                       
                    </select>


               

                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <br />

                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <br />

                    <label htmlFor="collegeSelect">College</label>
                    <select
                        name="collegeSelect"
                        value={formData.collegeSelect}
                        onChange={handleChange}
                    >
                        <option value="SRMS CET">SRMS CET</option>
                        <option value="SRMS CETR">SRMS CETR</option>
                        <option value="SRMS IBS">SRMS IBS</option>
                        <option value="SRMS IMS">SRMS IMS</option>
                        <option value="SRMS Law">SRMS Law</option>
                        <option value="SRMS Nursing">SRMS Nursing</option>
                        <option value="SRMS Unnao">SRMS Unnao</option>
                        <option value="SRMS IPS">SRMS IPS</option>
                        <option value="Other">Other</option>
                    </select>
                    <br />

                    <label htmlFor="branchSelect">Branch</label>
                    <select
                        name="branchSelect"
                        value={formData.branchSelect}
                        onChange={handleChange}
                    >
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="EN">EN</option>
                        <option value="EC">EC</option>
                        <option value="ME">ME</option>
                        <option value="B Pharma">B Pharma</option>
                        <option value="MBA">MBA</option>
                        <option value="MCA">MCA</option>
                        <option value="Medical">Medical</option>
                        <option value="Other">Other</option>
                    </select>

                    <label htmlFor="yearSelect">Year</label>
                    <select
                        name="yearSelect"
                        value={formData.yearSelect}
                        onChange={handleChange}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <br />

                    <button type="submit">{reg}</button>
                </form>

                {/* response status */}
                {message && (
                    <div className={styles.errorMessage}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default studentRegister;