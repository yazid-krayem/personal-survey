import React from 'react';
import * as auth0Client from '../auth';
import { withRouter } from 'react-router-dom';
import './questionList.css'


export default class QuestionList extends React.Component {
  
  
  
  renderViewMode() {
    const { question_id, question_title,author_id,survey_name } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log('user-side',this.props)
console.log('question',this.props.survey_name)
    return (
      <div>

        <div >
<hr />
<div className="user-answer-section"> 
        <span>
          {question_id} - {question_title} 
        </span>
          <form onSubmit={this.onSave}>
          <input  
      placeholder="answer_text"
       name='answer_text_input'
            />
<button>Save</button>
          </form>
          </div>
        </div>
      </div>
    );
  }
  
   
  onSave = evt => {
    evt.preventDefault();
    const { createAnswer,question_id } = this.props;
    const form = evt.target;
    const answer_text_input = form.answer_text_input;
    const answer_text = answer_text_input.value;
    createAnswer({answer_text,question_id})
    
  };
 
    render() {
      return(
          <div>
           {this.renderViewMode()}
          </div>
      );
      }
    }
      
