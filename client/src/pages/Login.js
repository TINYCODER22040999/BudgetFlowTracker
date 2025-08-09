import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

import Spinner from '../components/Spinner';
import '../styles/Login.css'; 

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/users/login', values);
            message.success('Login successfully');
            setLoading(false);
            localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
            navigate('/');
        } catch (error) {
            setLoading(false);
            message.error('Invalid email or password');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="login-container">
            {loading && <Spinner />}
            <div className="login-box">
                <div className="login-left">
                    <h1>Welcome Back!</h1>
                    <p className="subtitle">Please enter your login details below</p>
                    <Form layout="vertical" onFinish={submitHandler} className="login-form">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please enter your email' }]}
                        >
                            <Input placeholder="Enter your email" type="email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <button className="login-btn" type="submit">Sign In</button>
                    </Form>
                    <p className="signup-link">
                        Don’t have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
                <div className="login-right">
                    <img src="/assets/login1.png" alt="Illustration" />
                    <p>Manage your transactions easily and efficiently with Tasky...</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

