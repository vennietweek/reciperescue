import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand href="/">Recipe Rescue</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto"> 
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/shopping_list">Shopping List</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
