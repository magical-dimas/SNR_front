import type { FC } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';
import logo from '../assets/logo1.png';

export const NavBar: FC = () => {
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
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTES.MODELS} style={{ color: '#ffffff' }}>Каталог моделей</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
    </header>
  );
};