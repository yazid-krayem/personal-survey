import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as auth0Client from './auth';




class Main extends Component {
 
  
  renderViewMode() {
    const { createSurvey, author_id,survey_name,userList } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log(',',current_logged_in_user_id)
    
    return (
      <div>

        
        
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
    );
  }
  ifAuth(){
    const { createSurvey, author_id,survey_name,userList } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log('main',is_author)
    if(author_id === current_logged_in_user_id){
      return this.renderViewMode()
    }
    return this.auth0Client.signIn()
    
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
export default withRouter(Main);
 













