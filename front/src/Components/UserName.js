import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as auth0Client from '../auth';




      
class UserName extends Component {
 
  
  renderViewMode() {
    const { createSurvey, author_id,auth0_sub,user_name } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log(',',current_logged_in_user_id)
    if(auth0_sub !== current_logged_in_user_id){
        return <div></div>
    }else{
        return <div>{user_name}</div>
    }
}


render() {
return(
    <div>
     {this.renderViewMode()}
    </div>
);
}
}
export default withRouter(UserName);
 













