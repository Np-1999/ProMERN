import React from 'react';
import {
  Navbar, Nav, NavDropdown, Container, Col
} from 'react-bootstrap';
import  Search  from "./Search.jsx";
import { LinkContainer } from 'react-router-bootstrap';
import { ThreeDotsVertical, PauseFill } from 'react-bootstrap-icons';
import Contents from './Contents.jsx';
import IssueAddNav from './IssueAddNav.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import UserContext from './UserContext.jsx';
import graphQLFetch from './graphQL.js';
import store from './store.js';

export default class Page extends React.Component {
  constructor(props){
    super(props);
    const user  = store.userData ? store.userData.user:null;
    delete store.userData;
    this.state = { user };
    this.onUserChange = this.onUserChange.bind(this);
  }
  static async fetchData(cookie){
    const query = `query{
      user { signedIn givenName}
    }`;
    const data = await graphQLFetch(query,null,null,cookie);
    return data;
  }
  async componentDidMount(){
    const { user } = this.state;
    if(user==null){
      const data = await Page.fetchData();
      this.setState({user: data.user});
    }
  }
  onUserChange(user){
    this.setState({user});
  }
  render(){
    const { user } = this.state;
    if(user == null ) return null;
    return (
      <div>
        <NavBar user ={user} onUserChange = {this.onUserChange} />
        <Container fluid>
          <UserContext.Provider value ={user}>
            <Contents />
          </UserContext.Provider>
        </Container>
      </div>
    );
  }
  
}
function NavBar({user, onUserChange}) {
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
        <Col sm={12}>
          <Search />
        </Col>
      </Nav>
      <Nav className="ml-auto">
        <IssueAddNav user={user}  />
        <SignInNavItem  user={user} onUserChange={onUserChange}/>
        <NavDropdown title={<ThreeDotsVertical />} id="nav-dropdown">
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

