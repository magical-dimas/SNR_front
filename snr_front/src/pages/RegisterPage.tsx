import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/axios';
import { ROUTES } from '../Routes';

export const RegisterPage: React.FC = () => {
  const [login, setLoginStr] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { login, password };
      const endpoint = '/api/engineers/register';
      await apiClient.post(endpoint, payload);
      alert('Регистрация прошла успешно! Используйте эти данные для входа');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 500) {
        setError('Пользователь с таким логином уже существует.');
      } else {
        setError('Произошла ошибка при обращении к серверу.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <form 
        className="p-5 bg-white" 
        style={{ width: '100%', maxWidth: '420px'}} 
        onSubmit={handleRegister}
      >
        <h2 className="normal-text text-center fw-bold" style={{fontSize: 'xx-large'}}>
          Регистрация
        </h2>

        {error && <div className="error-alert">{error}</div>}

        <div className="mb-3">
          <label className="normal-text text-muted fw-semibold">Новый логин</label>
          <input 
            className="auth-input" 
            value={login} 
            onChange={e => setLoginStr(e.target.value)} 
            placeholder="Введите логин"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="normal-text text-muted fw-semibold">Новый пароль</label>
          <input 
            className="auth-input"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Введите пароль"
            required 
          />
        </div>

        <button type="submit" className="butn w-100 fw-bold" style={{marginBottom: '10px'}}>
          Зарегистрироваться
        </button>

        <div className="normal-text text-center">
            Есть аккаунт? 
            <Link to={ROUTES.LOGIN} className="normal-text text-decoration-none"> Авторризоваться</Link>
        </div>
      </form>
    </div>
  );
};