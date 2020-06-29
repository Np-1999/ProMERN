import React from 'react';
import {
  Navbar, Nav, NavDropdown, Container,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import Contents from './Contents.jsx';
import IssueAddNav from './IssueAddNav.jsx';

function NavBar() {
  return (
    <Navbar bg="light">
      <Navbar.Brand> Issue Tracker</Navbar.Brand>
      <Nav>
        <LinkContainer exact to="/">
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/issues">
          <Nav.Link>IssueList</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/report">
          <Nav.Link>Report</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav className="ml-auto">
        <IssueAddNav />
        <NavDropdown title={<ThreeDotsVertical />} id="nav-dropdown">
          <Nav.Link>About</Nav.Link>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}
export default function Page() {
  return (
    <div>
      <NavBar />
      <Container fluid>
        <Contents />
      </Container>
    </div>
  );
}
