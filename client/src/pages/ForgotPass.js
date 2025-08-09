// src/pages/ForgotPass.jsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from '../axiosConfig';
import '../styles/ForgotPass.css';
import { useNavigate } from 'react-router-dom';

const ForgotPass = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            await axios.post('/users/forgot-password', values);
            message.success('Password reset link sent to your email');
        } catch (error) {
            console.error(error);
            message.error('Failed to send password reset link');
            navigate('/register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h1 className="forgot-password-title">Forgot Password</h1>
                <Form layout="vertical" onFinish={submitHandler} className="forgot-password-form">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' }]}
                    >
                        <Input placeholder="Enter your email" type="email" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
                            block
                            size="large"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPass;
