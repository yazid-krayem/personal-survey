import React, { Component } from 'react';
import {Form,FormControl,Button, Navbar,Nav} from 'react-bootstrap';
import {Link,withRouter} from 'react-router-dom';
import IfAuthenticated from '../../IfAuthenticated';
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
          <p>here</p>
          <Link to="/">Home</Link> |
          <Link to="/profile">profile</Link> |
          <IfAuthenticated>
            <Link to="/create">create</Link>
          </IfAuthenticated>
        </div>

  </div>
    );
  }
}
export default Header