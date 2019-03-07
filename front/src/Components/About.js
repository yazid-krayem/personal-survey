import React, { Component} from 'react';
import QuestionList from '../Components/QuestionList';
import { withRouter } from 'react-router-dom';



class About extends Component {
  state={
    toggle: false,
    question_list: [],
    error_message: "",
    isLoading: false,
  }
  async componentDidMount() {
    await this.getAllQuestions();
    
   }
   
  getAllQuestions = async order => {
    try {
      const response = await fetch(
        `//localhost:8080/questions/list`
      );
      const answer = await response.json();
      if (answer.success) {
        const question_list = answer.result;
        this.setState({ question_list });
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
      const { answer_text,question_id } = props;
      const user_id=1
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
    const  question = this.state.question_list;
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
          <button onClick={this.change}>mm</button>
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













