import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as auth0Client from '../auth';
import Popup from "reactjs-popup";
import { Button } from 'react-bootstrap';




      
class UserName extends Component {
 
  
  renderViewMode() {
    const { createSurvey, author_id,auth0_sub,user_name,UNState } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log(',',current_logged_in_user_id)
    // const str = UNState.split('')
    // let user = user_name.split('')
    // let renderUser = user[0]
    // const test = UNState.slice(0,{user_name})
    var obj = user_name
    console.log(obj)
    var myJSON = JSON.stringify(obj);
    // var sako = user_name.splice(1)
    var test = user_name[0]
    let user_nameArr = user_name.split('')
    user_nameArr.splice(0,1)
    let finalNameToDisplay = user_nameArr.join('')


    if(auth0_sub !== current_logged_in_user_id){
        return <div></div>
    }else{

        return <div ><h2 className="h1-userName"><span className="span"><span style={{color:"#0074d9"}}>W</span>elcome </span><span><span style={{color:"#0074d9"}}>{test}</span>{finalNameToDisplay}</span></h2>
        <div className="popup">
        <Popup className="popup" trigger={<button className="createSurveybtn">Create Survey</button>} modal
    closeOnDocumentClick>
         
         <form onSubmit={this.link} >
     <input id="title" 
     placeholder="survey    name"
      name='survey_name_input'
           />
     {/* <input className="mainButton" type="submit" value="Create Survey" /> */}
     </form>
         </Popup>
         </div>
        </div>
    }
}

link = (evt)=>{

    this.props.history.push('/survey')
    const { createSurvey,user_name,UNState } = this.props;
  
    const form = evt.target;
    const survey_name_input = form.survey_name_input;
    const survey_name = survey_name_input.value;
  
  
      // add the survey 
      
      createSurvey({ survey_name});
      this.setState(prevState => ({
        UNState: [...prevState.UNState, user_name]
      }))
      console.log('username',user_name,'un',UNState,)
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
 













