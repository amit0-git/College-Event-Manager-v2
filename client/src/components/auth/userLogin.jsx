


import React, { useState, useEffect } from 'react';
import styles from "./userLogin.module.css";
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';

function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null); // State for captcha value
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    // Function to handle CAPTCHA change
    const onCaptchaChange = (value) => {
        setCaptchaValue(value); // Update captcha value state
        console.log("Login Captcha :", value);
    };

    // This function can be used to update the message based on login status
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when login is initiated

        try {
            const response = await axios.post('/api/users/login', { email, password, captchaValue }, { withCredentials: true });
            console.log(response.data);

            // If successful login
            if (response.data) {
                // On login successful store logged value in db
                Cookies.set('logged', 'true', { expires: 1 / 24 });
                navigate("/studentRegister");
            }

            setMessage('Logged in successfully!');
        } catch (error) {
            console.log(error);
            const message = error.response && error.response.data ? error.response.data.message : 'An error occurred';
            setMessage(message);
        } finally {
            setLoading(false); // Set loading to false when the request is completed
        }
    };

    // Check the logged in flag
    useEffect(() => {
        const logged = Cookies.get("logged");
        console.log("Logged", logged);
        if (logged === "true") {
            console.log("Login: ");
            // If the user is logged in then navigate to student register page
            navigate("/studentRegister");
        }
    }, [navigate]);

    // Clear message after 10 sec
    useEffect(() => {
        let timer;
        if (message) {
            timer = setTimeout(() => {
                setMessage('');
            }, 10000); // 10 seconds
        }
        return () => clearTimeout(timer); // Cleanup the timer on unmount or when errorMessage changes
    }, [message]);

    return (
        <div id={styles.wrapper}>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <div id={styles.formWrapper}>
                <img src="/assets/user.png" alt="" id={styles.user} />
                <h1>User Login</h1>

                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Email</label>
                    <input type="email" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />

                    <ReCAPTCHA
                        sitekey="6LfA1XMqAAAAAMyb8tNCQraolBom5ZlxmflnYoDZ" // Replace with your site key
                        onChange={onCaptchaChange}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div><NavLink className={styles.createAcc} to="/signup">Don't have an account? Register here</NavLink></div>
            </div>

            {message && (
                <div className={styles.errorMessage}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default UserLogin;