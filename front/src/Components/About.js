import React, { Component} from 'react';
import QuestionList from '../Components/QuestionList';
import { withRouter } from 'react-router-dom';
import { pause, makeRequestUrl } from "../utils.js";
import * as auth0Client from '../auth';


const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);

class About extends Component {
  state={
    toggle: false,
    survey_question:[],
    error_message: "",
    isLoading: false,
  }
  async componentDidMount() {
    const id = this.state.survey_id
    await this.getSurveyQuestions(id)    
   }
   
   //get Survey Question query
   getSurveyQuestions = async id => {
   
     try {
       const url = makeUrl(`survey/questions/${id}`)
       const response = await fetch(url,{
         headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}
       })
       const answer = await response.json();
       if (answer.success) {
         // add the user to the current list of contacts
         const question = answer.result;
         const survey_question =  question;
         this.setState({ survey_question });
       } else {
         this.setState({ error_message: answer.message });
       }
     } catch (err) {
       this.setState({ error_message: err.message });
     }
   };
 
  createAnswer = async props => {
    try {
      if (!props || !(props.answer_text && props.question_id )) {
        throw new Error(
          `errrrrrrrrrrrrrrrrrrrrror `
        );
      }
      const { answer_text,question_id,user_id } = props;
      const response = await fetch(
        `http://localhost:8080/answer/add?answer_text=${answer_text}&question_id=${question_id}&user_id=${user_id}`
      );
      const answer = await response.json();
      if (answer.success) {
        // const answer_id = answer.result;
        const answer = { answer_text };
        const answer_list = [...this.state.answer_list, answer];
        this.setState({ answer_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  change =() =>{
      this.props.history.push('/link')
  }
  
  surveyFormat =() =>{
    const  question = this.state.survey_question;
    const {error_message } = this.state;
    return(
      <div className="survey">
      <form onSubmit={this.SubmitQuestions}>
         {error_message ? <p> ERROR! {error_message}</p> : false}
        {question.map(question => (
          <QuestionList
            key={question.id}
            question_id={question.id}
            question_data={question.question_data}
            question_title={question.question_title}
            question_type={question.question_type}
          />
        ))}
        
        </form>

         <form>
          <div>
          <button onClick={this.change}>submit</button>
          </div>
          </form>



      </div>
    )
  }
render() {
return(
    <div>
      <p>About</p>
      {this.surveyFormat()}
  </div>
);
}
}
export default withRouter(About);













