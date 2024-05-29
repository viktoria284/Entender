import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../Store/Hooks';
import { logout, selectAuth } from '../Store/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Nav, Form, FormControl } from 'react-bootstrap';

  const MyNavbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectAuth).user;
    const [searchQuery, setSearchQuery] = useState('');

    const handleBrandClick = () => {
      navigate('/');
    };
  
    const handleUserClick = () => {
      navigate('/cart');
    };
  
    const handleLogout = () => {
      dispatch(logout());
      navigate('/');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };
  
    const handleSearchSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      navigate(`/search?query=${searchQuery}`);
    };
    
    return (
      <Navbar className="bg-primary" variant="dark" expand="lg">
        <Container>
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          ENTENDER
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Form className="d-flex search-form" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2 search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline-light" type="submit" className="search-button">Search</Button>
          </Form>
          <Nav className="ml-auto">
            {user ? (
              <>
                <Navbar.Text>
                  Signed in as: <a onClick={handleUserClick} style={{ cursor: 'pointer' }}>{user.userName}</a>
                </Navbar.Text>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Sign in</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

export default MyNavbar;