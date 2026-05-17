import type { FC } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '../Routes';
import logo from '../assets/logo1.png';
import { logout } from '../slices/authSlice';
import { clearDraft, clearDraftAndFilters } from '../slices/applicationSlice';
import type { RootState, AppDispatch } from '../store';

export const NavBar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const draftId = useSelector((state: RootState) => state.applications.draftId);

  const handleLogout = async () => {
    if (draftId != null) {
      await dispatch(clearDraft(draftId));
    }
    dispatch(logout());
    dispatch(clearDraftAndFilters());
    navigate(ROUTES.MODELS);
    navigate(0);
  };
  return (
 
    <header className="header">
      <div className="header-content">
        <Link to={ROUTES.MODELS} className="logo-link">
          <img 
            src={logo} 
            alt="Логотип" 
            className="header-logo"
            style={{ width: '100px', height: 'auto', display: 'block' }}
          />
        </Link>
        <div className="site-title">
          <h1>Моделирование малых модульных реакторов</h1>
          <p>Удобный калькулятор ММР</p>
        </div>
      </div>
    <div className="action-bar">
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.MODELS} style={{ color: '#ffffff' }}>Моделирование ММР</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to={ROUTES.MODELS} style={{ color: '#ffffff' }}>Каталог моделей</Nav.Link>
            {isAuth ? (
              <>
                <Nav.Link as={Link} to={ROUTES.CALCULATIONS} style={{ color: '#ffffff' }}>Все расчёты</Nav.Link>
                <Nav.Link style={{ color: '#ffffff' }} onClick={handleLogout}>Выход</Nav.Link>
                <span className="me-3 fw-bold" style={{color: '#a6a6a6ff'}} >
                  Пользователь:  {user?.login || 'неизвестен'}
                </span>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={ROUTES.LOGIN} style={{ color: '#ffffff' }}>Вход</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.REGISTER} style={{ color: '#ffffff' }}>Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
    </header>
  );
};