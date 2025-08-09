import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPass from './pages/ForgotPass';
import ResetPass from './pages/ResetPass';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route exact path='/register' element={<Register />} />
      <Route exact path='/login' element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/reset-password/:token" element={<ResetPass />} />
    </Routes>
  );
}

function ProtectedRoute({ children }) {
  if (localStorage.getItem('user')) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
}

export default App;
