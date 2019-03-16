import React from 'react';
import * as auth0Client from '../auth';
import { withRouter } from 'react-router-dom';


export default class QuestionList extends React.Component {
  
  
  
  renderViewMode() {
    const { question_id, question_title,author_id,survey_name } = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    console.log(this.props)
console.log('question',this.props.survey_name)
    return (
      <div>

        <div >
        <h2 className="survey_name">{survey_name}</h2>

        <span>
          {question_id} - {question_title} 
        </span>
          <form onSubmit={this.onSave}>
          <input  
      placeholder="answer_text"
       name='answer_text_input'
            />
                <input type="submit" value="Save" />

          </form>
       
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
      
