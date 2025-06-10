import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { type } from '@testing-library/user-event/dist/type';
import Cookies from 'universal-cookie';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
        "Content-Type": "application/json"
    };
    const url = "https://projectprakticum-production.up.railway.app//api/v1/auth/login"
    const api = await axios.post(url,{email:email, password:password}, { headers :headers });
    const key = api.data.api_key;
    const cookies = new Cookies();
    cookies.set('api_key', key, { path: '/' });
    alert(`Вход с ${key}`);
    navigate("/")
  };

  return (
    <div style={styles.container}>
      <h2>Войти</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" style={{ marginTop: '20px' } }>Войти</Button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
};

export default Login;
