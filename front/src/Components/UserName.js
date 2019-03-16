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
        return <div><h1>{user_name}</h1>
        
        <div>
         

         <form onSubmit={this.link} className="mainForm">
     <input id="title" 
     placeholder="survey_name"
      name='survey_name_input'
           />
     <input className="mainButton" type="submit" value="Create Survey" />
     </form>
         </div>
      
        </div>
    }
}

link = (evt)=>{

    this.props.history.push('/survey')
    const { createSurvey } = this.props;
  
    const form = evt.target;
    const survey_name_input = form.survey_name_input;
    const survey_name = survey_name_input.value;
  
  
      // add the survey 
      
      createSurvey({ survey_name});
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
 













