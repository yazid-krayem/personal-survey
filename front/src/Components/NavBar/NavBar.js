import React, { Component } from 'react';
import {Form,FormControl,Button, Navbar,Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom'
class Header extends Component {
  render() {
    return (
        <div>
<Navbar bg="dark" variant="dark">
    <Navbar.Brand ><Link to='/About'>Survey</Link></Navbar.Brand>
    <Nav className="mr-auto">
      
    </Nav>
    <Form inline>
    </Form>
  </Navbar>      
  </div>
    );
  }
}
export default Header