


import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import styles from "./userLogin.module.css";
import { Helmet } from 'react-helmet';

function UserSignup() {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null); // State for captcha value
    const [loading, setLoading] = useState(false); // State for loading

    const navigate = useNavigate();

    // Function to handle CAPTCHA change
    const onCaptchaChange = (value) => {
        setCaptchaValue(value); // Update captcha value state
    };

    // Clear message after 10 sec
    useEffect(() => {
        let timer;
        if (message) {
            timer = setTimeout(() => {
                setMessage('');
            }, 10000); // 10 seconds
        }
        return () => clearTimeout(timer); // Cleanup the timer on unmount or when message changes
    }, [message]);

    // Function to signup user
    const signupUser  = async (email, password) => {
        try {
            const response = await axios.post('/api/users/signup', { email, password, captchaValue });
            console.log("response", response.data);
            if (response.data) {
                setMessage(response.data.message);
                // On signup success redirect to login
                navigate('/login');
            }
        } catch (error) {
            console.log("Error: ", error);
            setMessage(error.response.data.message);
        }
    }

    // This function can be used to update the message based on signup status
    const handleSignup = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when signup is initiated

        try {
            // Check if both passwords match
            if (password !== confirmPassword) {
                setMessage("Passwords don't match!");
                setLoading(false); // Reset loading state
                return;
            }

            await signupUser (email, password);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Set loading to false when the request is completed
        }
    };

    return (
        <div id={styles.wrapper}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <div id={styles.formWrapper}>
                <img src="/assets/user.png" alt="" id={styles.user} />
                <h1>Create Account</h1>

                <form onSubmit={handleSignup}>
                    <label htmlFor="username">Email</label>
                    <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} />

                    <br />

                    <ReCAPTCHA
                        sitekey="6LfA1XMqAAAAAMyb8tNCQraolBom5ZlxmflnYoDZ" // Replace with your site key
                        onChange={onCaptchaChange}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                <div>
                    <NavLink className={styles.createAcc} to="/">Already have an account? Login Here</NavLink>
                </div>
            </div>

            {message && (
                <div className={styles.errorMessage}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default UserSignup;