import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

import Spinner from '../components/Spinner';

import '../styles/Register.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post('/users/register', values);
      message.success("Registration successful");
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      message.error("Account already exists");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="register-wrapper">
      {loading && <Spinner />}
      <div className="register-card">
        <div className="register-left">
          <img src="/assets/login1.png" alt="Register" />
          <p>Manage your transactions efficiently with our smart system!</p>
        </div>

        <div className="register-right">
          <h2>Create Your Account</h2>
          <p className="subtitle">Join us and manage your expenses with ease.</p>
          <Form layout="vertical" onFinish={submitHandler}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <button type="submit" className="btn-primary">Register</button>
            <div className="bottom-text">
              <Link to="/login">Already have an account? <strong>Login here</strong></Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
