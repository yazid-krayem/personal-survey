import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Home from './Components/Home'
import Submit from './Components/Submit'
import Link from './Components/Link'


const Router = () => (
  <BrowserRouter>
    <Switch>
    <Route exact path="/" component={Home}/>
      <Route exact path="/submit" component={Submit}/>
      <Route exact path="/link" component={Link} />
     
    </Switch>
  </BrowserRouter>
)


export default Router;