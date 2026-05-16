import React, { useState, type FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import { apiClient } from '../api/axios';
import { ROUTES } from '../Routes';

export const AuthPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLoginStr] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { login, password };

      const endpoint = '/api/engineers/login';

      let res = await apiClient.post(endpoint, payload);

      const token = res.data.access_token || res.data.token;

      if (!token) {
        setError('Не удалось получить токен доступа от сервера.');
        return;
      }

      let actualRole = (res.data.role || 1);
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const parsedToken = JSON.parse(jsonPayload);

          if (parsedToken.role) actualRole = parsedToken.role;
          if (parsedToken.Role) actualRole = parsedToken.Role;
        }
      } catch (e) {
        console.error("Ошибка при чтении роли из токена:", e);
      }

      const user = res.data.user || { 
        id: res.data.id || Date.now(), 
        login: login, 
        role: actualRole 
      };

      dispatch(setAuth({ user, token }));
      navigate(ROUTES.MODELS);

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError('Неверный логин или пароль.');
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
        onSubmit={handleSubmit}
      >
        <h2 className="normal-text text-center fw-bold" style={{fontSize: 'xx-large'}}>
          Добро пожаловать
        </h2>

        {error && <div className="error-alert">{error}</div>}

        <div className="mb-3">
          <label className="normal-text text-muted fw-semibold">Логин</label>
          <input 
            className="auth-input" 
            value={login} 
            onChange={e => setLoginStr(e.target.value)} 
            placeholder="Введите логин"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="normal-text text-muted fw-semibold">Пароль</label>
          <input 
            className="auth-input" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="******"
            required 
          />
        </div>

        <button type="submit" className="butn w-100 fw-bold" style={{marginBottom: '10px'}}>
          Войти
        </button>

        <div className="normal-text text-center">
            Нет аккаунта? 
            <Link to={ROUTES.REGISTER} className="normal-text text-decoration-none"> Создать</Link>
        </div>
      </form>
    </div>
  );
};