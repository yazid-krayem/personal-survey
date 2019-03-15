import React from 'react';
import * as auth0Client from './auth';
import { pause, makeRequestUrl } from "./utils.js";


const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);

export default class DataCollection extends React.Component {
  
  
  renderViewMode() {
    const { createSurvey, author_id,survey_name,userList,survey_id } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log('dataCollection', current_logged_in_user_id)
    const { question_id, question_title,answer_text } = this.props;


    return (
      <div>

        <div >
        <span>
          {question_id} - {question_title} < br />
          {answer_text}
        </span>
         

       
        </div>
      </div>
    );
  }
  
  
 
    render() {
      return(
          <div>
           {this.renderViewMode()}
          </div>
      );
      }
    }
      
