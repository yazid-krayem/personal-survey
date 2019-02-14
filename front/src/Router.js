import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Submit from './Components/Submit'
import Link from './Components/Link'
import App from './App';


const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route exact path="/submit" component={Submit}/>
      <Route exact path="/link" component={Link} />
     
    </Switch>
  </BrowserRouter>
)


export default Router;