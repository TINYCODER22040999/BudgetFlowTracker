// src/pages/ResetPass.jsx
import React, { useState } from 'react';
import { Form, Input, message, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import '../styles/ResetPass.css';

const ResetPass = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const submitHandler = async (values) => {
        if (values.password !== values.confirmPassword) {
            message.error('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`/users/reset-password/${token}`, {
                password: values.password,
            });
            message.success('Password reset successfully');
            navigate('/login');
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            message.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h1>Reset Password</h1>
                <Form layout="vertical" onFinish={submitHandler}>
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter a new password' }]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm your password' }]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="submit-btn" 
                        loading={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ResetPass;
