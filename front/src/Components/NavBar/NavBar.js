import React, { Component } from 'react';
import {Form,FormControl,Button, Navbar,Nav,Alert} from 'react-bootstrap';
import {Link,withRouter} from 'react-router-dom';
import IfAuthenticated from '../../IfAuthenticated';
import * as auth0Client from '../../auth';
import './NavBar.css'
class Header extends Component {
  
  render() {
    
    return (
        <div className="mainNav">
 <Navbar bg="dark" variant="dark">
    <Navbar.Brand ><Link to='/'>Sudo</Link></Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link><Link to="/">Home</Link></Nav.Link>
      <IfAuthenticated>
    <Nav.Link><Link to="/work">Profile</Link></Nav.Link>
    </IfAuthenticated>
    </Nav>
    <Nav.Link eventKey={10} >
    
    <button onClick={auth0Client.signIn}>sign in</button>

      </Nav.Link>
      <Nav.Link eventKey={10} >
      <button className="pseudo cool" onClick={auth0Client.signOut}>sign out</button>

      </Nav.Link>

    <Form inline>
    </Form>
  </Navbar>   
  
  
  </div>
    );
  }
}
export default Header