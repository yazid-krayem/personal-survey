import React, { Component } from 'react';
import {Form,FormControl,Button, Navbar,Nav} from 'react-bootstrap';
import {Link,withRouter} from 'react-router-dom';
import IfAuthenticated from '../../IfAuthenticated';
import * as auth0Client from '../../auth';

class Header extends Component {
  
  render() {
    
    return (
        <div>
{/* <Navbar bg="dark" variant="dark">
    <Navbar.Brand ><Link to='/'>Survey</Link></Navbar.Brand>
    <Nav className="mr-auto">
      
    </Nav>
    <Form inline>
    </Form>
  </Navbar> */}      
          <div className="test">
          <Link to="/">Home</Link> |
          <Link to="/profile">profile</Link> |
          <IfAuthenticated>
            <Link to="/create">create</Link>
          </IfAuthenticated>
          <button onClick={auth0Client.signOut}>sing out</button>
          <button onClick={auth0Client.signIn}>sing in</button>
        </div>

  </div>
    );
  }
}
export default Header